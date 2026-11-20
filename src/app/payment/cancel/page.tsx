'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { PaymentStatusSkeleton } from '@/components/ui/Skeleton';

export default function PaymentCancelPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin?redirect=/payment/cancel');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <PaymentStatusSkeleton />;
  }

  return (
    <section className="flex min-h-[78vh] items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-10 text-center shadow-[0_24px_48px_-22px_rgba(24,18,14,0.16)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-200 bg-[#FAF7F2] text-[#9A4A12]">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A4A12]">
            Stripe Session
          </span>
          <h1 className="font-display text-3xl uppercase tracking-tight text-[#18120E]">
            Checkout Cancelled
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#6E6259]">
            The Stripe checkout session was not completed and no payment was charged. You can retry anytime.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link
            href="/dashboard/vendor/subscription"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#E50916] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#c80814] sm:w-auto"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Retry Checkout</span>
          </Link>
          <Link
            href="/dashboard/vendor"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-[#FAF7F2] px-6 py-3 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18] sm:w-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
