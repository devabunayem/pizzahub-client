'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  tone?: 'light' | 'dark';
}

export function Skeleton({ className = '', tone = 'light' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`${
        tone === 'dark' ? 'skeleton-shimmer-dark' : 'skeleton-shimmer'
      } rounded-md ${className}`}
    />
  );
}

// 1. Menu Item Card Skeleton (matches Featured & Browse Menu 3-col cards)
export function MenuCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/80 bg-white">
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Skeleton className="h-full w-full rounded-none" />
          <div className="absolute left-3.5 top-3.5">
            <Skeleton className="h-6 w-24 rounded-full" tone="dark" />
          </div>
          <div className="absolute right-3.5 top-3.5">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        <div className="space-y-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-6 w-3/5 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>

          <div className="space-y-2 pt-1">
            <Skeleton className="h-3.5 w-full rounded" />
            <Skeleton className="h-3.5 w-4/5 rounded" />
          </div>
        </div>
      </div>

      <div className="p-6 pt-2">
        <div className="mb-4 flex items-center justify-between gap-2 border-t border-stone-100 pt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3.5 w-28 rounded" />
          </div>
          <Skeleton className="h-3.5 w-24 rounded" />
        </div>
        <Skeleton className="h-11 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function MenuGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <MenuCardSkeleton key={i} />
      ))}
    </div>
  );
}

// 2. Full Home Page Skeleton
export function HomePageSkeleton() {
  return (
    <main className="w-full overflow-x-clip bg-white">
      {/* Hero Skeleton */}
      <section className="site-container py-10 md:py-14">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full min-w-0 flex-1 flex-col items-center space-y-6 md:items-start">
            <div className="flex items-center gap-3">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-3.5 w-36 rounded-full" />
              <Skeleton className="h-3.5 w-12 rounded-full" />
            </div>

            <div className="w-full max-w-lg space-y-3">
              <Skeleton className="mx-auto h-12 w-44 rounded-xl md:mx-0 sm:h-16" />
              <Skeleton className="mx-auto h-14 w-64 rounded-xl md:mx-0 sm:h-16" />
              <Skeleton className="mx-auto h-12 w-80 max-w-full rounded-xl md:mx-0 sm:h-16" />
            </div>

            <div className="w-full max-w-md space-y-2 border-l-[3px] border-stone-200 pl-4">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-5 w-48 rounded" />
                <Skeleton className="h-6 w-16 rounded" />
              </div>
              <Skeleton className="h-3.5 w-64 rounded" />
            </div>

            <div className="flex items-center gap-5">
              <Skeleton className="h-12 w-36 rounded-full" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 md:justify-start sm:gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <Skeleton className="h-16 w-16 rounded-full sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-[560px] flex-1">
            <div className="mx-auto aspect-square w-full max-w-[500px] p-4">
              <Skeleton className="h-full w-full rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section Skeleton */}
      <section className="border-y border-stone-200/70 bg-[#FAF7F2] py-16 md:py-24">
        <div className="site-container space-y-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-3">
              <Skeleton className="h-3.5 w-48 rounded-full" />
              <Skeleton className="h-11 w-72 rounded-xl" />
            </div>
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>

          <MenuGridSkeleton count={6} />
        </div>
      </section>
    </main>
  );
}

// 3. Full Browse Menu Page Skeleton
export function BrowseMenuPageSkeleton() {
  return (
    <section className="min-h-[85vh] bg-[#FAF7F2] py-10 md:py-14">
      <div className="site-container space-y-8">
        <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end">
          <div className="space-y-2.5">
            <Skeleton className="h-3.5 w-40 rounded-full" />
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-96 max-w-full rounded" />
          </div>
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>

        <div className="space-y-4 rounded-3xl border border-stone-200/90 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl sm:w-48" />
            <Skeleton className="h-11 w-full rounded-xl sm:w-44" />
            <Skeleton className="h-11 w-full rounded-xl sm:w-28" />
          </div>
          <div className="flex items-center gap-2 overflow-hidden pt-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-28 shrink-0 rounded-full" />
            ))}
          </div>
        </div>

        <MenuGridSkeleton count={6} />
      </div>
    </section>
  );
}

// 4. Dish Detail Page Skeleton
export function ItemDetailSkeleton() {
  return (
    <section className="min-h-[82vh] bg-[#FAF7F2] py-10 md:py-14">
      <div className="site-container space-y-8">
        <Skeleton className="h-9 w-40 rounded-full" />

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <div className="space-y-3.5 lg:col-span-7">
            <Skeleton className="aspect-[4/3] w-full rounded-3xl border border-stone-200/80" />
            <div className="flex gap-3">
              <Skeleton className="h-20 w-24 rounded-2xl" />
              <Skeleton className="h-20 w-24 rounded-2xl" />
              <Skeleton className="h-20 w-24 rounded-2xl" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-6 rounded-3xl border border-stone-200/90 bg-white p-7 sm:p-8">
              <div className="space-y-3">
                <Skeleton className="h-3.5 w-32 rounded-full" />
                <Skeleton className="h-10 w-4/5 rounded-xl" />
                <Skeleton className="h-8 w-24 rounded-lg" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-3/4 rounded" />
                </div>
              </div>

              <div className="space-y-2.5 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-44 rounded" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3.5 w-36 rounded" />
              </div>

              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 5. Split-Screen Editorial Auth Page Skeleton
export function AuthPageSkeleton({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  return (
    <section className="min-h-[calc(100vh-88px)] bg-[#FAF7F2] py-10 md:py-16">
      <div className="site-container">
        <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-stone-200/90 bg-white lg:grid-cols-12">
          {/* Dark Espresso Left Visual Panel Skeleton */}
          <div className="flex flex-col justify-between bg-[#18120E] p-8 sm:p-10 lg:col-span-5">
            <div className="space-y-6">
              <Skeleton className="h-7 w-40 rounded-full" tone="dark" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-56 rounded-xl" tone="dark" />
                <Skeleton className="h-10 w-44 rounded-xl" tone="dark" />
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3.5 w-full rounded" tone="dark" />
                <Skeleton className="h-3.5 w-5/6 rounded" tone="dark" />
              </div>
            </div>

            <div className="mt-10 space-y-3 border-t border-white/15 pt-6">
              <Skeleton className="h-3.5 w-4/5 rounded" tone="dark" />
              <Skeleton className="h-3.5 w-3/4 rounded" tone="dark" />
              <Skeleton className="h-3.5 w-4/5 rounded" tone="dark" />
            </div>
          </div>

          {/* Right Form Skeleton */}
          <div className="space-y-6 p-8 sm:p-10 lg:col-span-7 lg:p-12">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 rounded-full" />
                <Skeleton className="h-7 w-48 rounded-lg" />
              </div>
              <Skeleton className="h-11 w-11 rounded-2xl" />
            </div>

            {mode === 'signup' ? (
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
            ) : (
              <Skeleton className="h-20 w-full rounded-2xl" />
            )}

            <div className="space-y-4">
              {Array.from({ length: mode === 'signup' ? 4 : 2 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-28 rounded" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
              {mode === 'signup' && <Skeleton className="h-20 w-full rounded-2xl" />}
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>

            <div className="border-t border-stone-100 pt-5">
              <Skeleton className="mx-auto h-4 w-52 rounded" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 6. Profile Settings Skeleton
export function ProfileSettingsSkeleton() {
  return (
    <section className="min-h-[82vh] bg-[#FAF7F2] py-10 md:py-14">
      <div className="site-container">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="space-y-2 border-b border-stone-200 pb-6">
            <Skeleton className="h-3 w-32 rounded-full" />
            <Skeleton className="h-10 w-56 rounded-xl" />
            <Skeleton className="h-4 w-80 max-w-full rounded" />
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-stone-200/90 bg-white px-5 py-4">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-8 w-8 rounded-xl" />
              <Skeleton className="h-4 w-36 rounded" />
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>

          <div className="space-y-5 rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8">
            <div className="flex items-center space-x-4 border-b border-stone-100 pb-5">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-3.5 w-48 rounded" />
              </div>
            </div>

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
            ))}

            <div className="flex justify-end border-t border-stone-100 pt-4">
              <Skeleton className="h-11 w-36 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 7. Payment Status Skeleton
export function PaymentStatusSkeleton() {
  return (
    <section className="flex min-h-[78vh] items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-10 text-center">
        <Skeleton className="mx-auto h-14 w-14 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="mx-auto h-3 w-28 rounded-full" />
          <Skeleton className="mx-auto h-8 w-52 rounded-xl" />
          <Skeleton className="mx-auto h-3.5 w-72 max-w-full rounded" />
          <Skeleton className="mx-auto h-3.5 w-60 max-w-full rounded" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <Skeleton className="h-11 w-full rounded-full sm:w-40" />
          <Skeleton className="h-11 w-full rounded-full sm:w-36" />
        </div>
      </div>
    </section>
  );
}

// 8. Order Card Skeleton & List Skeleton
export function OrderCardSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-5 rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-6 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-start space-x-4">
        <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-44 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-3.5 w-48 rounded" />
          <Skeleton className="h-3.5 w-40 rounded" />
          <Skeleton className="h-3.5 w-64 max-w-full rounded" />
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start justify-between gap-3 border-t border-stone-100 pt-3 sm:flex-row lg:flex-col lg:items-end lg:border-t-0 lg:pt-0">
        <Skeleton className="h-7 w-24 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function OrderListSkeleton({
  count = 4,
  withFilterTabs = false,
}: {
  count?: number;
  withFilterTabs?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28 rounded-full" />
          <Skeleton className="h-9 w-52 rounded-xl" />
          <Skeleton className="h-4 w-72 max-w-full rounded" />
        </div>
        {withFilterTabs ? (
          <div className="flex gap-1.5 rounded-full border border-stone-200 bg-white p-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-16 rounded-full" />
            ))}
          </div>
        ) : (
          <Skeleton className="h-10 w-32 rounded-full" />
        )}
      </div>

      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// 9. Dashboard Overview Skeleton (4 metrics for Customer/Vendor or 6 for Admin)
export function DashboardOverviewSkeleton({
  metricCount = 4,
}: {
  metricCount?: 4 | 6;
}) {
  return (
    <div className="space-y-8">
      {/* Bold Dark Espresso Banner Skeleton */}
      <div className="flex flex-col justify-between gap-6 rounded-3xl border border-stone-800 bg-[#18120E] p-7 sm:p-9 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <Skeleton className="h-6 w-44 rounded-full" tone="dark" />
          <Skeleton className="h-11 w-72 max-w-full rounded-xl" tone="dark" />
          <Skeleton className="h-4 w-96 max-w-full rounded" tone="dark" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-40 rounded-full" tone="dark" />
          <Skeleton className="h-11 w-32 rounded-full" tone="dark" />
        </div>
      </div>

      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${
          metricCount === 6 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
        }`}
      >
        {Array.from({ length: metricCount }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-3xl border border-stone-200/90 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-10 w-10 rounded-2xl" />
            </div>
            <Skeleton className="h-9 w-20 rounded-lg" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    </div>
  );
}

// 10. Dashboard Shell Skeleton (Sidebar + Top Header + Overview)
export function DashboardShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <aside className="hidden w-72 shrink-0 flex-col justify-between border-r border-white/10 bg-[#18120E] p-6 lg:flex">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-9 w-9 rounded-xl" tone="dark" />
              <Skeleton className="h-6 w-28 rounded-md" tone="dark" />
            </div>
            <Skeleton className="ml-11 h-2.5 w-24 rounded" tone="dark" />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <Skeleton className="h-11 w-11 rounded-xl" tone="dark" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-24 rounded" tone="dark" />
              <Skeleton className="h-2.5 w-16 rounded" tone="dark" />
            </div>
          </div>

          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-2xl" tone="dark" />
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-white/10 pt-5">
          <Skeleton className="h-9 w-full rounded-xl" tone="dark" />
          <Skeleton className="h-9 w-full rounded-xl" tone="dark" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[72px] items-center justify-between border-b border-stone-200/80 bg-white px-4 sm:px-8">
          <Skeleton className="h-7 w-44 rounded-lg" />
          <div className="flex gap-3">
            <Skeleton className="hidden h-9 w-28 rounded-full sm:block" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </header>

        <main className="w-full max-w-6xl flex-1 p-5 sm:p-7 lg:p-8">
          <DashboardOverviewSkeleton />
        </main>
      </div>
    </div>
  );
}

// 11. Table Skeleton
export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32 rounded-full" />
          <Skeleton className="h-9 w-52 rounded-xl" />
          <Skeleton className="h-4 w-80 max-w-full rounded" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200/90 bg-white p-4 sm:flex-row">
        <Skeleton className="h-11 w-full rounded-xl sm:flex-1" />
        <Skeleton className="h-11 w-full rounded-xl sm:w-44" />
      </div>

      <div className="overflow-hidden rounded-3xl border border-stone-200/90 bg-white">
        <div className="flex justify-between border-b border-stone-200 bg-[#FAF7F2] p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20 rounded" />
          ))}
        </div>

        <div className="divide-y divide-stone-100 p-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </div>
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-5 w-16 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <div className="flex gap-1.5">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
