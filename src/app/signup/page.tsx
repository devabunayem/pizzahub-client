'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Pizza, Mail, Lock, User, Store, ArrowRight, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const { register, user, isLoading } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [image, setImage] = useState('');
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

  // Password rules validation helper
  const isLengthValid = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const isPasswordValid = isLengthValid && hasUpperCase && hasLowerCase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Password must have at least 6 characters, 1 uppercase, and 1 lowercase letter.');
      return;
    }

    if (role === 'vendor' && !businessName) {
      toast.error('Please provide your Restaurant / Business Name.');
      return;
    }

    setSubmitting(true);
    await register({
      name,
      email,
      password,
      role,
      businessName: role === 'vendor' ? businessName : undefined,
      image: image || undefined,
    });
    setSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 via-pizza-50/20 to-white dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="max-w-lg w-full space-y-8 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200 dark:border-stone-800">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-pizza-600 to-pizza-500 flex items-center justify-center text-white shadow-lg shadow-pizza-500/30">
            <Pizza className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Create your Pizza<span className="text-pizza-600">Hub</span> Account
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Join PizzaHub today as a Pizza Lover or Restaurant Partner.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
            I am joining as:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-1.5 transition-all ${
                role === 'customer'
                  ? 'border-pizza-500 bg-pizza-50/50 dark:bg-pizza-950/30 text-pizza-600 dark:text-pizza-400 font-bold shadow-sm'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-sm">Customer</span>
              <span className="text-[11px] text-stone-500 font-normal">Order & Eat</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center space-y-1.5 transition-all ${
                role === 'vendor'
                  ? 'border-pizza-500 bg-pizza-50/50 dark:bg-pizza-950/30 text-pizza-600 dark:text-pizza-400 font-bold shadow-sm'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300'
              }`}
            >
              <Store className="w-6 h-6" />
              <span className="text-sm">Restaurant Owner</span>
              <span className="text-[11px] text-stone-500 font-normal">Sell & Manage</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>
          </div>

          {role === 'vendor' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                Restaurant / Business Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Store className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Napoli Woodfire Pizza"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Profile Image URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
              />
            </div>

            {/* Password Validation Indicators */}
            <div className="mt-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-1">
              <p className="font-semibold text-stone-600 dark:text-stone-400 mb-1">
                Password Requirements:
              </p>
              <div className="flex items-center space-x-2">
                <span className={isLengthValid ? 'text-green-500' : 'text-stone-400'}>
                  {isLengthValid ? '✓' : '○'}
                </span>
                <span className={isLengthValid ? 'text-green-600 dark:text-green-400 font-medium' : 'text-stone-500'}>
                  Minimum 6 characters
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={hasUpperCase ? 'text-green-500' : 'text-stone-400'}>
                  {hasUpperCase ? '✓' : '○'}
                </span>
                <span className={hasUpperCase ? 'text-green-600 dark:text-green-400 font-medium' : 'text-stone-500'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={hasLowerCase ? 'text-green-500' : 'text-stone-400'}>
                  {hasLowerCase ? '✓' : '○'}
                </span>
                <span className={hasLowerCase ? 'text-green-600 dark:text-green-400 font-medium' : 'text-stone-500'}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !isPasswordValid}
            className="w-full py-3.5 px-4 rounded-xl text-white font-semibold bg-gradient-to-r from-pizza-600 to-pizza-500 hover:from-pizza-700 hover:to-pizza-600 shadow-lg shadow-pizza-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </span>
            ) : (
              <>
                <span>Register as {role === 'vendor' ? 'Restaurant' : 'Customer'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-stone-600 dark:text-stone-400">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-semibold text-pizza-600 hover:text-pizza-700 dark:text-pizza-400"
          >
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
