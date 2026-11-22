'use client';

import React from 'react';
import hotToast, { type Toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { Check, AlertCircle, Info, AlertTriangle, Loader2, X } from 'lucide-react';

export type BrandToastVariant = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface BrandToastProps {
  t: Toast;
  variant: BrandToastVariant;
  title: string;
  description?: string;
}

const VARIANT_META: Record<
  BrandToastVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    dotClass: string;
    spin?: boolean;
  }
> = {
  success: {
    icon: Check,
    dotClass: 'bg-emerald-500 text-white',
  },
  error: {
    icon: AlertCircle,
    dotClass: 'bg-[#E50916] text-white',
  },
  info: {
    icon: Info,
    dotClass: 'bg-[#D97706] text-white',
  },
  warning: {
    icon: AlertTriangle,
    dotClass: 'bg-amber-500 text-[#18120E]',
  },
  loading: {
    icon: Loader2,
    dotClass: 'bg-white/15 text-[#FAF7F2]',
    spin: true,
  },
};

export function BrandToast({ t, variant, title, description }: BrandToastProps) {
  const meta = VARIANT_META[variant];
  const Icon = meta.icon;
  const durationSec =
    t.duration && Number.isFinite(t.duration) ? Math.max(t.duration / 1000, 1.5) : 4.2;

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: -18, scale: 0.9 }}
      animate={
        t.visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: -10, scale: 0.92 }
      }
      transition={{
        type: 'spring',
        stiffness: 460,
        damping: 22,
        mass: 0.8,
      }}
      className="pointer-events-auto relative w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-[#18120E] text-[#FAF7F2] shadow-[0_14px_32px_-12px_rgba(24,18,14,0.45)]"
    >
      <div className="flex items-center gap-3 px-3.5 py-3">
        <motion.span
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 520,
            damping: 18,
            delay: 0.04,
          }}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${meta.dotClass}`}
        >
          <Icon className={`h-3.5 w-3.5 stroke-[2.5] ${meta.spin ? 'animate-spin' : ''}`} />
        </motion.span>

        <div className="min-w-0 flex-1">
          <p className="break-words text-[13px] font-medium leading-snug text-[#FAF7F2]">
            {title}
          </p>
          {description && (
            <p className="mt-0.5 break-words text-[12px] leading-snug text-stone-400">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => hotToast.dismiss(t.id)}
          aria-label="Dismiss notification"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Minimal flat solid brand-red countdown line */}
      {variant !== 'loading' && (
        <div className="h-[2px] w-full bg-white/5">
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: durationSec, ease: 'linear' }}
            style={{ transformOrigin: 'left center' }}
            className="h-full w-full bg-[#E50916]"
          />
        </div>
      )}
    </motion.div>
  );
}
