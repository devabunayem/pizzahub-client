'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type StatTone = 'dark' | 'crimson' | 'amber' | 'emerald' | 'espresso';

interface PremiumStatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: StatTone;
  href?: string;
  highlight?: boolean;
  sparkline?: number[];
}

const DEFAULT_SPARKLINE = [28, 42, 36, 58, 52, 76];

function buildSparklinePaths(points: number[], width = 76, height = 28) {
  const safe = points.length >= 2 ? points : DEFAULT_SPARKLINE;
  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const span = max - min || 1;

  const coords = safe.map((val, idx) => {
    const x = (idx / (safe.length - 1)) * width;
    const y = height - 4 - ((val - min) / span) * (height - 8);
    return [Number(x.toFixed(1)), Number(y.toFixed(1))] as const;
  });

  const line = coords
    .map(([x, y], idx) => {
      if (idx === 0) return `M ${x} ${y}`;
      const [px, py] = coords[idx - 1];
      const cx = Number(((px + x) / 2).toFixed(1));
      return `C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`;
    })
    .join(' ');

  return { line, end: coords[coords.length - 1] };
}

const TONE_MAP: Record<
  StatTone,
  {
    wrapper: string;
    label: string;
    dot: string;
    value: string;
    subtitle: string;
    footerBorder: string;
    medallion: string;
    badge: string;
    stroke: string;
  }
> = {
  dark: {
    wrapper:
      'border-stone-800 bg-[#18120E] text-white shadow-[0_22px_46px_-22px_rgba(24,18,14,0.55)] ring-1 ring-inset ring-white/[0.06]',
    label: 'text-stone-300',
    dot: 'bg-[#E50916]',
    value: 'text-white',
    subtitle: 'text-stone-400',
    footerBorder: 'border-white/10',
    medallion: 'bg-[#E50916] text-white shadow-[0_10px_20px_-8px_rgba(229,9,22,0.75)]',
    badge: 'bg-white/10 text-stone-200 border border-white/10',
    stroke: '#E50916',
  },
  crimson: {
    wrapper:
      'border-stone-200/90 bg-gradient-to-b from-white to-[#FCF9F4] text-[#18120E] shadow-[0_14px_34px_-22px_rgba(24,18,14,0.16)] hover:border-[#D91E18]/40',
    label: 'text-[#6E6259]',
    dot: 'bg-[#D91E18]',
    value: 'text-[#18120E]',
    subtitle: 'text-[#6E6259]',
    footerBorder: 'border-stone-200/70',
    medallion: 'bg-red-50 text-[#D91E18] ring-1 ring-inset ring-red-200/70',
    badge: 'bg-red-50 text-[#D91E18] border border-red-200/60',
    stroke: '#D91E18',
  },
  amber: {
    wrapper:
      'border-stone-200/90 bg-gradient-to-b from-white to-[#FCF9F4] text-[#18120E] shadow-[0_14px_34px_-22px_rgba(24,18,14,0.16)] hover:border-[#9A4A12]/40',
    label: 'text-[#6E6259]',
    dot: 'bg-[#D97706]',
    value: 'text-[#9A4A12]',
    subtitle: 'text-[#6E6259]',
    footerBorder: 'border-stone-200/70',
    medallion: 'bg-amber-50 text-[#9A4A12] ring-1 ring-inset ring-amber-200/80',
    badge: 'bg-amber-50 text-[#9A4A12] border border-amber-200/70',
    stroke: '#D97706',
  },
  emerald: {
    wrapper:
      'border-stone-200/90 bg-gradient-to-b from-white to-[#FCF9F4] text-[#18120E] shadow-[0_14px_34px_-22px_rgba(24,18,14,0.16)] hover:border-emerald-500/40',
    label: 'text-[#6E6259]',
    dot: 'bg-emerald-600',
    value: 'text-emerald-700',
    subtitle: 'text-[#6E6259]',
    footerBorder: 'border-stone-200/70',
    medallion: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80',
    badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200/70',
    stroke: '#15803D',
  },
  espresso: {
    wrapper:
      'border-stone-200/90 bg-gradient-to-b from-white to-[#FCF9F4] text-[#18120E] shadow-[0_14px_34px_-22px_rgba(24,18,14,0.16)] hover:border-[#18120E]/30',
    label: 'text-[#6E6259]',
    dot: 'bg-[#18120E]',
    value: 'text-[#18120E]',
    subtitle: 'text-[#6E6259]',
    footerBorder: 'border-stone-200/70',
    medallion: 'bg-[#FAF7F2] text-[#18120E] ring-1 ring-inset ring-stone-200',
    badge: 'bg-[#FAF7F2] text-[#18120E] border border-stone-200',
    stroke: '#18120E',
  },
};

export function PremiumStatCard({
  label,
  value,
  subtitle,
  badge,
  icon: Icon,
  tone = 'espresso',
  href,
  highlight = false,
  sparkline = DEFAULT_SPARKLINE,
}: PremiumStatCardProps) {
  const styles = TONE_MAP[tone];
  const { line, end } = buildSparklinePaths(sparkline);

  const cardBody = (
    <div
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-0.5 ${
        styles.wrapper
      } ${highlight && tone !== 'dark' ? 'border-[#D91E18]/50 ring-2 ring-[#D91E18]/15' : ''}`}
    >
      {/* Subtle Ambient Corner Glow */}
      {tone === 'dark' ? (
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#E50916]/20 blur-2xl" />
      ) : (
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#FAF7F2] opacity-80 blur-xl" />
      )}

      {/* Header: Live Dot + Label + Ringed Medallion */}
      <div className="relative z-10 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
          <span
            className={`truncate text-[10px] font-bold uppercase tracking-[0.16em] ${styles.label}`}
          >
            {label}
          </span>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${styles.medallion}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Primary KPI Metric + Smooth Micro Sparkline */}
      <div className="relative z-10 my-2.5 flex items-end justify-between gap-3">
        <div className={`font-display text-3xl leading-none tracking-tight tabular-nums ${styles.value}`}>
          {value}
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 76 28"
          className="h-6 w-[68px] shrink-0 overflow-visible opacity-75 transition-opacity group-hover:opacity-100"
          fill="none"
        >
          <path
            d={line}
            stroke={styles.stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx={end[0]} cy={end[1]} r="2.75" fill={styles.stroke} />
        </svg>
      </div>

      {/* Footer Meta + Pill Badge / Arrow */}
      <div
        className={`relative z-10 flex items-center justify-between gap-2 border-t pt-2.5 text-xs ${styles.footerBorder}`}
      >
        <span className={`truncate font-medium ${styles.subtitle}`}>{subtitle}</span>

        {href ? (
          <ArrowRight
            className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
              tone === 'dark' ? 'text-stone-300 group-hover:text-white' : 'text-stone-400 group-hover:text-[#D91E18]'
            }`}
          />
        ) : badge ? (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styles.badge}`}
          >
            {badge}
          </span>
        ) : null}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardBody}
      </Link>
    );
  }

  return cardBody;
}
