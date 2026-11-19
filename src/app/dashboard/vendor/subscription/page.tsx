'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Check,
  CreditCard,
  Star,
  Clock,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VendorSubscriptionPage() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const isPremium = user?.subscriptionPlan === 'premium';

  const handleUpgrade = async () => {
    setLoading(true);
    const toastId = toast.loading('Initializing Stripe Checkout Session...');

    try {
      const res = await fetch(`${API_BASE}/subscription/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success && data.url) {
        toast.success('Redirecting to Stripe payment gateway...', { id: toastId });
        window.location.href = data.url;
      } else {
        toast.error(data.message || 'Failed to start Stripe checkout.', { id: toastId });
      }
    } catch (err) {
      console.error('Stripe initialization error:', err);
      toast.error('Network error. Unable to reach Stripe service.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
          Subscription plan
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Review your current tier or upgrade to Premium for unlimited active menu items and priority placement.
        </p>
      </div>

      {/* Current Plan Alert */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              isPremium
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            {isPremium ? <Star className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-xs text-stone-500 dark:text-stone-400">Current tier</p>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 capitalize">
              {user?.subscriptionPlan} tier {isPremium && '· Verified'}
            </p>
          </div>
        </div>

        {isPremium ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-medium">
            <Check className="w-3.5 h-3.5" /> Active subscription
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 text-xs font-medium">
            Free tier (maximum 3 active items)
          </span>
        )}
      </div>

      {/* Pricing Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Free Plan */}
        <div className="p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Starter tier
              </span>
              <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-1">Free plan</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Standard access for local kitchens testing the platform.
              </p>
            </div>

            <div className="text-2xl font-semibold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
              $0{' '}
              <span className="text-xs font-normal text-stone-500 tracking-normal font-sans">/ month</span>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Maximum 3 active menu items</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Standard kitchen dashboard & order management</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
                <span>Order accept and reject workflows</span>
              </li>
              <li className="flex items-center text-stone-400 dark:text-stone-600 line-through">
                <span>Featured placement on homepage</span>
              </li>
              <li className="flex items-center text-stone-400 dark:text-stone-600 line-through">
                <span>Premium partner badge</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              disabled
              className="w-full py-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 text-stone-400 text-xs font-medium cursor-default"
            >
              {isPremium ? 'Included' : 'Current tier'}
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="p-6 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-900 dark:border-stone-700 border border-stone-800 flex flex-col justify-between space-y-6 relative">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Growth tier
              </span>
              <h3 className="text-xl font-semibold text-white mt-1">Premium partner</h3>
              <p className="text-xs text-stone-400 mt-1">
                For established restaurants requiring unlimited capacity and high visibility.
              </p>
            </div>

            <div className="text-2xl font-semibold text-white font-mono tabular-nums">
              $29.99{' '}
              <span className="text-xs font-normal text-stone-400 tracking-normal font-sans">/ month</span>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-stone-800 text-xs text-stone-300">
              <li className="flex items-center font-medium text-white">
                <Check className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                <span>Unlimited active menu items</span>
              </li>
              <li className="flex items-center font-medium text-white">
                <Check className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                <span>Verified &ldquo;Premium&rdquo; restaurant badge</span>
              </li>
              <li className="flex items-center font-medium text-white">
                <Check className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
                <span>Priority placement on homepage</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                <span>Instant order notifications and status updates</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                <span>Priority platform support</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            {isPremium ? (
              <div className="w-full py-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs font-medium text-center flex items-center justify-center space-x-1.5">
                <Check className="w-4 h-4" />
                <span>Active subscription</span>
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-pizza-700 hover:bg-pizza-800 text-white text-xs font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Connecting to Stripe...</span>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Upgrade via Stripe Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
