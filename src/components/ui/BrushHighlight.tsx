'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface BrushHighlightProps {
  children: React.ReactNode;
  color?: string;
  secondaryColor?: string;
  delay?: number;
  immediate?: boolean;
  className?: string;
}

/**
 * Wraps highlighted editorial copy with an animated hand-drawn
 * half-rounded tapered brush underline stroke matching our brand palette.
 */
export function BrushHighlight({
  children,
  color = '#D91E18',
  secondaryColor = '#9A4A12',
  delay = 0.42,
  immediate = false,
  className = '',
}: BrushHighlightProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const active = immediate || isInView;

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 220 28"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.14em] left-[-3%] z-0 h-[0.28em] w-[106%] overflow-visible"
      >
        <motion.path
          d="M6 19.5C58 6.5 148 5.2 214 16.5"
          stroke={color}
          strokeWidth="6.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.92 } : { pathLength: 0, opacity: 0 }}
          transition={{
            pathLength: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.2, delay },
          }}
        />
        <motion.path
          d="M34 24.5C94 14.5 162 14.2 198 20.5"
          stroke={secondaryColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={active ? { pathLength: 1, opacity: 0.55 } : { pathLength: 0, opacity: 0 }}
          transition={{
            pathLength: { duration: 0.55, delay: delay + 0.18, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.2, delay: delay + 0.18 },
          }}
        />
      </svg>
    </span>
  );
}
