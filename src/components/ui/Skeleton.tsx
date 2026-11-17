'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-shimmer rounded-md ${className}`}
    />
  );
}

// 1. Menu Item Card Skeleton
export function MenuCardSkeleton() {
  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Pizza Image Placeholder */}
        <Skeleton className="w-full aspect-[4/3] rounded-none" />

        <div className="p-4 space-y-3">
          {/* Category Chip & Price Row */}
          <div className="flex items-center justify-between">
            <Skeleton className="w-20 h-4 rounded-full" />
            <Skeleton className="w-14 h-4 rounded" />
          </div>

          {/* Dish Title */}
          <Skeleton className="w-3/4 h-5 rounded" />

          {/* Description Lines */}
          <div className="space-y-1.5 pt-1">
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-5/6 h-3 rounded" />
          </div>

          {/* Location & Vendor Line */}
          <div className="pt-2 flex items-center space-x-2">
            <Skeleton className="w-3.5 h-3.5 rounded-full" />
            <Skeleton className="w-1/2 h-3 rounded" />
          </div>
        </div>
      </div>

      {/* Button Footer */}
      <div className="p-4 pt-0">
        <Skeleton className="w-full h-8 rounded-lg" />
      </div>
    </div>
  );
}

// Grid of Menu Cards
export function MenuGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </div>
  );
}

// 2. Dish Detail Page Skeleton
export function ItemDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Back button */}
      <Skeleton className="w-28 h-6 rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Images */}
        <div className="lg:col-span-7 space-y-3">
          <Skeleton className="w-full aspect-[4/3] rounded-xl border border-stone-200 dark:border-stone-800" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="w-full aspect-[4/3] rounded-lg border border-stone-200 dark:border-stone-800" />
            <Skeleton className="w-full aspect-[4/3] rounded-lg border border-stone-200 dark:border-stone-800" />
            <Skeleton className="w-full aspect-[4/3] rounded-lg border border-stone-200 dark:border-stone-800" />
          </div>
        </div>

        {/* Right: Info & Order Box */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-24 h-5 rounded-full" />
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>

            <Skeleton className="w-3/4 h-8 rounded" />
            <Skeleton className="w-24 h-6 rounded" />

            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <Skeleton className="w-full h-3.5 rounded" />
              <Skeleton className="w-full h-3.5 rounded" />
              <Skeleton className="w-4/5 h-3.5 rounded" />
            </div>

            {/* Vendor Card */}
            <div className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="w-1/2 h-3.5 rounded" />
                  <Skeleton className="w-1/3 h-2.5 rounded" />
                </div>
              </div>
            </div>

            {/* Action */}
            <Skeleton className="w-full h-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Order Card Skeleton (for Customer & Vendor order lists)
export function OrderCardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div className="flex items-start space-x-4 min-w-0 flex-1">
        <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
        <div className="space-y-2 min-w-0 flex-1">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-40 h-4 rounded" />
            <Skeleton className="w-16 h-4 rounded" />
          </div>
          <Skeleton className="w-48 h-3 rounded" />
          <Skeleton className="w-36 h-3 rounded" />
          <Skeleton className="w-64 h-3 rounded" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800">
        <Skeleton className="w-20 h-6 rounded-md" />
        <div className="flex space-x-2">
          <Skeleton className="w-24 h-7 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// List of Order Card Skeletons
export function OrderListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  );
}

// 4. Dashboard Overview Skeleton (Metrics cards + Recent items table)
export function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5 space-y-2">
        <Skeleton className="w-48 h-7 rounded-md" />
        <Skeleton className="w-80 h-3.5 rounded" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-3 rounded" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
            <Skeleton className="w-16 h-7 rounded" />
            <Skeleton className="w-28 h-2.5 rounded" />
          </div>
        ))}
      </div>

      {/* Recent activity card */}
      <div className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="w-32 h-4 rounded" />
            <Skeleton className="w-48 h-3 rounded" />
          </div>
          <Skeleton className="w-16 h-4 rounded" />
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="w-36 h-3.5 rounded" />
                  <Skeleton className="w-24 h-2.5 rounded" />
                </div>
              </div>
              <Skeleton className="w-16 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. Table Skeleton (for Users, Menu Moderation, Transactions)
export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header skeleton */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5 space-y-2">
        <Skeleton className="w-44 h-7 rounded-md" />
        <Skeleton className="w-80 h-3.5 rounded" />
      </div>

      {/* Filter toolbar skeleton */}
      <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col sm:flex-row items-center gap-3">
        <Skeleton className="w-full sm:flex-1 h-9 rounded-lg" />
        <Skeleton className="w-full sm:w-36 h-9 rounded-lg" />
      </div>

      {/* Table container */}
      <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden">
        <div className="p-4 bg-stone-50/70 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 flex justify-between">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-3 rounded" />
          ))}
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800 p-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="py-3 px-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="w-32 h-3.5 rounded" />
                  <Skeleton className="w-24 h-2.5 rounded" />
                </div>
              </div>
              <Skeleton className="w-20 h-4 rounded" />
              <Skeleton className="w-16 h-4 rounded" />
              <Skeleton className="w-14 h-5 rounded-md" />
              <Skeleton className="w-16 h-6 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
