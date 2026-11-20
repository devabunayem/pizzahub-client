'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OvenEmberCanvasProps {
  className?: string;
}

const FLAME_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FLAME_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.05 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);

    // Gently bend upward rising flames with cursor X
    float wind = uMouse.x * 0.28 * pow(uv.y, 1.2);
    vec2 p = vec2((uv.x - 0.5 - wind) * aspect * 2.1, uv.y * 2.75);

    // Two scrolling FBM layers for organic hearth turbulence
    float t1 = uTime * 0.42;
    float n1 = fbm(p - vec2(0.0, t1));
    float n2 = fbm(p * 1.9 - vec2(n1 * 0.65, t1 * 1.65));
    float fireNoise = mix(n1, n2, 0.52);

    // Anchor glow strongest in the bottom ~42% and fade cleanly upward
    float baseHeight = smoothstep(0.58, 0.0, uv.y);
    float edgeMask = smoothstep(0.0, 0.14, uv.x) * smoothstep(1.0, 0.86, uv.x);
    float emberBed = smoothstep(0.22, 0.0, uv.y) * 0.55;

    float intensity = clamp(
      (fireNoise * 1.45 - (1.0 - baseHeight) * 0.62) * baseHeight * (0.45 + 0.55 * edgeMask) + emberBed,
      0.0,
      1.0
    );

    // PizzaHub editorial wood-oven palette
    vec3 deepRed = vec3(0.478, 0.063, 0.043);    // #7A100B
    vec3 crimson = vec3(0.851, 0.118, 0.094);    // #D91E18
    vec3 amber = vec3(0.851, 0.467, 0.024);      // #D97706
    vec3 goldCore = vec3(0.992, 0.902, 0.541);   // #FDE68A

    vec3 col = mix(deepRed, crimson, smoothstep(0.08, 0.38, intensity));
    col = mix(col, amber, smoothstep(0.36, 0.68, intensity));
    col = mix(col, goldCore, smoothstep(0.68, 0.96, intensity) * smoothstep(0.30, 0.0, uv.y));

    float alpha = smoothstep(0.05, 0.85, intensity) * 0.72;
    gl_FragColor = vec4(col, alpha);
  }
`;

export function OvenEmberCanvas({ className = '' }: OvenEmberCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let rafId = 0;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 2;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // 1. Procedural Wood-Oven Flame Shader Layer
    const flameGeometry = new THREE.PlaneGeometry(2, 2);
    const flameUniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };
    const flameMaterial = new THREE.ShaderMaterial({
      vertexShader: FLAME_VERTEX_SHADER,
      fragmentShader: FLAME_FRAGMENT_SHADER,
      uniforms: flameUniforms,
      transparent: true,
      depthWrite: false,
    });
    const flameMesh = new THREE.Mesh(flameGeometry, flameMaterial);
    flameMesh.position.z = 0;
    scene.add(flameMesh);

    // 2. Soft Radial Spark Texture
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = 64;
    spriteCanvas.height = 64;
    const ctx = spriteCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 244, 214, 1)');
      grad.addColorStop(0.32, 'rgba(217, 119, 6, 0.85)');
      grad.addColorStop(0.7, 'rgba(217, 30, 24, 0.35)');
      grad.addColorStop(1, 'rgba(217, 30, 24, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const sparkTexture = new THREE.CanvasTexture(spriteCanvas);

    // 3. Rising Hearth Sparks Overlay
    const sparkCount = 88;
    const positions = new Float32Array(sparkCount * 3);
    const colors = new Float32Array(sparkCount * 3);
    const speeds = new Float32Array(sparkCount);
    const phases = new Float32Array(sparkCount);

    const palette = [
      new THREE.Color('#FDE68A'),
      new THREE.Color('#D97706'),
      new THREE.Color('#E50916'),
      new THREE.Color('#9A4A12'),
    ];

    for (let i = 0; i < sparkCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = -1.0 + Math.random() * 2.0;
      positions[i * 3 + 2] = 0.5;

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      speeds[i] = 0.0022 + Math.random() * 0.0042;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const sparkGeometry = new THREE.BufferGeometry();
    sparkGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    sparkGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const sparkMaterial = new THREE.PointsMaterial({
      size: 9,
      sizeAttenuation: false,
      map: sparkTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const sparks = new THREE.Points(sparkGeometry, sparkMaterial);
    scene.add(sparks);

    let targetMouseX = 0;
    let targetMouseY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !renderer) return;
      const w = Math.max(entry.contentRect.width, 1);
      const h = Math.max(entry.contentRect.height, 1);
      flameUniforms.uResolution.value.set(w, h);
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    let lastTime = performance.now();
    let elapsed = 0;

    const animate = (now: number) => {
      rafId = window.requestAnimationFrame(animate);
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;
      elapsed += dt;

      flameUniforms.uTime.value = elapsed;
      flameUniforms.uMouse.value.x += (targetMouseX - flameUniforms.uMouse.value.x) * 0.04;
      flameUniforms.uMouse.value.y += (targetMouseY - flameUniforms.uMouse.value.y) * 0.04;

      const posAttr = sparkGeometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const windPush = flameUniforms.uMouse.value.x * 0.0028;

      for (let i = 0; i < sparkCount; i++) {
        arr[i * 3 + 1] += speeds[i] * (dt * 60);
        arr[i * 3] += Math.sin(elapsed * 1.6 + phases[i]) * 0.0014 + windPush;

        if (arr[i * 3 + 1] > 1.05) {
          arr[i * 3 + 1] = -1.04 - Math.random() * 0.15;
          arr[i * 3] = (Math.random() - 0.5) * 1.95;
        }
        if (arr[i * 3] > 1.08) arr[i * 3] = -1.05;
        if (arr[i * 3] < -1.08) arr[i * 3] = 1.05;
      }
      posAttr.needsUpdate = true;

      renderer?.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      flameGeometry.dispose();
      flameMaterial.dispose();
      sparkGeometry.dispose();
      sparkMaterial.dispose();
      sparkTexture.dispose();
      if (renderer) {
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_bottom,rgba(217,30,24,0.28),rgba(154,74,18,0.14)_40%,transparent_72%)] ${className}`}
    />
  );
}
