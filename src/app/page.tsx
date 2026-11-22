'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  MapPin,
  Crown,
  Flame,
  Clock,
  ShieldCheck,
  Truck,
  Sparkles,
  Heart,
  Star,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { formatPrice } from '@/lib/utils';
import { MenuGridSkeleton } from '@/components/ui/Skeleton';
import { TextReveal } from '@/components/ui/TextReveal';
import { BrushHighlight } from '@/components/ui/BrushHighlight';

const OvenEmberCanvas = dynamic(
  () => import('@/components/home/OvenEmberCanvas').then((m) => m.OvenEmberCanvas),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const PIZZAS = [
  {
    id: 'pepperoni-herbs',
    num: '01',
    name: 'Charred Pepperoni & Herbs',
    shortName: 'Pepperoni Herbs',
    notes: 'Double pepperoni · roasted garlic · crushed oregano',
    price: '$15.90',
    image: '/images/pizza-1.png',
  },
  {
    id: 'olive-pepperoni',
    num: '02',
    name: 'Black Olive & Salami',
    shortName: 'Olive Salami',
    notes: 'Kalamata rings · aged mozzarella · smoky beef',
    price: '$16.50',
    image: '/images/pizza-2.png',
  },
  {
    id: 'parsley-pepperoni',
    num: '03',
    name: 'Artisan Olive & Parsley',
    shortName: 'Olive Parsley',
    notes: 'Whole black olives · garden parsley · San Marzano',
    price: '$15.40',
    image: '/images/pizza-3.png',
  },
  {
    id: 'classic-pepperoni',
    num: '04',
    name: 'Classic Golden Pepperoni',
    shortName: 'Classic Pepperoni',
    notes: '48h sourdough crust · bubbling fior di latte',
    price: '$14.90',
    image: '/images/pizza-4.png',
  },
] as const;

const PIZZA_CATEGORIES = [
  {
    num: '01',
    name: 'Classic Pizzas',
    tagline: 'San Marzano D.O.P. tomato, buffalo mozzarella & fresh basil.',
    image: '/images/cat-classic.jpg',
  },
  {
    num: '02',
    name: 'Vegetarian Pizzas',
    tagline: 'Charred heirloom tomatoes, roasted peppers, goat cheese & arugula.',
    image: '/images/cat-vegetarian.jpg',
  },
  {
    num: '03',
    name: 'Meat Lovers',
    tagline: 'Cupped crispy pepperoni, smoky Italian sausage & cured pancetta.',
    image: '/images/cat-meat.jpg',
  },
  {
    num: '04',
    name: 'Specialty / Gourmet Pizzas',
    tagline: 'Shaved black truffle, creamy burrata, wild porcini & hot honey.',
    image: '/images/cat-gourmet.jpg',
  },
  {
    num: '05',
    name: 'Sides & Appetizers',
    tagline: 'Oven-blistered herb garlic knots & slow-simmered marinara dip.',
    image: '/images/cat-sides.jpg',
  },
  {
    num: '06',
    name: 'Beverages & Desserts',
    tagline: 'Espresso mascarpone tiramisu & sparkling Sicilian citrus sodas.',
    image: '/images/cat-desserts.jpg',
  },
] as const;

const WHY_PILLARS = [
  {
    num: '01',
    title: '480°C Oak Brick Ovens',
    desc: 'Every pie is flash-baked in 90 seconds over seasoned oak embers for leopard blistering and tender structure.',
    icon: Flame,
  },
  {
    num: '02',
    title: '72-Hour Cold Proofed',
    desc: 'Slow sourdough fermentation builds complex caramelized wheat flavor and a feather-light airy crust.',
    icon: Clock,
  },
  {
    num: '03',
    title: 'Verified Artisan Kitchens',
    desc: 'Admin-moderated local vendors with transparent ingredient notes, pricing, and Premium kitchen badges.',
    icon: ShieldCheck,
  },
  {
    num: '04',
    title: 'Scheduled Doorstep Delivery',
    desc: 'Pick your exact delivery date and address with real-time oven-to-door order status tracking.',
    icon: Truck,
  },
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Discover & Filter',
    desc: 'Search live menus across six craft categories or filter by neighborhood pizzerias and ratings.',
  },
  {
    step: '02',
    title: 'Customize Your Order',
    desc: 'Inspect full wood-fired ingredients, select quantities, and lock in your delivery date and address.',
  },
  {
    step: '03',
    title: 'Track Hearth to Door',
    desc: 'Follow your kitchen live as it transitions from Pending to Baking to Out for Delivery inside your dashboard.',
  },
] as const;

interface FeaturedItem {
  _id: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images?: string[];
  averageRating?: number;
  reviewCount?: number;
  vendorId?: {
    _id: string;
    name?: string;
    businessName?: string;
    image?: string;
    subscriptionPlan?: 'free' | 'premium';
    subscriptionExpiresAt?: string | null;
  };
}

function isVendorPremium(vendor?: FeaturedItem['vendorId']): boolean {
  if (!vendor || vendor.subscriptionPlan !== 'premium') return false;
  if (!vendor.subscriptionExpiresAt) return true;
  return new Date(vendor.subscriptionExpiresAt) > new Date();
}

export default function HomePage() {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);
  const plateScrubRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [spinDeg, setSpinDeg] = useState(0);
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  const activePizza = PIZZAS[activeIndex];

  const handleSelectPizza = (index: number) => {
    if (index === activeIndex) return;
    setSpinDeg((prev) => prev + 60);
    setActiveIndex(index);
  };

  useEffect(() => {
    let active = true;
    const loadFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/menu/featured`, { cache: 'no-store' });
        const data = await res.json();
        if (active && data.success && Array.isArray(data.items)) {
          setFeaturedItems(data.items);
        }
      } catch (err) {
        console.error('Failed to load featured items:', err);
      } finally {
        if (active) setFeaturedLoading(false);
      }
    };
    loadFeatured();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (plateScrubRef.current) {
        gsap.to(plateScrubRef.current, {
          rotation: 8,
          y: 16,
          ease: 'none',
          scrollTrigger: {
            trigger: plateScrubRef.current,
            start: 'top 18%',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      gsap.from('.gsap-how-step', {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.gsap-how-grid',
          start: 'top 84%',
          once: true,
        },
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleViewDetails = (itemId: string) => {
    if (!user) {
      router.push(`/signin?redirect=/menu/${itemId}`);
    } else {
      router.push(`/menu/${itemId}`);
    }
  };

  const pizzaSelectorBlock = (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#6E6259] md:justify-start">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D91E18]" />
        <span>Tap a pizza to preview</span>
      </div>
      <div
        role="group"
        aria-label="Select pizza preview"
        className="flex flex-wrap items-start justify-center gap-3.5 sm:gap-5 md:justify-start"
      >
        {PIZZAS.map((pizza, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={pizza.id}
              type="button"
              onClick={() => handleSelectPizza(index)}
              aria-label={pizza.name}
              aria-pressed={isActive}
              title={pizza.name}
              className={`group relative flex cursor-pointer flex-col items-center transition-all duration-300 focus:outline-none ${
                isActive
                  ? '-translate-y-1.5 scale-105'
                  : 'opacity-85 hover:opacity-100 hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`relative h-16 w-16 rounded-full p-1.5 transition-all duration-300 sm:h-20 sm:w-20 lg:h-24 lg:w-24 ${
                  isActive
                    ? 'bg-[#FAF7F2] ring-2 ring-[#D91E18] shadow-[0_14px_24px_-10px_rgba(217,30,24,0.4)]'
                    : 'bg-white ring-1 ring-stone-200/90 shadow-sm group-hover:ring-[#D91E18]/50 group-hover:shadow-md'
                }`}
              >
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  draggable={false}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:rotate-12"
                />
              </div>
              <span
                className={`mt-2 max-w-[96px] text-center text-xs font-bold leading-tight tracking-tight transition-colors duration-300 sm:max-w-[110px] sm:text-sm ${
                  isActive ? 'text-[#D91E18]' : 'text-[#6E6259] group-hover:text-[#18120E]'
                }`}
              >
                {pizza.shortName}
              </span>
              <span
                className={`mt-1 h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  isActive ? 'scale-100 bg-[#e50916]' : 'scale-0 bg-stone-300 group-hover:scale-75'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <main ref={mainRef} className="w-full overflow-x-clip bg-white">
      {/* =========================================================
          BAND 1 — HERO SECTION (Pure White #FFFFFF)
         ========================================================= */}
      <section className="site-container py-6 md:py-14">
        <div className="flex flex-col items-center gap-7 md:flex-row md:items-center md:justify-between md:gap-12">
          {/* Left hero text column */}
          <div className="flex-1 min-w-0 w-full flex flex-col items-center text-center md:items-start md:text-left">
            {/* Eyebrow line */}
            <div className="mb-4 flex items-center justify-center md:justify-start gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#6E6259]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D91E18]" />
              <span>480°C Wood-Fired</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums text-[#18120E]">{activePizza.num} / 04</span>
            </div>

            {/* Monumental 3-Line Editorial Headline with Masked TextReveal + Hand-Drawn Brush Highlight */}
            <h1 className="select-none leading-[0.94] tracking-[-0.01em]">
              <span className="block font-display text-[clamp(2.5rem,4.6vw,4.75rem)] uppercase text-[#18120E]">
                <TextReveal immediate delay={0.04}>
                  FRESH
                </TextReveal>
              </span>

              <span className="my-1 block font-editorial italic font-normal text-[clamp(2.8rem,5.2vw,5.25rem)] text-[#9A4A12]">
                <TextReveal immediate delay={0.14}>
                  <BrushHighlight
                    immediate
                    color="#D91E18"
                    secondaryColor="#9A4A12"
                    delay={0.45}
                  >
                    Wood-Fired
                  </BrushHighlight>
                </TextReveal>
              </span>

              <span className="mt-2 flex flex-wrap items-baseline justify-center md:justify-start gap-x-3 sm:gap-x-4">
                <TextReveal immediate delay={0.24}>
                  <span className="font-display text-[clamp(2.5rem,4.6vw,4.75rem)] uppercase text-[#D91E18]">
                    PIZZA
                  </span>{' '}
                  <span className="font-display text-[clamp(2.5rem,4.6vw,4.75rem)] uppercase text-[#18120E]">
                    DELIVERED.
                  </span>
                </TextReveal>
              </span>
            </h1>

            {/* Minimal Active Pizza Info Strip */}
            <div
              key={activePizza.id}
              className="animate-copy-in mt-6 border-l-[3px] border-[#D91E18] pl-4 text-left w-full max-w-md"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[clamp(1.05rem,1.4vw,1.35rem)] font-extrabold tracking-tight text-[#18120E]">
                  {activePizza.name}
                </h2>
                <span className="font-display text-[clamp(1.35rem,2vw,1.85rem)] tracking-wide text-[#18120E] tabular-nums">
                  {activePizza.price}
                </span>
              </div>
              <p className="mt-1 text-[clamp(0.85rem,1vw,0.95rem)] font-medium text-[#6E6259]">
                {activePizza.notes}
              </p>
            </div>

            {/* Minimal Action Row */}
            <div className="mt-7 flex flex-wrap items-center justify-center md:justify-start gap-3.5 sm:gap-4">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#E50916] px-7 py-3.5 text-sm sm:text-base font-bold tracking-wide text-white shadow-[0_16px_32px_-10px_rgba(229,9,22,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c80814]"
              >
                <span>Order Now</span>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-full border border-[#18120E]/25 bg-white px-6 py-3.5 text-sm sm:text-base font-bold text-[#18120E] transition hover:border-[#18120E] hover:bg-[#FAF7F2]"
              >
                Explore menu
              </Link>
            </div>

            {/* 4 clickable mini circular pizza thumbnails — Desktop position inside left column */}
            <div className="mt-8 hidden w-full md:block">
              {pizzaSelectorBlock}
            </div>
          </div>

          {/* Right hero plate column - bounded inside shared 1280px container */}
          <div className="flex w-full flex-1 flex-col items-center md:max-w-[560px]">
            <div className="w-full max-w-[440px] select-none md:max-w-[560px]">
              <div ref={plateScrubRef} className="relative w-full -rotate-[12deg] will-change-transform">
                <img
                  src="/images/wooden-pizza-plate.png"
                  alt="Handcrafted wooden pizza serving plate"
                  draggable={false}
                  className="block h-auto w-full object-contain drop-shadow-[0_24px_32px_rgba(48,30,15,0.2)]"
                />

                {/* Active pizza seated inside the wooden dish bowl */}
                <div
                  data-pizza-slot="true"
                  className="pointer-events-none absolute left-1/2 top-[36.3%] aspect-square w-[89%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                >
                  <div
                    className="relative h-full w-full transition-transform duration-700 ease-out"
                    style={{ transform: `rotate(${spinDeg}deg)` }}
                  >
                    {PIZZAS.map((pizza, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <img
                          key={pizza.id}
                          src={pizza.image}
                          alt={pizza.name}
                          draggable={false}
                          className={`absolute inset-0 h-full w-full object-contain drop-shadow-[0_14px_18px_rgba(35,16,4,0.45)] transition-all duration-500 ${
                            isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 4 clickable pizza thumbnails — Mobile position directly below the wooden plate */}
            <div className="mt-6 w-full md:hidden">
              {pizzaSelectorBlock}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BAND 2 — FEATURED MENU ITEMS (Warm Flour Ivory #FAF7F2)
         ========================================================= */}
      <section id="featured-menu" className="border-y border-stone-200/70 bg-[#FAF7F2] py-16 md:py-24">
        <div className="site-container">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9A4A12]">
                <span className="h-2 w-2 rounded-full bg-[#D91E18]" />
                <span>Curated From Local Brick Ovens</span>
              </div>
              <h2 className="leading-[0.98] tracking-tight text-[#18120E]">
                <TextReveal>
                  <span className="font-display text-[clamp(2.2rem,4vw,3.5rem)] uppercase">
                    FEATURED{' '}
                  </span>
                  <BrushHighlight color="#D91E18" secondaryColor="#9A4A12" delay={0.2}>
                    <span className="font-editorial italic font-normal lowercase text-[#9A4A12] text-[clamp(2.4rem,4.4vw,3.8rem)]">
                      artisan
                    </span>
                  </BrushHighlight>
                  <span className="font-display text-[clamp(2.2rem,4vw,3.5rem)] uppercase">
                    {' '}
                    MENU
                  </span>
                </TextReveal>
              </h2>
            </div>

            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 self-start rounded-full border border-[#18120E]/15 bg-white px-5 py-2.5 text-sm font-bold text-[#18120E] transition hover:border-[#18120E] hover:bg-[#18120E] hover:text-white md:self-auto"
            >
              <span>Browse Full Menu</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {featuredLoading ? (
            <MenuGridSkeleton count={6} />
          ) : featuredItems.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white px-6 py-16 text-center">
              <p className="font-display text-2xl uppercase text-[#18120E]">
                Ovens Warming Up
              </p>
              <p className="mt-2 text-sm text-[#6E6259]">
                Featured kitchen selections are loading shortly. Explore the full catalog anytime.
              </p>
              <Link
                href="/menu"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D91E18] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b81712]"
              >
                <span>Open Browse Menu</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredItems.slice(0, 9).map((item, idx) => {
                const premium = isVendorPremium(item.vendorId);
                const vendorName =
                  item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen';
                const vendorInitial = vendorName.trim().charAt(0).toUpperCase();
                const coverImage = item.images?.[0] || '/images/cat-classic.jpg';
                const favorited = isFavorite(item._id);

                return (
                  <motion.article
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.55,
                      delay: idx * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_12px_30px_-18px_rgba(24,18,14,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9A4A12]/40 hover:shadow-[0_24px_48px_-20px_rgba(24,18,14,0.22)]"
                  >
                    {/* Strict 4:3 Uniform Media Frame */}
                    <div className="skeleton-shimmer relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={coverImage}
                        alt={item.itemName}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/cat-classic.jpg';
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Category Pill */}
                      <span className="absolute left-3.5 top-3.5 rounded-full bg-[#18120E]/80 px-3 py-1 text-[11px] font-semibold text-[#FAF7F2] backdrop-blur-md">
                        {item.category}
                      </span>

                      {/* Conditional Premium Vendor Badge & Favorite Toggle */}
                      <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5">
                        {premium && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#9A4A12] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                            <Crown className="h-3 w-3 text-amber-200" />
                            <span>Premium</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(item._id, item.itemName);
                          }}
                          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
                          className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition cursor-pointer ${
                            favorited
                              ? 'bg-white text-[#E50916] shadow-sm'
                              : 'bg-[#18120E]/65 text-white hover:bg-white hover:text-[#E50916]'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${favorited ? 'fill-[#E50916]' : ''}`} />
                        </button>
                      </div>

                      {(item.reviewCount ?? 0) > 0 && (
                        <span className="absolute bottom-3 left-3.5 inline-flex items-center gap-1 rounded-full bg-[#18120E]/80 px-2.5 py-0.5 text-[11px] font-bold text-[#FAF7F2] backdrop-blur-md tabular-nums">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{Number(item.averageRating || 0).toFixed(1)}</span>
                          <span className="text-stone-300">({item.reviewCount})</span>
                        </span>
                      )}
                    </div>

                    {/* Equal-Height Body */}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-1 text-lg font-extrabold tracking-tight text-[#18120E]">
                          {item.itemName}
                        </h3>
                        <span className="font-display shrink-0 text-xl tracking-wide text-[#D91E18] tabular-nums">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#6E6259]">
                        {item.description}
                      </p>

                      {/* Vendor & Location Metadata + CTA */}
                      <div className="mt-auto pt-5">
                        <div className="mb-4 flex items-center justify-between gap-2 border-t border-stone-100 pt-4 text-xs text-[#6E6259]">
                          <div className="flex min-w-0 items-center gap-2">
                            {item.vendorId?.image ? (
                              <img
                                src={item.vendorId.image}
                                alt={vendorName}
                                loading="lazy"
                                decoding="async"
                                className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-stone-200"
                              />
                            ) : (
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FAF7F2] text-[10px] font-bold text-[#9A4A12] ring-1 ring-stone-200">
                                {vendorInitial}
                              </span>
                            )}
                            <span className="truncate font-semibold text-[#18120E]">
                              {vendorName}
                            </span>
                          </div>

                          <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#6E6259]">
                            <MapPin className="h-3.5 w-3.5 text-[#D91E18]" />
                            <span className="max-w-[115px] truncate">{item.location}</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleViewDetails(item._id)}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#18120E] py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#D91E18]"
                        >
                          <span>View Details</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          BAND 3 — PIZZA CATEGORIES (Pure White #FFFFFF)
         ========================================================= */}
      <section className="bg-white py-16 md:py-24">
        <div className="site-container">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#6E6259]">
                <span className="h-2 w-2 rounded-full bg-[#9A4A12]" />
                <span>Six Culinary Disciplines</span>
              </div>
              <h2 className="leading-[0.98] tracking-tight text-[#18120E]">
                <TextReveal>
                  <span className="font-display text-[clamp(2.2rem,4vw,3.5rem)] uppercase">
                    EXPLORE BY{' '}
                  </span>
                  <BrushHighlight color="#9A4A12" secondaryColor="#D91E18" delay={0.2}>
                    <span className="font-editorial italic font-normal lowercase text-[#9A4A12] text-[clamp(2.4rem,4.4vw,3.8rem)]">
                      category
                    </span>
                  </BrushHighlight>
                </TextReveal>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-[#6E6259]">
              Filter directly into live wood-fired pies, roasted vegetarian harvests, savory sides,
              and handcrafted desserts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PIZZA_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={`/menu?category=${encodeURIComponent(cat.name)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-[#FAF7F2] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D91E18]/40 hover:bg-white hover:shadow-[0_24px_48px_-22px_rgba(24,18,14,0.18)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-200">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="font-display absolute left-3 top-3 rounded-lg bg-[#18120E]/85 px-2.5 py-1 text-xs tracking-widest text-[#FAF7F2]">
                      {cat.num}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-extrabold tracking-tight text-[#18120E] transition-colors group-hover:text-[#D91E18]">
                        {cat.name}
                      </h3>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-300 text-[#18120E] transition-all group-hover:border-[#D91E18] group-hover:bg-[#D91E18] group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#6E6259]">
                      {cat.tagline}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          BAND 4 — EXTRA SECTION 1: WHY CHOOSE PIZZAHUB? (#FAF7F2)
         ========================================================= */}
      <section className="border-y border-stone-200/70 bg-[#FAF7F2] py-16 md:py-24">
        <div className="site-container">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Showcase Photography Column */}
            <div className="lg:col-span-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9A4A12]">
                <Sparkles className="h-3.5 w-3.5 text-[#D91E18]" />
                <span>Why Choose PizzaHub</span>
              </div>
              <h2 className="mb-6 leading-[0.96] tracking-tight text-[#18120E]">
                <TextReveal>
                  <span className="font-display text-[clamp(2.2rem,3.8vw,3.25rem)] uppercase">
                    BUILT AROUND REAL{' '}
                  </span>
                  <BrushHighlight color="#D91E18" secondaryColor="#9A4A12" delay={0.2}>
                    <span className="font-editorial italic font-normal lowercase text-[#9A4A12] text-[clamp(2.4rem,4.2vw,3.6rem)]">
                      craft
                    </span>
                  </BrushHighlight>
                </TextReveal>
              </h2>

              <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-[#18120E] shadow-[0_24px_56px_-22px_rgba(24,18,14,0.35)]">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src="/images/woodfire-craft.jpg"
                    alt="Artisan sliding fresh wood-fired pizza onto wooden peel inside 480°C brick oven"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-[#18120E] px-5 py-4 text-xs text-[#FAF7F2]">
                  <span className="font-semibold uppercase tracking-[0.16em] text-stone-300">
                    Seasoned Oak Hearth
                  </span>
                  <span className="font-display text-base tracking-wider text-[#E50916]">
                    480°C / 90 SEC
                  </span>
                </div>
              </div>
            </div>

            {/* Right 2x2 Pillar Cards Column */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
              {WHY_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.num}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex flex-col justify-between rounded-3xl border border-stone-200/80 bg-white p-6 shadow-[0_10px_28px_-18px_rgba(24,18,14,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9A4A12]/40"
                  >
                    <div>
                      <div className="mb-5 flex items-center justify-between">
                        <span className="font-display text-2xl tracking-wider text-[#D91E18]">
                          {pillar.num}
                        </span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#9A4A12]">
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold tracking-tight text-[#18120E]">
                        {pillar.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#6E6259]">
                        {pillar.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BAND 5 — EXTRA SECTION 2: HOW PIZZAHUB WORKS (#18120E + Three.js Embers)
         ========================================================= */}
      <section className="relative overflow-hidden bg-[#18120E] py-20 text-[#FAF7F2] md:py-28">
        <OvenEmberCanvas className="opacity-80" />

        <div className="site-container relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#D97706]">
              <span>Three Effortless Steps</span>
            </div>
            <h2 className="leading-[0.96] tracking-tight text-white">
              <TextReveal>
                <span className="font-display text-[clamp(2.25rem,4.2vw,3.6rem)] uppercase">
                  FROM HEARTH TO{' '}
                </span>
                <BrushHighlight color="#E50916" secondaryColor="#D97706" delay={0.2}>
                  <span className="font-editorial italic font-normal lowercase text-[#FAF7F2] text-[clamp(2.5rem,4.6vw,3.9rem)]">
                    doorstep
                  </span>
                </BrushHighlight>
              </TextReveal>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-300 md:text-base">
              Seamless multi-vendor ordering engineered for real customers, local brick-oven
              chefs, and transparent platform oversight.
            </p>
          </div>

          <div className="gsap-how-grid mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div
                key={item.step}
                className="gsap-how-step flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition duration-300 hover:border-[#E50916]/50 hover:bg-white/[0.07]"
              >
                <div>
                  <span className="font-display inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E50916]/15 text-xl tracking-widest text-[#E50916] ring-1 ring-[#E50916]/30">
                    {item.step}
                  </span>
                  <h3 className="mt-6 text-xl font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-stone-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-[#E50916] px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_32px_-8px_rgba(229,9,22,0.65)] transition hover:bg-[#c80814]"
            >
              <span>Explore Pizza Menu</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-[#FAF7F2] transition hover:border-white/40 hover:bg-white/10"
            >
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
