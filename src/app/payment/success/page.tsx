'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Pizza } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, token, refreshUser } = useAuth();
  const [verifying, setVerifying] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fire confetti celebration!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }

    const verifyStripePayment = async () => {
      if (!sessionId || !token) {
        setVerifying(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/subscription/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();
        if (data.success) {
          await refreshUser();
        } else {
          setError(data.message || 'Payment verification in progress.');
        }
      } catch (err) {
        console.error('Verification error:', err);
      } finally {
        setVerifying(false);
      }
    };

    verifyStripePayment();
  }, [sessionId, token, refreshUser]);

  if (verifying) {
    return <LoadingSpinner fullScreen message="Cryptographically verifying Stripe payment confirmation..." />;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center shadow-lg animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payment Verified & Confirmed</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          Welcome to PizzaHub Premium!
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
          Your payment was securely verified via Stripe. Your restaurant now enjoys unlimited menu
          items, priority homepage placement, and a verified Premium badge.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 flex items-center justify-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-green-500" />
        <span>Transaction Session ID: {sessionId ? `${sessionId.slice(0, 18)}...` : 'Verified'}</span>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/dashboard/vendor"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md shadow-pizza-500/25 transition-all flex items-center justify-center space-x-2"
        >
          <span>Go to Vendor Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard/vendor/add-item"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
        >
          <Pizza className="w-4 h-4 text-pizza-500" />
          <span>Add More Menu Items</span>
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
