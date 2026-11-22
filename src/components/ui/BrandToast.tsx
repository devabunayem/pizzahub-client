'use client';

import React from 'react';
import hotToast, { type Toast } from 'react-hot-toast';
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
    badgeClass: string;
    accentBorder: string;
    spin?: boolean;
  }
> = {
  success: {
    icon: Check,
    badgeClass: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
    accentBorder: 'border-emerald-500/20',
  },
  error: {
    icon: AlertCircle,
    badgeClass: 'bg-[#E50916]/15 text-[#ff6b6b] ring-1 ring-[#E50916]/35',
    accentBorder: 'border-[#E50916]/25',
  },
  info: {
    icon: Info,
    badgeClass: 'bg-[#D97706]/15 text-amber-400 ring-1 ring-[#D97706]/30',
    accentBorder: 'border-[#D97706]/25',
  },
  warning: {
    icon: AlertTriangle,
    badgeClass: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/30',
    accentBorder: 'border-amber-500/25',
  },
  loading: {
    icon: Loader2,
    badgeClass: 'bg-white/10 text-[#FAF7F2] ring-1 ring-white/15',
    accentBorder: 'border-white/10',
    spin: true,
  },
};

export function BrandToast({ t, variant, title, description }: BrandToastProps) {
  const meta = VARIANT_META[variant];
  const Icon = meta.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex w-full max-w-[360px] items-start gap-3 rounded-2xl border ${meta.accentBorder} bg-[#18120E]/95 px-3.5 py-3 text-[#FAF7F2] shadow-[0_18px_40px_-14px_rgba(24,18,14,0.5)] backdrop-blur-xl transition-all duration-200 ${
        t.visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-2 opacity-0 scale-95'
      }`}
    >
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${meta.badgeClass}`}
      >
        <Icon className={`h-4 w-4 ${meta.spin ? 'animate-spin' : ''}`} />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="break-words text-[13px] font-semibold leading-snug text-[#FAF7F2]">
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
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-white/10 hover:text-white cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
