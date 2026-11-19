'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-md">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
          Payment Cancelled
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          The Stripe checkout process was not completed and your card was not charged. You can
          try again anytime.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/dashboard/vendor/subscription"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md shadow-pizza-500/20 transition-all flex items-center justify-center space-x-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>Try Again</span>
        </Link>
        <Link
          href="/dashboard/vendor"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
