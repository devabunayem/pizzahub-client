'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Pizza, Mail, Lock, ArrowUpRight, CheckCircle2, Flame } from 'lucide-react';
import { toast } from '@/lib/toast';
import { BrushHighlight } from '@/components/ui/BrushHighlight';
import { AuthPageSkeleton } from '@/components/ui/Skeleton';

function SignInContent() {
  const { login, loginWithGoogle, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await loginWithGoogle({ redirectTo });
    setGoogleLoading(false);
  };

  useEffect(() => {
    if (!isLoading && user) {
      if (redirectTo && redirectTo.startsWith('/')) {
        router.replace(redirectTo);
      } else if (user.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'vendor') {
        router.push('/dashboard/vendor');
      } else {
        router.push('/dashboard/customer');
      }
    }
  }, [user, isLoading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);

    if (ok && redirectTo && redirectTo.startsWith('/')) {
      router.replace(redirectTo);
    }
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
    <section className="min-h-[calc(100vh-88px)] bg-[#FAF7F2] py-10 md:py-16">
      <div className="site-container">
        <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_28px_60px_-24px_rgba(24,18,14,0.18)] lg:grid-cols-12">
          {/* Left Editorial Wood-Fired Panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#18120E] p-8 text-[#FAF7F2] sm:p-10 lg:col-span-5">
            <img
              src="/images/woodfire-craft.jpg"
              alt="Wood-fired brick pizza oven"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18120E] via-[#18120E]/85 to-[#18120E]/75" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D97706] backdrop-blur-md">
                <Flame className="h-3.5 w-3.5 text-[#E50916]" />
                <span>480°C Hearth Access</span>
              </div>

              <div>
                <h1 className="leading-[0.96] tracking-tight text-white">
                  <span className="font-display block text-[clamp(2.25rem,3.6vw,3.15rem)] uppercase">
                    WELCOME BACK
                  </span>
                  <span className="mt-1 block text-[clamp(2.2rem,3.4vw,3rem)]">
                    <span className="font-display uppercase">TO THE </span>
                    <BrushHighlight immediate color="#E50916" secondaryColor="#D97706" delay={0.2}>
                      <span className="font-editorial italic font-normal lowercase text-[#FAF7F2]">
                        table
                      </span>
                    </BrushHighlight>
                  </span>
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-stone-300">
                  Order wood-fired artisan pies, track live oven dispatch, or manage your local
                  kitchen workspace.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-3 border-t border-white/15 pt-6 text-xs text-stone-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E50916]" />
                <span>Real-time kitchen to doorstep order tracking</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E50916]" />
                <span>Verified local pizzerias &amp; Stripe Premium tier</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E50916]" />
                <span>Role-based Customer, Kitchen &amp; Admin portals</span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-8 sm:p-10 lg:col-span-7 lg:p-12">
            <div className="mb-7 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
                  Member Sign In
                </span>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#18120E]">
                  Sign in to PizzaHub
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e50916] text-white shadow-sm">
                <Pizza className="h-5 w-5" />
              </div>
            </div>

            {/* Quick Demo Credentials */}
            <div className="mb-6 rounded-2xl border border-stone-200/90 bg-[#FAF7F2] p-4">
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#6E6259]">
                Quick Demo Credentials
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18] cursor-pointer"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('vendor')}
                  className="rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#18120E] transition hover:border-[#9A4A12] hover:text-[#9A4A12] cursor-pointer"
                >
                  Vendor (Mario&apos;s)
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('customer')}
                  className="rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18] cursor-pointer"
                >
                  Customer
                </button>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || submitting}
              className="mb-5 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-stone-200/90 bg-white px-5 py-3.5 text-sm font-bold text-[#18120E] shadow-sm transition hover:border-[#18120E] hover:bg-[#FAF7F2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-full border-t border-stone-200" />
              <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                or email
              </span>
              <div className="w-full border-t border-stone-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-3 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-3 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#18120E] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgba(24,18,14,0.45)] transition hover:bg-[#D91E18] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 border-t border-stone-100 pt-5 text-center text-sm text-[#6E6259]">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-[#D91E18] underline decoration-[#D91E18]/40 underline-offset-4 hover:decoration-[#D91E18]"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton mode="signin" />}>
      <SignInContent />
    </Suspense>
  );
}
