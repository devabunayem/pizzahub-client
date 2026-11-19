'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Pizza, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from '@/lib/toast';

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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-2xl border border-stone-200 dark:border-stone-800">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900">
            <Pizza className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Sign in to PizzaHub
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Quick Demo Credentials Helpers */}
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
          <p className="font-medium text-stone-700 dark:text-stone-300 text-[11px]">
            Demo credentials (click to populate):
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs hover:border-stone-400 dark:hover:border-stone-500 transition-colors cursor-pointer"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('vendor')}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs hover:border-stone-400 dark:hover:border-stone-500 transition-colors cursor-pointer"
            >
              Vendor (Mario&apos;s)
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('customer')}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs hover:border-stone-400 dark:hover:border-stone-500 transition-colors cursor-pointer"
            >
              Customer
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-lg text-white font-medium bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
          >
            {submitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </span>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-stone-500 dark:text-stone-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-stone-900 dark:text-stone-100 underline underline-offset-2"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
