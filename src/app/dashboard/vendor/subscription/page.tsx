'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Check,
  CreditCard,
  ShieldCheck,
  Zap,
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
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-pizza-100 dark:bg-pizza-950/60 text-pizza-700 dark:text-pizza-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vendor Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
          Upgrade Your Restaurant Plan
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-lg mx-auto">
          Scale your culinary business with unlimited menu publishing, top homepage spotlight,
          and a verified Premium Vendor badge.
        </p>
      </div>

      {/* Current Plan Alert */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isPremium
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            {isPremium ? <Star className="w-5 h-5 fill-current" /> : <Clock className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Your Current Plan</p>
            <p className="text-base font-extrabold text-stone-900 dark:text-white capitalize">
              {user?.subscriptionPlan} Tier {isPremium && '⭐'}
            </p>
          </div>
        </div>

        {isPremium ? (
          <span className="px-3.5 py-1.5 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 text-xs font-bold flex items-center">
            <Check className="w-3.5 h-3.5 mr-1" /> Active Subscription
          </span>
        ) : (
          <span className="px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold">
            Free (Limited to 3 Items)
          </span>
        )}
      </div>

      {/* Pricing Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Starter Tier
              </span>
              <h3 className="text-2xl font-black text-stone-900 dark:text-white mt-1">Free Plan</h3>
              <p className="text-xs text-stone-500 mt-1">
                Perfect for local home bakers testing the waters.
              </p>
            </div>

            <div className="text-3xl font-black text-stone-900 dark:text-white">
              $0{' '}
              <span className="text-xs font-normal text-stone-500 tracking-normal">/ forever</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                <span>Maximum 3 active menu items</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                <span>Basic vendor dashboard overview</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                <span>Order management & status updates</span>
              </li>
              <li className="flex items-center text-stone-400 dark:text-stone-600 line-through">
                <span>Featured placement on homepage</span>
              </li>
              <li className="flex items-center text-stone-400 dark:text-stone-600 line-through">
                <span>Official Premium Vendor badge</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <button
              disabled
              className="w-full py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-400 font-bold text-xs cursor-default"
            >
              {isPremium ? 'Included in your account' : 'Current Plan'}
            </button>
          </div>
        </div>

        {/* Premium Plan (Featured) */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white shadow-2xl border-2 border-pizza-500 relative flex flex-col justify-between space-y-6">
          <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-pizza-500 text-stone-950 font-black text-[11px] shadow-md uppercase tracking-wider flex items-center">
            <Sparkles className="w-3 h-3 mr-1" /> Most Popular
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Growth Tier
              </span>
              <h3 className="text-2xl font-black text-white mt-1">Premium Partner</h3>
              <p className="text-xs text-stone-400 mt-1">
                For established pizzerias aiming for high sales volume.
              </p>
            </div>

            <div className="text-4xl font-black text-white">
              $29.99{' '}
              <span className="text-xs font-normal text-stone-400 tracking-normal">/ month</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-stone-800 text-xs text-stone-300">
              <li className="flex items-center font-semibold text-white">
                <Check className="w-4 h-4 text-pizza-400 mr-2 shrink-0" />
                <span>Unlimited active menu items</span>
              </li>
              <li className="flex items-center font-semibold text-white">
                <Check className="w-4 h-4 text-pizza-400 mr-2 shrink-0" />
                <span>Golden &ldquo;Premium&rdquo; verified restaurant badge</span>
              </li>
              <li className="flex items-center font-semibold text-white">
                <Check className="w-4 h-4 text-pizza-400 mr-2 shrink-0" />
                <span>Priority featured placement on homepage</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-pizza-400 mr-2 shrink-0" />
                <span>Real-time customer analytics & insights</span>
              </li>
              <li className="flex items-center">
                <Check className="w-4 h-4 text-pizza-400 mr-2 shrink-0" />
                <span>Priority 24/7 customer & kitchen support</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            {isPremium ? (
              <div className="w-full py-3 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 font-bold text-xs text-center flex items-center justify-center space-x-1.5">
                <Check className="w-4 h-4" />
                <span>You are currently enjoying Premium!</span>
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pizza-600 via-pizza-500 to-orange-500 hover:from-pizza-700 hover:to-pizza-600 text-white font-bold text-sm shadow-xl shadow-pizza-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Connecting to Stripe...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Upgrade via Stripe Checkout</span>
                    <ArrowRight className="w-4 h-4" />
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
