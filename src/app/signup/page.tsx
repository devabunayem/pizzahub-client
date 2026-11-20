'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Pizza,
  Mail,
  Lock,
  User,
  Store,
  ArrowUpRight,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { toast } from '@/lib/toast';
import { BrushHighlight } from '@/components/ui/BrushHighlight';
import { AuthPageSkeleton } from '@/components/ui/Skeleton';

function SignUpContent() {
  const { register, loginWithGoogle, user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const [role, setRole] = useState<'customer' | 'vendor'>(
    initialRoleParam === 'vendor' ? 'vendor' : 'customer'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [image, setImage] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    await loginWithGoogle({
      role,
      businessName: role === 'vendor' ? businessName || undefined : undefined,
    });
    setGoogleLoading(false);
  };

  useEffect(() => {
    if (initialRoleParam === 'vendor') {
      setRole('vendor');
    } else if (initialRoleParam === 'customer') {
      setRole('customer');
    }
  }, [initialRoleParam]);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'vendor') router.push('/dashboard/vendor');
      else router.push('/dashboard/customer');
    }
  }, [user, isLoading, router]);

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
    <section className="min-h-[calc(100vh-88px)] bg-[#FAF7F2] py-10 md:py-16">
      <div className="site-container">
        <div className="mx-auto grid max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_28px_60px_-24px_rgba(24,18,14,0.18)] lg:grid-cols-12">
          {/* Left Editorial Showcase Panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#18120E] p-8 text-[#FAF7F2] sm:p-10 lg:col-span-5">
            <img
              src="/images/cat-gourmet.jpg"
              alt="Artisan wood-fired truffle burrata pizza"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18120E] via-[#18120E]/88 to-[#18120E]/80" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D97706] backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#E50916]" />
                <span>Join PizzaHub Today</span>
              </div>

              <div>
                <h1 className="leading-[0.96] tracking-tight text-white">
                  <span className="font-display block text-[clamp(2.2rem,3.5vw,3.1rem)] uppercase">
                    CRAFT OR ORDER
                  </span>
                  <span className="mt-1 block text-[clamp(2.2rem,3.5vw,3rem)]">
                    <span className="font-display uppercase">WOOD-FIRED </span>
                    <BrushHighlight immediate color="#E50916" secondaryColor="#D97706" delay={0.2}>
                      <span className="font-editorial italic font-normal lowercase text-[#FAF7F2]">
                        pies
                      </span>
                    </BrushHighlight>
                  </span>
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-stone-300">
                  Create a customer account to order neighborhood pizzas, or launch your own
                  brick-oven storefront as a restaurant partner.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-3 border-t border-white/15 pt-6 text-xs text-stone-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E50916]" />
                <span>Instant onboarding for Customers &amp; Local Kitchens</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E50916]" />
                <span>Free vendor tier (3 items) or Stripe Premium unlimited</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E50916]" />
                <span>Live delivery status timeline inside every dashboard</span>
              </div>
            </div>
          </div>

          {/* Right Registration Form Panel */}
          <div className="p-8 sm:p-10 lg:col-span-7 lg:p-12">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
                  New Account
                </span>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#18120E]">
                  Create an account
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e50916] text-white shadow-sm">
                <Pizza className="h-5 w-5" />
              </div>
            </div>

            {/* Role Selection */}
            <div className="mb-5 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex flex-col items-center justify-center space-y-1 rounded-2xl border p-4 transition-all cursor-pointer ${
                    role === 'customer'
                      ? 'border-[#D91E18] bg-[#FAF7F2] text-[#18120E] ring-1 ring-[#D91E18]/25'
                      : 'border-stone-200 bg-white text-[#6E6259] hover:border-stone-300 hover:text-[#18120E]'
                  }`}
                >
                  <User
                    className={`h-5 w-5 ${
                      role === 'customer' ? 'text-[#D91E18]' : 'text-stone-400'
                    }`}
                  />
                  <span className="text-sm font-bold">Customer</span>
                  <span className="text-xs text-[#6E6259]">Order fresh pizza</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`flex flex-col items-center justify-center space-y-1 rounded-2xl border p-4 transition-all cursor-pointer ${
                    role === 'vendor'
                      ? 'border-[#D91E18] bg-[#FAF7F2] text-[#18120E] ring-1 ring-[#D91E18]/25'
                      : 'border-stone-200 bg-white text-[#6E6259] hover:border-stone-300 hover:text-[#18120E]'
                  }`}
                >
                  <Store
                    className={`h-5 w-5 ${
                      role === 'vendor' ? 'text-[#D91E18]' : 'text-stone-400'
                    }`}
                  />
                  <span className="text-sm font-bold">Restaurant</span>
                  <span className="text-xs text-[#6E6259]">Manage kitchen</span>
                </button>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
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
              <span>
                {googleLoading
                  ? 'Connecting to Google...'
                  : `Continue with Google as ${role === 'vendor' ? 'Restaurant' : 'Customer'}`}
              </span>
            </button>

            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-full border-t border-stone-200" />
              <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                or register with email
              </span>
              <div className="w-full border-t border-stone-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Full name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {role === 'vendor' && (
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                    Restaurant brand name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                      <Store className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Napoli Woodfire Pizza"
                      className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

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
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Profile image URL (optional)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
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
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Password Checklist */}
                <div className="mt-2.5 space-y-1.5 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={isLengthValid ? 'font-bold text-emerald-700' : 'text-stone-400'}>
                      {isLengthValid ? '✓' : '○'}
                    </span>
                    <span className={isLengthValid ? 'font-semibold text-emerald-800' : 'text-[#6E6259]'}>
                      Minimum 6 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={hasUpperCase ? 'font-bold text-emerald-700' : 'text-stone-400'}>
                      {hasUpperCase ? '✓' : '○'}
                    </span>
                    <span className={hasUpperCase ? 'font-semibold text-emerald-800' : 'text-[#6E6259]'}>
                      At least one uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={hasLowerCase ? 'font-bold text-emerald-700' : 'text-stone-400'}>
                      {hasLowerCase ? '✓' : '○'}
                    </span>
                    <span className={hasLowerCase ? 'font-semibold text-emerald-800' : 'text-[#6E6259]'}>
                      At least one lowercase letter (a-z)
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !isPasswordValid}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#18120E] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgba(24,18,14,0.45)] transition hover:bg-[#D91E18] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as {role === 'vendor' ? 'Restaurant' : 'Customer'}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 border-t border-stone-100 pt-5 text-center text-sm text-[#6E6259]">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="font-bold text-[#D91E18] underline decoration-[#D91E18]/40 underline-offset-4 hover:decoration-[#D91E18]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton mode="signup" />}>
      <SignUpContent />
    </Suspense>
  );
}
