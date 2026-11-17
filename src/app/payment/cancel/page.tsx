'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Checkout cancelled
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-sm mx-auto">
          The Stripe checkout session was not completed and no payment was charged. You can retry anytime.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        <Link
          href="/dashboard/vendor/subscription"
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition-colors flex items-center justify-center space-x-1.5"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Retry checkout</span>
        </Link>
        <Link
          href="/dashboard/vendor"
          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium text-xs transition-colors flex items-center justify-center space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
