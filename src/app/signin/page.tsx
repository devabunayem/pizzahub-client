'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Pizza, Mail, Lock, ArrowRight, ShieldCheck, ChefHat } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'vendor') router.push('/dashboard/vendor');
      else router.push('/dashboard/customer');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    await login(email, password);
    setSubmitting(false);
  };

  const fillQuickDemo = (role: 'admin' | 'vendor' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@pizzahub.com');
      setPassword('123456');
    } else if (role === 'vendor') {
      setEmail('mario@pizzahub.com');
      setPassword('Vendor123');
    } else {
      setEmail('customer@pizzahub.com');
      setPassword('Customer123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 via-pizza-50/20 to-white dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200 dark:border-stone-800">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-pizza-600 to-pizza-500 flex items-center justify-center text-white shadow-lg shadow-pizza-500/30">
            <Pizza className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Sign In to Pizza<span className="text-pizza-600">Hub</span>
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Welcome back! Enter your credentials to access your account.
          </p>
        </div>

        {/* Quick Demo Credentials Helpers */}
        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
          <p className="font-semibold text-stone-700 dark:text-stone-300">
            ⚡ Quick Demo Logins (Click to autofill):
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-medium hover:bg-purple-200 transition-colors"
            >
              👑 Admin (admin@pizzahub.com)
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('vendor')}
              className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium hover:bg-amber-200 transition-colors"
            >
              🍕 Vendor (mario@pizzahub.com)
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('customer')}
              className="px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 font-medium hover:bg-green-200 transition-colors"
            >
              👤 Customer (customer@pizzahub.com)
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pizza-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pizza-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-pizza-600 to-pizza-500 hover:from-pizza-700 hover:to-pizza-600 shadow-lg shadow-pizza-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-stone-600 dark:text-stone-400">
          Don&apos;t have an account yet?{' '}
          <Link
            href="/signup"
            className="font-semibold text-pizza-600 hover:text-pizza-700 dark:text-pizza-400"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
