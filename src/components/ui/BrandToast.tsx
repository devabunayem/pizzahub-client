'use client';

import React from 'react';
import hotToast, { type Toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { Check, AlertCircle, Info, AlertTriangle, Loader2, X, Flame } from 'lucide-react';

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
    badgeClass: string;
    eyebrow: string;
    eyebrowColor: string;
    progressBarClass: string;
    spin?: boolean;
  }
> = {
  success: {
    icon: Check,
    badgeClass:
      'bg-[#E50916]/15 text-[#ff6b6b] ring-1 ring-[#E50916]/40 shadow-[0_0_16px_-2px_rgba(229,9,22,0.45)]',
    eyebrow: 'PizzaHub',
    eyebrowColor: 'text-emerald-400',
    progressBarClass: 'from-[#E50916] via-[#D97706] to-emerald-400',
  },
  error: {
    icon: AlertCircle,
    badgeClass:
      'bg-[#E50916] text-white ring-1 ring-[#ff6b6b]/40 shadow-[0_0_18px_-2px_rgba(229,9,22,0.65)]',
    eyebrow: 'Action Needed',
    eyebrowColor: 'text-[#ff6b6b]',
    progressBarClass: 'from-[#E50916] to-[#ff6b6b]',
  },
  info: {
    icon: Info,
    badgeClass:
      'bg-[#D97706]/20 text-amber-300 ring-1 ring-[#D97706]/45 shadow-[0_0_16px_-2px_rgba(217,119,6,0.4)]',
    eyebrow: 'Update',
    eyebrowColor: 'text-[#D97706]',
    progressBarClass: 'from-[#E50916] to-[#D97706]',
  },
  warning: {
    icon: AlertTriangle,
    badgeClass:
      'bg-[#D97706]/20 text-amber-300 ring-1 ring-amber-400/45 shadow-[0_0_16px_-2px_rgba(217,119,6,0.45)]',
    eyebrow: 'Notice',
    eyebrowColor: 'text-amber-300',
    progressBarClass: 'from-[#E50916] to-amber-400',
  },
  loading: {
    icon: Loader2,
    badgeClass: 'bg-[#E50916]/20 text-[#FAF7F2] ring-1 ring-[#E50916]/40',
    eyebrow: 'Firing Oven',
    eyebrowColor: 'text-[#D97706]',
    progressBarClass: 'from-[#E50916] to-[#D97706]',
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
      initial={{ opacity: 0, y: -22, scale: 0.86 }}
      animate={
        t.visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: -12, scale: 0.9 }
      }
      transition={{
        type: 'spring',
        stiffness: 460,
        damping: 21,
        mass: 0.8,
      }}
      className="pointer-events-auto relative w-full max-w-[365px] overflow-hidden rounded-2xl border border-[#E50916]/25 bg-[#18120E]/95 text-[#FAF7F2] shadow-[0_22px_48px_-14px_rgba(24,18,14,0.6),0_0_24px_-10px_rgba(229,9,22,0.35)] backdrop-blur-xl"
    >
      {/* Signature PizzaHub Wood-Ember Top Hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#E50916] via-[#D97706] to-transparent" />

      <div className="flex items-start gap-3 px-3.5 py-3">
        <motion.span
          initial={{ scale: 0.55, rotate: -14 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 520,
            damping: 18,
            delay: 0.05,
          }}
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${meta.badgeClass}`}
        >
          <Icon className={`h-4 w-4 ${meta.spin ? 'animate-spin' : ''}`} />
        </motion.span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em]">
            <Flame className="h-2.5 w-2.5 text-[#E50916]" />
            <span className={meta.eyebrowColor}>{meta.eyebrow}</span>
          </div>

          <p className="mt-0.5 break-words text-[13px] font-semibold leading-snug text-[#FAF7F2]">
            {title}
          </p>
          {description && (
            <p className="mt-0.5 break-words text-[12px] leading-relaxed text-stone-300">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => hotToast.dismiss(t.id)}
          aria-label="Dismiss notification"
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-[#E50916]/20 hover:text-white cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Live Countdown Bar */}
      {variant !== 'loading' && (
        <div className="h-[2px] w-full bg-white/5">
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: t.visible ? 0 : 0 }}
            transition={{ duration: durationSec, ease: 'linear' }}
            style={{ transformOrigin: 'left center' }}
            className={`h-full w-full bg-gradient-to-r ${meta.progressBarClass}`}
          />
        </div>
      )}
    </motion.div>
  );
}
