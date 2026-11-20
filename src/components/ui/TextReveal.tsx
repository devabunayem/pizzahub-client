'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface TextRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  immediate?: boolean;
}

export function TextReveal({
  children,
  delay = 0,
  duration = 0.72,
  className = '',
  immediate = false,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const visible = immediate || isInView;

  return (
    <span
      ref={ref}
      className={`inline-block overflow-hidden align-bottom pb-[0.18em] -mb-[0.18em] pr-[0.06em] -mr-[0.06em] ${className}`}
    >
      <motion.span
        className="inline-block"
        initial={{ y: '100%', opacity: 0 }}
        animate={visible ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
