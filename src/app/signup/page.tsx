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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-7 bg-white dark:bg-stone-900 p-8 sm:p-10 rounded-2xl border border-stone-200 dark:border-stone-800">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900">
            <Pizza className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Create an account
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Join as a dining customer or restaurant partner.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
            Account role
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-colors cursor-pointer ${
                role === 'customer'
                  ? 'border-stone-900 bg-stone-50 dark:border-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                  : 'border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-medium">Customer</span>
              <span className="text-[11px] text-stone-400 font-normal">Order pizza</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('vendor')}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-colors cursor-pointer ${
                role === 'vendor'
                  ? 'border-stone-900 bg-stone-50 dark:border-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                  : 'border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <Store className="w-5 h-5" />
              <span className="text-xs font-medium">Restaurant</span>
              <span className="text-[11px] text-stone-400 font-normal">Manage kitchen</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Full name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
              />
            </div>
          </div>

          {role === 'vendor' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Restaurant brand name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Store className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Napoli Woodfire Pizza"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
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
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Profile image URL (optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
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
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:border-stone-400 dark:focus:border-stone-600"
              />
            </div>

            {/* Password Validation Indicators */}
            <div className="mt-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-[11px] space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className={isLengthValid ? 'text-emerald-600' : 'text-stone-400'}>
                  {isLengthValid ? '✓' : '○'}
                </span>
                <span className={isLengthValid ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-stone-500'}>
                  Minimum 6 characters
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={hasUpperCase ? 'text-emerald-600' : 'text-stone-400'}>
                  {hasUpperCase ? '✓' : '○'}
                </span>
                <span className={hasUpperCase ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-stone-500'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className={hasLowerCase ? 'text-emerald-600' : 'text-stone-400'}>
                  {hasLowerCase ? '✓' : '○'}
                </span>
                <span className={hasLowerCase ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-stone-500'}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !isPasswordValid}
            className="w-full py-2.5 px-4 rounded-lg text-white font-medium bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
          >
            {submitting ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </span>
            ) : (
              <>
                <span>Register as {role === 'vendor' ? 'Restaurant' : 'Customer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-stone-500 dark:text-stone-400">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-medium text-stone-900 dark:text-stone-100 underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
