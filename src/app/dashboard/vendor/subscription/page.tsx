'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Check, CreditCard, Crown, Clock, ArrowRight } from 'lucide-react';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VendorSubscriptionPage() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const isPremium =
    user?.subscriptionPlan === 'premium' &&
    (!user?.subscriptionExpiresAt ||
      new Date(user.subscriptionExpiresAt) > new Date());

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
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
          Partner Membership
        </span>
        <h1 className="font-display mt-1 text-3xl uppercase tracking-tight text-[#18120E]">
          Subscription Plan
        </h1>
        <p className="mt-1 text-sm text-[#6E6259]">
          Review your current tier or upgrade to Premium for unlimited active menu items and homepage placement.
        </p>
      </div>

      {/* Current Plan Alert */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-stone-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
              isPremium
                ? 'bg-[#9A4A12] text-amber-200'
                : 'border border-stone-200 bg-[#FAF7F2] text-[#6E6259]'
            }`}
          >
            {isPremium ? <Crown className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#6E6259]">
              Current tier
            </p>
            <p className="text-sm font-extrabold capitalize text-[#18120E]">
              {user?.subscriptionPlan} tier {isPremium && '• Verified'}
            </p>
          </div>
        </div>

        {isPremium ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800">
            <Check className="h-3.5 w-3.5" /> Active Subscription
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-stone-200 bg-[#FAF7F2] px-3.5 py-1.5 text-xs font-semibold text-[#6E6259]">
            Free tier (maximum 3 active items)
          </span>
        )}
      </div>

      {/* Pricing Comparison Cards */}
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-stone-200/90 bg-white p-7 shadow-sm">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#6E6259]">
                Starter tier
              </span>
              <h3 className="mt-1 text-xl font-extrabold text-[#18120E]">Free plan</h3>
              <p className="mt-1 text-xs text-[#6E6259]">
                Standard access for local kitchens launching their digital oven menu.
              </p>
            </div>

            <div className="font-display text-4xl text-[#18120E] tabular-nums">
              $0{' '}
              <span className="font-sans text-xs font-medium tracking-normal text-[#6E6259]">
                / month
              </span>
            </div>

            <ul className="space-y-2.5 border-t border-stone-100 pt-4 text-xs text-[#6E6259]">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 shrink-0 text-emerald-600" />
                <span>Maximum 3 active menu items</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 shrink-0 text-emerald-600" />
                <span>Standard kitchen dashboard &amp; order management</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 shrink-0 text-emerald-600" />
                <span>Order accept and reject workflows</span>
              </li>
              <li className="flex items-center text-stone-400 line-through">
                <span>Featured placement on homepage</span>
              </li>
              <li className="flex items-center text-stone-400 line-through">
                <span>Premium partner badge</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled
              className="w-full cursor-default rounded-2xl border border-stone-200 bg-[#FAF7F2] py-3 text-xs font-bold text-[#6E6259]"
            >
              {isPremium ? 'Included in account' : 'Current tier'}
            </button>
          </div>
        </div>

        {/* Premium Plan — Charred Espresso Editorial Card */}
        <div className="relative flex flex-col justify-between space-y-6 overflow-hidden rounded-3xl border border-[#9A4A12]/40 bg-[#18120E] p-7 text-[#FAF7F2] shadow-[0_24px_48px_-20px_rgba(24,18,14,0.4)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#D97706]">
                Growth tier
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#9A4A12] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                <Crown className="h-3 w-3 text-amber-200" />
                Popular
              </span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Premium partner</h3>
              <p className="mt-1 text-xs text-stone-300">
                For established pizzerias requiring unlimited capacity and priority visibility.
              </p>
            </div>

            <div className="font-display text-4xl text-white tabular-nums">
              $29.99{' '}
              <span className="font-sans text-xs font-medium tracking-normal text-stone-400">
                / month
              </span>
            </div>

            <ul className="space-y-2.5 border-t border-white/10 pt-4 text-xs text-stone-200">
              <li className="flex items-center font-semibold text-white">
                <Check className="mr-2 h-4 w-4 shrink-0 text-[#D97706]" />
                <span>Unlimited active menu items</span>
              </li>
              <li className="flex items-center font-semibold text-white">
                <Check className="mr-2 h-4 w-4 shrink-0 text-[#D97706]" />
                <span>Verified &ldquo;Premium&rdquo; restaurant badge</span>
              </li>
              <li className="flex items-center font-semibold text-white">
                <Check className="mr-2 h-4 w-4 shrink-0 text-[#D97706]" />
                <span>Priority placement on homepage</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 shrink-0 text-stone-400" />
                <span>Instant order notifications and status updates</span>
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 shrink-0 text-stone-400" />
                <span>Priority platform support</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            {isPremium ? (
              <div className="flex w-full items-center justify-center space-x-1.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 py-3 text-center text-xs font-bold text-emerald-300">
                <Check className="h-4 w-4" />
                <span>Active subscription</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded-2xl bg-[#E50916] py-3.5 text-xs font-bold text-white shadow-[0_12px_28px_-10px_rgba(229,9,22,0.65)] transition-colors hover:bg-[#c80814] disabled:opacity-50"
              >
                {loading ? (
                  <span>Connecting to Stripe...</span>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Upgrade via Stripe Checkout</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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
