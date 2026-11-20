'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  Star,
  Search,
  ShoppingBag,
  Bike,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { PizzaVisualizer } from '@/components/home/PizzaVisualizer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const categories = [
  {
    name: 'Classic pizzas',
    desc: 'Margherita, marinara, and quattro formaggi baked in traditional wood-fired ovens.',
    image:
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Meat lovers',
    desc: 'Smoked pepperoni, Italian sausage, cured pancetta, and herb-infused tomato sauce.',
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Vegetarian pizzas',
    desc: 'San Marzano tomatoes, wood-roasted peppers, marinated artichokes, and fresh basil.',
    image:
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Specialty gourmet',
    desc: 'Wild cremini mushrooms, fontina cheese, fresh rosemary, and white truffle oil drizzle.',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sides and dough knots',
    desc: 'Garlic herb dough knots, dipping marinara sauces, and warm mozzarella bites.',
    image:
      'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Beverages and desserts',
    desc: 'Espresso-soaked Italian tiramisu, crisp cannoli, and chilled artisanal beverages.',
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
  },
];

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/menu/featured`);
        const data = await res.json();
        if (data.success && data.items) {
          setFeaturedItems(data.items);
        }
      } catch (err) {
        console.error('Failed to fetch featured pizzas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* ========================================================
          1. HERO SECTION (Bold reference design from pizzahub-client.vercel.app)
      ======================================================== */}
      <section className="relative isolate flex min-h-[100svh] w-full flex-col justify-between overflow-x-clip bg-[#fff8ed] text-[#30251f] select-none dark:bg-[#070707] dark:text-white lg:min-h-[calc(100svh-4rem)]">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_55%,rgba(255,110,15,0.12),transparent_50%)] dark:bg-[radial-gradient(circle_at_75%_55%,rgba(255,110,15,0.22),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#fff8ed] via-[#fff8ed]/90 to-transparent lg:block dark:from-[#070707] dark:via-[#070707]/85" />

        {/* Right Pizza Background (Desktop) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] lg:block">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=90"
            alt="Delicious cheesy pepperoni pizza"
            className="h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff8ed] via-[#fff8ed]/35 to-transparent dark:from-[#070707] dark:via-[#070707]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fff8ed]/75 via-transparent to-[#fff8ed]/20 dark:from-[#070707] dark:to-[#070707]/50" />

          {/* Steam doodle on pizza */}
          <svg
            viewBox="0 0 60 60"
            className="absolute right-[4%] top-[44%] h-12 w-12 text-white/80"
            fill="currentColor"
          >
            <path d="M12 22C24 14 38 12 44 16C48 19 30 24 12 22Z" />
            <path d="M14 31C28 29 44 31 48 36C50 40 30 37 14 31Z" />
            <path d="M12 40C22 44 34 50 36 54C37 57 22 49 12 40Z" />
          </svg>
        </div>

        {/* Main Hero Container */}
        <div className="relative z-20 mx-auto flex w-full max-w-[1540px] flex-1 flex-col justify-between px-4 pb-8 pt-5 sm:px-8 sm:pt-7 lg:px-14 lg:pb-10 lg:pt-8">
          {/* Inner Header Row: Mascot Brand + Good Food Good Mood */}
          <header className="flex w-full items-center justify-between gap-2">
            <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
              <div className="transition-transform duration-300 group-hover:scale-105">
                {/* Pizza Mascot SVG */}
                <svg
                  viewBox="0 0 110 100"
                  className="h-11 w-12 shrink-0 sm:h-14 sm:w-16 lg:h-16 lg:w-20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 58C10 30 35 8 68 12C90 15 104 32 106 54C107 58 103 61 99 60L94 58C92 38 78 24 60 22C38 20 22 36 22 56L16 61C13 62 12 60 12 58Z"
                    fill="#E50916"
                  />
                  <path
                    d="M24 55C24 38 39 25 58 26C75 27 89 40 91 57L76 62C74 62 73 65 73 68V74C73 77 69 77 69 74V67C69 65 67 64 65 65L56 68C54 69 53 71 53 74V84C53 88 47 88 47 84V73C47 71 45 70 43 71L38 73C36 74 35 76 35 79V82C35 85 30 85 30 82V74C30 71 28 70 26 71L21 73C18 74 16 71 18 68L24 55Z"
                    fill="#FFB900"
                  />
                  <path
                    d="M58 26L46 69M58 26L72 63"
                    stroke="#080808"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="44" cy="45" r="5" fill="#E50916" />
                  <circle cx="62" cy="42" r="4.5" fill="#E50916" />
                  <circle cx="77" cy="49" r="4.5" fill="#E50916" />
                  <circle cx="33" cy="58" r="3.5" fill="#E50916" />
                  <circle cx="57" cy="56" r="3.5" fill="#E50916" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold leading-none tracking-tight sm:text-3xl lg:text-[40px]">
                  <span className="text-[#30251f] dark:text-white">Pizza </span>
                  <span className="text-[#ed101b]">Hub</span>
                </h2>
                <p className="mt-1 text-xs font-medium tracking-wide text-[#57483d] sm:text-sm lg:text-[17px] dark:text-white/90">
                  Taste The Happiness
                </p>
                {/* Red Underline Curved Swoosh SVG */}
                <svg
                  viewBox="0 0 140 16"
                  className="ml-14 mt-0.5 h-2.5 w-20 sm:ml-20 sm:h-3 sm:w-28 lg:ml-24 lg:w-32"
                  fill="none"
                >
                  <path d="M2 10C45 2 95 2 138 11C95 7 45 7 2 10Z" fill="#ed101b" />
                </svg>
              </div>
            </Link>

            {/* Right: Good Food Good Mood Script */}
            <div className="-rotate-6 text-right lg:mr-12">
              <p className="font-script-brush text-2xl font-bold leading-[0.85] text-[#30251f] sm:text-3xl lg:text-[46px] dark:text-white">
                Good Food
              </p>
              <p className="font-script-brush mt-0.5 text-2xl font-bold leading-[0.85] text-[#ffb900] sm:text-3xl lg:text-[48px]">
                Good Mood
              </p>
              {/* Yellow Underline SVG */}
              <svg
                viewBox="0 0 180 20"
                className="ml-auto mt-0.5 h-2.5 w-24 sm:h-3 sm:w-32 lg:mt-1 lg:h-3.5 lg:w-44"
                fill="none"
              >
                <path d="M4 16C55 3 125 2 176 9C125 6 55 8 4 16Z" fill="#ffb900" />
              </svg>
            </div>
          </header>

          {/* Central Typography: Delicious Pizza Makes Everything Better! */}
          <div className="my-auto flex flex-col items-center py-6 text-center lg:max-w-[650px] lg:items-start lg:py-4 lg:text-left">
            <div className="relative inline-flex flex-col items-center lg:items-start">
              {/* Left Steam Doodle */}
              <svg
                viewBox="0 0 60 80"
                className="pointer-events-none absolute -left-7 top-6 h-12 w-9 text-[#ffb900] sm:-left-10 sm:top-10 sm:h-16 sm:w-12 lg:-left-11 lg:top-14 lg:h-20 lg:w-14"
                fill="currentColor"
              >
                <path d="M44 26C36 16 28 8 33 4C38 1 46 14 44 26Z" />
                <path d="M36 42C22 36 8 32 10 26C12 20 26 30 36 42Z" />
                <path d="M36 58C24 62 12 68 10 62C8 56 22 54 36 58Z" />
              </svg>

              <p
                className="font-script-brush relative z-20 -mb-4 text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-none tracking-wide text-[#30251f] sm:-mb-6 lg:ml-24 lg:-mb-9 dark:text-white"
                style={{
                  textShadow: '0 4px 14px rgba(0,0,0,0.4), 0 0 4px rgba(0,0,0,0.3)',
                }}
              >
                Delicious
              </p>

              <h1
                className="font-pizza-heavy relative z-10 -rotate-3 text-[clamp(4.25rem,14vw,9.8rem)] leading-[0.92] tracking-tight text-[#ffb900]"
                style={{
                  textShadow: '4px 6px 0px rgba(0,0,0,0.35)',
                }}
              >
                Pizza
              </h1>

              {/* Yellow Swoop Underline under Pizza */}
              <svg
                viewBox="0 0 340 26"
                className="-mt-1 h-4 w-[clamp(13rem,45vw,22.5rem)] sm:h-5 lg:ml-28"
                fill="none"
              >
                <path d="M4 21C105 3 230 2 336 13C230 8 105 11 4 21Z" fill="#ffb900" />
              </svg>

              <div className="mt-2 flex flex-wrap items-baseline justify-center gap-x-2.5 lg:justify-start lg:pl-4">
                <span className="font-script-brush text-[clamp(2rem,5.2vw,3.5rem)] font-semibold leading-tight text-[#30251f] dark:text-white">
                  Makes Everything
                </span>
                <div className="inline-flex flex-col items-center lg:items-start">
                  <span className="font-script-brush text-[clamp(2.1rem,5.4vw,3.65rem)] font-bold leading-tight text-[#ed101b]">
                    Better!
                  </span>
                  {/* Red Swoop Underline under Better */}
                  <svg
                    viewBox="0 0 150 16"
                    className="-mt-1 h-2.5 w-24 sm:h-3 sm:w-32 lg:w-36"
                    fill="none"
                  >
                    <path d="M2 12C48 3 102 2 148 8C102 6 48 8 2 12Z" fill="#ed101b" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pill "Order Now" Button with White Arrow Circle */}
            <div className="mt-6 sm:mt-8 lg:pl-10">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-3 rounded-full bg-[#e50916] py-2.5 pl-6 pr-2.5 text-base font-bold text-white shadow-[0_10px_30px_rgba(229,9,22,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff1624] sm:gap-4 sm:py-3 sm:pl-9 sm:pr-3 sm:text-[22px]"
              >
                <span>Order Now</span>
                <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#e50916] transition-transform duration-300 group-hover:translate-x-1 sm:size-10">
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </span>
              </Link>
            </div>

            {/* Mobile Pizza Image (Visible on screen < lg) */}
            <div className="relative mt-8 h-[240px] w-full max-w-[540px] overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(255,100,0,0.18)] sm:h-[320px] lg:hidden">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=90"
                alt="Delicious cheesy pepperoni pizza"
                className="h-full w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#30251f]/45 via-transparent to-transparent dark:from-[#070707]/80" />
            </div>
          </div>

          {/* Hero Trust Badges Footer Bar (Fast Delivery, Best Quality, Happy Customers) */}
          <footer className="relative z-20 mt-4 grid w-full grid-cols-3 divide-x-2 divide-[#ffb900] pt-2 sm:max-w-[560px] lg:mt-0 lg:flex lg:max-w-none lg:items-center lg:divide-x-0 lg:pl-4">
            {/* 1. Fast Delivery */}
            <div className="flex flex-col items-center justify-center gap-1.5 px-2 text-center sm:flex-row sm:justify-start sm:gap-3 sm:px-0 sm:pr-6 sm:text-left lg:pr-7">
              <svg viewBox="0 0 64 52" className="h-8 w-10 shrink-0 sm:h-10 sm:w-12" fill="none">
                <rect x="8" y="10" width="16" height="14" rx="2" stroke="#FFB900" strokeWidth="2.8" />
                <path d="M12 15H20" stroke="#FFB900" strokeWidth="2.5" strokeLinecap="round" />
                <path
                  d="M10 28H28L34 16H42M38 16L46 34M12 36H48C50 36 52 34 52 32C52 28 48 26 44 26H35"
                  stroke="#FFB900"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="17" cy="39" r="6.5" stroke="#FFB900" strokeWidth="2.8" fill="#080808" />
                <circle cx="46" cy="39" r="6.5" stroke="#FFB900" strokeWidth="2.8" fill="#080808" />
                <path d="M2 20H6M4 32H8" stroke="#FFB900" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <p className="text-xs font-bold leading-tight text-[#30251f] sm:text-base lg:text-[17px] dark:text-white">
                Fast<br />Delivery
              </p>
            </div>

            {/* 2. Best Quality */}
            <div className="flex flex-col items-center justify-center gap-1.5 px-2 text-center sm:flex-row sm:justify-start sm:gap-3 sm:px-6 sm:text-left lg:border-l-2 lg:border-[#ffb900] lg:px-7">
              <svg viewBox="0 0 56 56" className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" fill="none">
                <path
                  d="M28 6L33.5 9.5L40 9L43 15L49 18L48.5 24.5L52 30L48.5 35.5L49 42L43 45L40 51L33.5 50.5L28 54L22.5 50.5L16 51L13 45L7 42L7.5 35.5L4 30L7.5 24.5L7 18L13 15L16 9L22.5 9.5L28 6Z"
                  stroke="#FFB900"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M28 19L30.8 24.8L37.2 25.7L32.6 30.2L33.7 36.5L28 33.5L22.3 36.5L23.4 30.2L18.8 25.7L25.2 24.8L28 19Z"
                  stroke="#FFB900"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 49L18 55L24 52M35 49L38 55L32 52"
                  stroke="#FFB900"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-xs font-bold leading-tight text-[#30251f] sm:text-base lg:text-[17px] dark:text-white">
                Best<br />Quality
              </p>
            </div>

            {/* 3. Happy Customers */}
            <div className="flex flex-col items-center justify-center gap-1.5 px-2 text-center sm:flex-row sm:justify-start sm:gap-3 sm:px-0 sm:pl-6 sm:text-left lg:border-l-2 lg:border-[#ffb900] lg:pl-7">
              <svg viewBox="0 0 52 52" className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" fill="none">
                <circle cx="26" cy="26" r="21" stroke="#FFB900" strokeWidth="2.8" />
                <circle cx="19" cy="21" r="2.5" fill="#FFB900" />
                <circle cx="33" cy="21" r="2.5" fill="#FFB900" />
                <path
                  d="M16 29C18.5 35.5 33.5 35.5 36 29"
                  stroke="#FFB900"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xs font-bold leading-tight text-[#30251f] sm:text-base lg:text-[17px] dark:text-white">
                Happy<br />Customers
              </p>
            </div>
          </footer>
        </div>

        {/* Bottom Left Corner Red Splash Wave */}
        <svg
          viewBox="0 0 260 120"
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-12 w-24 sm:h-16 sm:w-36 lg:h-24 lg:w-56"
          fill="none"
        >
          <path d="M0 0C55 68 155 104 260 120H0V0Z" fill="#e50916" />
        </svg>
      </section>

      {/* ========================================================
          2. FEATURED PIZZAS (Dynamic from API, with reference design)
      ======================================================== */}
      <section className="bg-[#08090b] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-emerald-400 uppercase">
                MADE FRESH, LOVED ALWAYS
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Featured Pizzas
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/55 sm:text-base">
                Explore today&apos;s favorites, made fresh by our verified local pizza makers.
              </p>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300 group"
            >
              <span>Explore all menu</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] animate-pulse"
                >
                  <div className="aspect-[4/3] bg-white/10" />
                  <div className="space-y-3 p-6">
                    <div className="h-3 w-1/4 rounded bg-white/10" />
                    <div className="h-5 w-2/3 rounded bg-white/10" />
                    <div className="h-4 w-full rounded bg-white/10" />
                    <div className="h-4 w-1/2 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="text-center py-16 rounded-3xl border border-white/10 bg-white/[0.02] text-sm text-white/50">
              No featured pizzas available at this moment. Check our full menu!
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredItems.map((item) => (
                <article
                  key={item._id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/40 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-emerald-950/20"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5">
                    <img
                      src={
                        item.images?.[0] ||
                        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={item.itemName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Category pill */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-400 border border-white/10">
                        {item.category}
                      </span>
                      {item.vendorId?.subscriptionPlan === 'premium' && (
                        <span className="rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-black flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                    </div>

                    {/* Price tag */}
                    <div className="absolute bottom-3 right-3 rounded-full bg-emerald-600 px-3.5 py-1 text-sm font-extrabold text-white shadow-lg">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="mt-5 flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {item.itemName}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-white/55 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                        <span className="truncate max-w-[140px] font-medium text-white/70">
                          {item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen'}
                        </span>
                        <span className="flex items-center truncate max-w-[120px]">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400 shrink-0" />
                          <span>{item.location || 'Downtown'}</span>
                        </span>
                      </div>

                      <Link
                        href={`/menu/${item._id}`}
                        className="group/btn flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-emerald-600 text-white font-semibold text-xs transition-all duration-300"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          3. CATEGORIES SECTION (Rich visual cards)
      ======================================================== */}
      <section className="relative overflow-hidden bg-[#fffaf2] px-5 py-20 text-[#30251f] dark:bg-[#08090b] dark:text-white sm:px-8 lg:px-12 border-t border-black/[0.04] dark:border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/5 px-4 py-2 text-xs font-bold tracking-widest text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/5 dark:text-emerald-400 uppercase">
              HAND-CRAFTED STYLES
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Explore By <span className="text-emerald-600 dark:text-emerald-400">Category</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#66574d] dark:text-white/60 sm:text-base">
              From bubbly Neapolitan crusts to thick pan masterpieces, discover whatever style fits your appetite today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-48 sm:h-52 rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-500/40"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/45 to-transparent p-6 flex flex-col justify-end text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-emerald-500">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. WHY CHOOSE PIZZAHUB? (Reference 4-card layout with watermarks)
      ======================================================== */}
      <section className="relative overflow-hidden bg-[#fffaf2] px-5 py-20 text-[#30251f] dark:bg-[#08090b] dark:text-white sm:px-8 lg:px-12 border-t border-black/[0.04] dark:border-white/5">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 size-80 rounded-full bg-orange-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/20 bg-emerald-600/5 px-4 py-2 text-xs font-bold tracking-widest text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/5 dark:text-emerald-400">
              GOOD FOOD, GOOD NEIGHBORS
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Why Choose <span className="text-emerald-600 dark:text-emerald-400">PizzaHub?</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#66574d] dark:text-white/60 sm:text-base">
              Great pizza is closer than you think. We bring local restaurants and hungry neighbors
              together for a better food experience.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 01 */}
            <article className="group relative overflow-hidden animate-fade-up rounded-3xl border border-[#30251f]/10 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/[0.035] sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <MapPin className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-4xl font-black text-[#30251f]/10 transition-colors duration-300 group-hover:text-emerald-600/30 dark:text-white/10 dark:group-hover:text-emerald-400/30">
                  01
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                Discover Local Favorites
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#66574d] dark:text-white/55">
                Find nearby pizza makers and explore menus filled with delicious options from your
                neighborhood.
              </p>
              <div className="mt-7 flex items-center justify-between border-t border-[#30251f]/10 pt-5 dark:border-white/10">
                <span className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                  WHY PIZZAHUB
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-emerald-600 group-hover:text-white dark:text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div className="pointer-events-none absolute -bottom-12 -right-12 size-32 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-150" />
            </article>

            {/* Card 02 */}
            <article className="group relative overflow-hidden animate-fade-up rounded-3xl border border-[#30251f]/10 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/[0.035] sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <HeartHandshake className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-4xl font-black text-[#30251f]/10 transition-colors duration-300 group-hover:text-emerald-600/30 dark:text-white/10 dark:group-hover:text-emerald-400/30">
                  02
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                Support Local Businesses
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#66574d] dark:text-white/55">
                Every order helps independent restaurants grow and connect with more pizza lovers.
              </p>
              <div className="mt-7 flex items-center justify-between border-t border-[#30251f]/10 pt-5 dark:border-white/10">
                <span className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                  WHY PIZZAHUB
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-emerald-600 group-hover:text-white dark:text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div className="pointer-events-none absolute -bottom-12 -right-12 size-32 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-150" />
            </article>

            {/* Card 03 */}
            <article className="group relative overflow-hidden animate-fade-up rounded-3xl border border-[#30251f]/10 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/[0.035] sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-4xl font-black text-[#30251f]/10 transition-colors duration-300 group-hover:text-emerald-600/30 dark:text-white/10 dark:group-hover:text-emerald-400/30">
                  03
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                Simple &amp; Secure Ordering
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#66574d] dark:text-white/55">
                Choose your favorite pizza, share delivery details, and send your order directly to
                the vendor.
              </p>
              <div className="mt-7 flex items-center justify-between border-t border-[#30251f]/10 pt-5 dark:border-white/10">
                <span className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                  WHY PIZZAHUB
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-emerald-600 group-hover:text-white dark:text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div className="pointer-events-none absolute -bottom-12 -right-12 size-32 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-150" />
            </article>

            {/* Card 04 */}
            <article className="group relative overflow-hidden animate-fade-up rounded-3xl border border-[#30251f]/10 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/[0.035] sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-700 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <Star className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-4xl font-black text-[#30251f]/10 transition-colors duration-300 group-hover:text-emerald-600/30 dark:text-white/10 dark:group-hover:text-emerald-400/30">
                  04
                </span>
              </div>
              <h3 className="text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                Choose With Confidence
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#66574d] dark:text-white/55">
                Explore customer ratings and honest reviews to discover pizzas worth coming back
                for.
              </p>
              <div className="mt-7 flex items-center justify-between border-t border-[#30251f]/10 pt-5 dark:border-white/10">
                <span className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                  WHY PIZZAHUB
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-emerald-600 group-hover:text-white dark:text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
              <div className="pointer-events-none absolute -bottom-12 -right-12 size-32 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-150" />
            </article>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. HOW PIZZAHUB WORKS (Reference 3-card layout)
      ======================================================== */}
      <section className="overflow-hidden bg-[#f4ece1] px-5 py-20 text-[#30251f] dark:bg-[#111315] dark:text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl animate-fade-up">
              <p className="mb-3 text-xs font-bold tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                FROM CRAVING TO FIRST BITE
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                How PizzaHub <span className="text-emerald-600 dark:text-emerald-400">Works</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#66574d] dark:text-white/60 sm:text-base">
                Delicious pizza is just a few simple steps away. Discover, order, and enjoy your
                favorite pizza from trusted local vendors.
              </p>
            </div>
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl"
            >
              <span>Browse the Menu</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="relative grid gap-6 md:grid-cols-3">
            {/* Step 01 */}
            <article className="group relative animate-fade-up rounded-3xl border border-[#30251f]/10 bg-[#fffaf2] p-7 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Search className="w-7 h-7 stroke-[1.8]" />
                </div>
                <span className="text-5xl font-black tracking-tighter text-[#30251f]/10 transition-colors duration-300 group-hover:text-emerald-600/30 dark:text-white/10 dark:group-hover:text-emerald-400/30">
                  01
                </span>
              </div>
              <h3 className="mb-3 text-xl font-bold transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                Find Your Favorite
              </h3>
              <p className="text-sm leading-7 text-[#66574d] dark:text-white/55">
                Explore approved pizzas and local vendors to discover your next favorite meal.
              </p>
              <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-emerald-700 opacity-70 transition-all duration-300 group-hover:gap-3 group-hover:opacity-100 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simple &amp; Easy</span>
              </div>
              <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-150" />
            </article>

            {/* Step 02 */}
            <article className="group relative animate-fade-up rounded-3xl border border-[#30251f]/10 bg-[#fffaf2] p-7 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <ShoppingBag className="w-7 h-7 stroke-[1.8]" />
                </div>
                <span className="text-5xl font-black tracking-tighter text-[#30251f]/10 transition-colors duration-300 group-hover:text-emerald-600/30 dark:text-white/10 dark:group-hover:text-emerald-400/30">
                  02
                </span>
              </div>
              <h3 className="mb-3 text-xl font-bold transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                Place Your Order
              </h3>
              <p className="text-sm leading-7 text-[#66574d] dark:text-white/55">
                Choose your favorite pizza, provide delivery details, and place your order easily.
              </p>
              <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-emerald-700 opacity-70 transition-all duration-300 group-hover:gap-3 group-hover:opacity-100 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simple &amp; Easy</span>
              </div>
              <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-150" />
            </article>

            {/* Step 03 */}
            <article className="group relative animate-fade-up rounded-3xl border border-[#30251f]/10 bg-[#fffaf2] p-7 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-900/10 dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Bike className="w-7 h-7 stroke-[1.8]" />
                </div>
                <span className="text-5xl font-black tracking-tighter text-[#30251f]/10 transition-colors duration-300 group-hover:text-emerald-600/30 dark:text-white/10 dark:group-hover:text-emerald-400/30">
                  03
                </span>
              </div>
              <h3 className="mb-3 text-xl font-bold transition-colors duration-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                Enjoy Your Pizza
              </h3>
              <p className="text-sm leading-7 text-[#66574d] dark:text-white/55">
                Your vendor prepares your order. Get ready to enjoy hot, authentic pizza at home!
              </p>
              <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-emerald-700 opacity-70 transition-all duration-300 group-hover:gap-3 group-hover:opacity-100 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simple &amp; Easy</span>
              </div>
              <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-150" />
            </article>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. INTERACTIVE CRUST LAB (Unique visualizer feature)
      ======================================================== */}
      <section className="bg-[#fff8ed] dark:bg-[#08090b] px-5 py-20 text-[#30251f] dark:text-white sm:px-8 lg:px-12 border-t border-black/[0.04] dark:border-white/5">
        <div className="mx-auto max-w-7xl">
          <PizzaVisualizer />
        </div>
      </section>
    </div>
  );
}
