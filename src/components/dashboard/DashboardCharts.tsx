'use client';

import React from 'react';
import { motion } from 'motion/react';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface StatusDonutChartProps {
  title: string;
  subtitle?: string;
  centerLabel: string;
  segments: DonutSegment[];
}

export function StatusDonutChart({
  title,
  subtitle,
  centerLabel,
  segments,
}: StatusDonutChartProps) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeFraction = 0;

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
          Live Breakdown
        </span>
        <h3 className="mt-1 text-base font-extrabold tracking-tight text-[#18120E]">
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-xs text-[#6E6259]">{subtitle}</p>}
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row">
        {/* SVG Ring Gauge */}
        <div className="relative h-40 w-40 shrink-0">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="h-full w-full -rotate-90"
            aria-label={title}
          >
            {/* Base track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#FAF7F2"
              strokeWidth={strokeWidth}
            />

            {total > 0 &&
              segments.map((seg, idx) => {
                const value = Math.max(0, seg.value);
                if (value === 0) return null;
                const fraction = value / total;
                const dashLength = Math.max(0, fraction * circumference - 2);
                const dashOffset = -cumulativeFraction * circumference;
                cumulativeFraction += fraction;

                return (
                  <motion.circle
                    key={seg.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                    strokeDasharray={`${dashLength} ${circumference}`}
                    strokeDashoffset={dashOffset}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                );
              })}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-3xl leading-none text-[#18120E] tabular-nums">
              {total}
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#6E6259]">
              {centerLabel}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full flex-1 space-y-3">
          {segments.map((seg) => {
            const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
            return (
              <div key={seg.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-semibold text-[#18120E]">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span>{seg.label}</span>
                  </span>
                  <span className="font-bold text-[#6E6259] tabular-nums">
                    {seg.value} <span className="text-[11px] font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#FAF7F2]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: seg.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface BarDatum {
  label: string;
  value: number;
  color: string;
}

interface MetricBarChartProps {
  title: string;
  subtitle?: string;
  data: BarDatum[];
}

export function MetricBarChart({ title, subtitle, data }: MetricBarChartProps) {
  const maxVal = Math.max(1, ...data.map((d) => Math.max(0, d.value)));

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
          Volume Comparison
        </span>
        <h3 className="mt-1 text-base font-extrabold tracking-tight text-[#18120E]">
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-xs text-[#6E6259]">{subtitle}</p>}
      </div>

      <div className="space-y-4">
        {data.map((item, idx) => {
          const widthPct = item.value === 0 ? 0 : Math.max(8, Math.round((item.value / maxVal) * 100));
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#18120E]">{item.label}</span>
                <span className="font-display text-base tracking-wide text-[#18120E] tabular-nums">
                  {item.value}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#FAF7F2] ring-1 ring-inset ring-stone-200/60">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{
                    duration: 0.75,
                    delay: idx * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
