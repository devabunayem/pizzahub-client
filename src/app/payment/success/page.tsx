'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, ArrowRight, Pizza } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentStatusSkeleton } from '@/components/ui/Skeleton';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, token, refreshUser, isLoading: authLoading } = useAuth();
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin?redirect=/payment/success');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }

    const checkWebhookStatus = async () => {
      if (!sessionId || !token) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/subscription/session-status/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await res.json();
        await refreshUser();
      } catch (err) {
        console.error('Status check error:', err);
      } finally {
        setChecking(false);
      }
    };

    checkWebhookStatus();
  }, [sessionId, token, refreshUser, authLoading, user]);

  if (authLoading || !user || checking) {
    return <PaymentStatusSkeleton />;
  }

  return (
    <section className="flex min-h-[78vh] items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-10 text-center shadow-[0_24px_48px_-22px_rgba(24,18,14,0.16)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A4A12]">
            Stripe Verified
          </span>
          <h1 className="font-display text-3xl uppercase tracking-tight text-[#18120E]">
            Payment Confirmed
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#6E6259]">
            Your payment was processed by Stripe. Premium partner access is activated via the verified Stripe webhook.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link
            href="/dashboard/vendor"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#18120E] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#D91E18] sm:w-auto"
          >
            <span>Kitchen Overview</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/dashboard/vendor/add-item"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-[#FAF7F2] px-6 py-3 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18] sm:w-auto"
          >
            <Pizza className="h-3.5 w-3.5" />
            <span>Publish Dish</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentStatusSkeleton />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
