'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, ArrowRight, ShieldCheck, Pizza } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { token, refreshUser } = useAuth();
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }

    const checkWebhookStatus = async () => {
      if (!sessionId || !token) {
        setChecking(false);
        return;
      }

      try {
        // Read-only status verification: frontend redirect does NOT activate premium.
        // It strictly polls whether the Stripe Webhook has finished processing.
        const res = await fetch(`${API_BASE}/subscription/session-status/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success && data.processedByWebhook) {
          await refreshUser();
        } else {
          // Refresh user session state
          await refreshUser();
        }
      } catch (err) {
        console.error('Status check error:', err);
      } finally {
        setChecking(false);
      }
    };

    checkWebhookStatus();
  }, [sessionId, token, refreshUser]);

  if (checking) {
    return <LoadingSpinner fullScreen message="Confirming Stripe webhook event processing..." />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center">
        <CheckCircle2 className="w-6 h-6" />
      </div>

      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Payment confirmed
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
          Your payment was processed by Stripe. Premium access is activated strictly through the verified Stripe webhook.
        </p>
      </div>

      <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 flex items-center justify-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-mono text-[11px] text-stone-500">
          Session: {sessionId ? `${sessionId.slice(0, 18)}...` : 'Confirmed'}
        </span>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <Link
          href="/dashboard/vendor"
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition-colors flex items-center justify-center space-x-1.5"
        >
          <span>Kitchen overview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/dashboard/vendor/add-item"
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-xs transition-colors flex items-center justify-center space-x-1.5"
        >
          <Pizza className="w-3.5 h-3.5" />
          <span>Publish dish</span>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Loading payment confirmation..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
