'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Mail,
  Lock,
  User,
  Store,
  ArrowUpRight,
  Image as ImageIcon,
  CheckCircle2,
  Flame,
  Check,
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
  const submittingRef = React.useRef(false);

  const handleGoogleSignUp = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setGoogleLoading(true);
    await loginWithGoogle({
      role,
      businessName: role === 'vendor' ? businessName.trim() || undefined : undefined,
    });
    setGoogleLoading(false);
    submittingRef.current = false;
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
  const isNameValid = name.trim().length > 0;
  const isBusinessValid = role !== 'vendor' || businessName.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || submitting) return;

    if (!name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password must have at least 6 characters, 1 uppercase, and 1 lowercase letter.');
      return;
    }

    if (role === 'vendor' && !businessName.trim()) {
      toast.error('Please provide your Restaurant / Business Name.');
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        businessName: role === 'vendor' ? businessName.trim() : undefined,
        image: image.trim() || undefined,
      });
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-88px)] items-center bg-[#FAF7F2] py-8 md:py-12">
      <div className="site-container">
        <div className="mx-auto grid w-full max-w-lg grid-cols-1 overflow-hidden rounded-3xl border border-[#18120E]/[0.08] bg-white shadow-[0_12px_36px_-18px_rgba(24,18,14,0.14)] lg:min-h-[580px] lg:max-w-4xl lg:grid-cols-12">
          {/* Left Editorial Showcase Panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[#18120E] p-8 text-[#FAF7F2] lg:col-span-5 lg:flex">
            <img
              src="/images/cat-gourmet.jpg"
              alt="Artisan wood-fired truffle burrata pizza"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#18120E] via-[#18120E]/88 to-[#18120E]/80" />

            <div className="relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-medium text-amber-200/90">
                <Flame className="h-3.5 w-3.5 stroke-[1.75] text-[#E50916]" />
                <span>Wood-fired kitchen network</span>
              </div>

              <div>
                <h1 className="leading-[0.96] tracking-tight text-white">
                  <span className="font-display block text-[clamp(1.75rem,2.6vw,2.35rem)] uppercase">
                    CRAFT OR ORDER
                  </span>
                  <span className="mt-1 block text-[clamp(1.75rem,2.6vw,2.35rem)]">
                    <span className="font-display uppercase">WOOD-FIRED </span>
                    <BrushHighlight immediate color="#E50916" secondaryColor="#D97706" delay={0.2}>
                      <span className="font-editorial italic font-normal lowercase text-[#FAF7F2]">
                        pies
                      </span>
                    </BrushHighlight>
                  </span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-stone-300">
                  Create a customer account to order neighborhood pizzas, or launch your own
                  brick-oven storefront as a restaurant partner.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-8 space-y-2.5 border-t border-white/10 pt-5 text-xs text-stone-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 stroke-[1.75] text-[#E50916]" />
                <span>Fast setup for diners and local kitchens</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 stroke-[1.75] text-[#E50916]" />
                <span>Free vendor tier (3 items) or Stripe Premium unlimited</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 stroke-[1.75] text-[#E50916]" />
                <span>Live delivery status timeline inside every dashboard</span>
              </div>
            </div>
          </div>

          {/* Right Registration Form Panel */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-medium text-[#9A4A12]">
                  New account
                </span>
                <h2 className="mt-1 text-[22px] font-semibold leading-tight tracking-tight text-[#18120E]">
                  Create an account
                </h2>
              </div>
              <img
                src="/images/logo-icon.svg"
                alt="PizzaHub"
                className="h-11 w-11 shrink-0 object-contain"
              />
            </div>

            {/* Compact Role Selection */}
            <div className="mb-4 space-y-2">
              <label className="block text-xs font-medium text-[#5E554A]">
                Account role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D91E18]/25 ${
                    role === 'customer'
                      ? 'border-[#D91E18] bg-[#FAF7F2] text-[#18120E] ring-1 ring-[#D91E18]/20'
                      : 'border-[#18120E]/12 bg-white text-[#6E6259] hover:border-[#18120E]/25 hover:text-[#18120E]'
                  }`}
                >
                  <User
                    className={`h-4 w-4 shrink-0 stroke-[1.75] ${
                      role === 'customer' ? 'text-[#D91E18]' : 'text-[#8A8075]'
                    }`}
                  />
                  <span className="text-xs font-medium">Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D91E18]/25 ${
                    role === 'vendor'
                      ? 'border-[#D91E18] bg-[#FAF7F2] text-[#18120E] ring-1 ring-[#D91E18]/20'
                      : 'border-[#18120E]/12 bg-white text-[#6E6259] hover:border-[#18120E]/25 hover:text-[#18120E]'
                  }`}
                >
                  <Store
                    className={`h-4 w-4 shrink-0 stroke-[1.75] ${
                      role === 'vendor' ? 'text-[#D91E18]' : 'text-[#8A8075]'
                    }`}
                  />
                  <span className="text-xs font-medium">Restaurant</span>
                </button>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading || submitting}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#18120E]/12 bg-white px-4 text-sm font-medium text-[#18120E] shadow-[0_1px_2px_rgba(24,18,14,0.05)] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#18120E]/30 hover:bg-[#FAF7F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18120E]/20 disabled:cursor-not-allowed disabled:opacity-50"
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

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-stone-200/80" />
              <span className="shrink-0 whitespace-nowrap text-xs font-medium text-[#7B7266]">
                or register with email
              </span>
              <div className="h-px flex-1 bg-stone-200/80" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#5E554A]">
                    Full name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A8075]">
                      <User className="h-4 w-4 stroke-[1.75]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Marco Bellini"
                      className="h-10 w-full rounded-lg border border-[#18120E]/12 bg-[#FAF7F2]/80 pl-10 pr-3 text-sm text-[#18120E] placeholder:text-[#8A8075] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus:border-[#D91E18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D91E18]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#5E554A]">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A8075]">
                      <Mail className="h-4 w-4 stroke-[1.75]" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="h-10 w-full rounded-lg border border-[#18120E]/12 bg-[#FAF7F2]/80 pl-10 pr-3 text-sm text-[#18120E] placeholder:text-[#8A8075] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus:border-[#D91E18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D91E18]/15"
                    />
                  </div>
                </div>
              </div>

              {role === 'vendor' && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#5E554A]">
                    Restaurant brand name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A8075]">
                      <Store className="h-4 w-4 stroke-[1.75]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Napoli Woodfire Pizza"
                      className="h-10 w-full rounded-lg border border-[#18120E]/12 bg-[#FAF7F2]/80 pl-10 pr-3 text-sm text-[#18120E] placeholder:text-[#8A8075] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus:border-[#D91E18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D91E18]/15"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#5E554A]">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A8075]">
                      <Lock className="h-4 w-4 stroke-[1.75]" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 w-full rounded-lg border border-[#18120E]/12 bg-[#FAF7F2]/80 pl-10 pr-3 text-sm text-[#18120E] placeholder:text-[#8A8075] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus:border-[#D91E18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D91E18]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#5E554A]">
                    Profile image URL (optional)
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8A8075]">
                      <ImageIcon className="h-4 w-4 stroke-[1.75]" />
                    </div>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="h-10 w-full rounded-lg border border-[#18120E]/12 bg-[#FAF7F2]/80 pl-10 pr-3 text-sm text-[#18120E] placeholder:text-[#8A8075] transition-colors duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus:border-[#D91E18] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D91E18]/15"
                    />
                  </div>
                </div>
              </div>

              {/* Compact Inline Password Checklist */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border border-[#18120E]/[0.08] bg-[#FAF7F2] px-3 py-2 text-xs">
                <div className="flex items-center gap-1.5">
                  {isLengthValid ? (
                    <Check className="h-3.5 w-3.5 stroke-[2] text-emerald-700" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                  )}
                  <span className={isLengthValid ? 'font-medium text-emerald-800' : 'text-[#6E6259]'}>
                    6+ chars
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasUpperCase ? (
                    <Check className="h-3.5 w-3.5 stroke-[2] text-emerald-700" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                  )}
                  <span className={hasUpperCase ? 'font-medium text-emerald-800' : 'text-[#6E6259]'}>
                    1 uppercase (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {hasLowerCase ? (
                    <Check className="h-3.5 w-3.5 stroke-[2] text-emerald-700" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
                  )}
                  <span className={hasLowerCase ? 'font-medium text-emerald-800' : 'text-[#6E6259]'}>
                    1 lowercase (a-z)
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !isPasswordValid || !isNameValid || !isBusinessValid}
                className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#18120E] px-6 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_6px_rgba(24,18,14,0.14)] transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#D91E18] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D91E18]/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as {role === 'vendor' ? 'Restaurant' : 'Customer'}</span>
                    <ArrowUpRight className="h-4 w-4 stroke-[1.75]" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 border-t border-[#18120E]/[0.07] pt-4 text-center text-sm text-[#6E6259]">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="font-medium text-[#D91E18] underline decoration-[#D91E18]/40 underline-offset-4 transition-colors duration-150 hover:decoration-[#D91E18]"
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
