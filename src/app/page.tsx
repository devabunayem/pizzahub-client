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
  Flame,
  Clock,
  Layers,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { PizzaVisualizer } from '@/components/home/PizzaVisualizer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// 4 Interactive Showcase Pizzas for the User's Hero Wireframe
const heroShowcasePizzas = [
  {
    id: 'pepperoni',
    name: 'Signature Double Pepperoni',
    shortName: 'Pepperoni',
    tagline: 'WOOD-FIRED & EXTRA CRISPY',
    price: '$14.99',
    rawPrice: 14.99,
    calories: '850 kcal',
    rating: '4.9',
    prepTime: '20-25 min',
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1200&q=90',
    description:
      'Loaded with crispy-cupped double beef pepperoni, whole-milk mozzarella cheese, and rich San Marzano tomato sauce on 48-hour fermented sourdough crust.',
    accentColor: '#ed101b',
  },
  {
    id: 'truffle',
    name: 'Wild Truffle & Forest Mushroom',
    shortName: 'Truffle Funghi',
    tagline: "CHEF'S GOURMET RESERVE",
    price: '$17.50',
    rawPrice: 17.50,
    calories: '780 kcal',
    rating: '4.8',
    prepTime: '25-30 min',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=90',
    description:
      'Pan-roasted wild cremini mushrooms, aged fontina cheese, fresh rosemary needles, and an aromatic drizzle of cold-pressed Italian white truffle oil.',
    accentColor: '#ffb900',
  },
  {
    id: 'margherita',
    name: 'Heritage Margherita Royale',
    shortName: 'Margherita',
    tagline: 'CLASSIC ITALIAN RECIPE',
    price: '$13.25',
    rawPrice: 13.25,
    calories: '720 kcal',
    rating: '4.9',
    prepTime: '18-22 min',
    image:
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1200&q=90',
    description:
      'Creamy fresh buffalo mozzarella, vine-ripened San Marzano tomato puree, hand-torn Genovese sweet basil, and extra virgin olive oil drizzle.',
    accentColor: '#10b981',
  },
  {
    id: 'bbq-chicken',
    name: 'Smokey Chipotle BBQ Chicken',
    shortName: 'BBQ Chicken',
    tagline: 'SWEET & SMOKEY FEAST',
    price: '$16.80',
    rawPrice: 16.80,
    calories: '920 kcal',
    rating: '4.8',
    prepTime: '22-26 min',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=90',
    description:
      'Hickory wood-smoked tender chicken breast, sweet chipotle BBQ glaze, caramelized red onions, smoked provolone, and fresh garden cilantro.',
    accentColor: '#f97316',
  },
];

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
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [rotationDegree, setRotationDegree] = useState<number>(0);
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentPizza = heroShowcasePizzas[selectedIdx];

  const handleSelectPizza = (idx: number) => {
    if (idx === selectedIdx) return;
    // Rotate the pizza by 90deg on each selection to create dynamic movement
    setRotationDegree((prev) => prev + 90);
    setSelectedIdx(idx);
  };

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
          1. HERO SECTION (Custom Wireframe Design:
             Navbar at top -> Left Text Box with 4 Mini Pizzas ->
             Right Big Edge-Bleed Circular Pizza Plate)
      ======================================================== */}
      <section className="relative isolate flex min-h-[90svh] w-full items-center overflow-x-clip bg-[#fff8ed] text-[#30251f] select-none dark:bg-[#070707] dark:text-white lg:min-h-[calc(100svh-4.5rem)] py-8 lg:py-12">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -left-20 top-1/4 size-[400px] rounded-full bg-orange-500/10 dark:bg-orange-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-1/3 size-[550px] rounded-full bg-[#ffb900]/15 dark:bg-[#ffb900]/20 blur-[140px]" />

        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* ================= LEFT COLUMN: TEXT BLOCK + 4 MINI PIZZAS ================= */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 pt-2 lg:pt-0">
              {/* Eyebrow Tag */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffb900]/40 bg-[#ffb900]/15 px-3.5 py-1 text-xs font-bold tracking-wider text-amber-700 dark:text-[#ffb900] uppercase shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-[#ffb900]" />
                  <span>{currentPizza.tagline}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 dark:text-stone-400">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>480°C Stone Oven</span>
                </span>
              </div>

              {/* Main Headline Block (Delicious Pizza Makes Everything Better!) */}
              <div className="relative inline-flex flex-col items-start">
                <p
                  className="font-script-brush -mb-3 sm:-mb-5 text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none tracking-wide text-[#30251f] dark:text-white"
                  style={{
                    textShadow: '0 4px 14px rgba(0,0,0,0.35)',
                  }}
                >
                  Delicious
                </p>

                <div className="flex flex-wrap items-baseline gap-x-3">
                  <h1
                    className="font-pizza-heavy -rotate-2 text-[clamp(3.8rem,11vw,7.5rem)] leading-[0.92] tracking-tight text-[#ffb900]"
                    style={{
                      textShadow: '4px 6px 0px rgba(0,0,0,0.35)',
                    }}
                  >
                    Pizza
                  </h1>
                  <span className="font-script-brush text-[clamp(1.8rem,4.5vw,3.2rem)] font-bold leading-none text-[#ed101b]">
                    Makes Everything Better!
                  </span>
                </div>

                {/* Active Pizza Flavor Name with Subtle Underline */}
                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
                  <span>{currentPizza.name}</span>
                </h2>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base leading-relaxed text-stone-600 dark:text-stone-300 max-w-xl">
                {currentPizza.description}
              </p>

              {/* Key Highlights Metrics */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-1.5 text-stone-800 dark:text-white">
                  <span className="text-2xl font-black text-[#e50916] dark:text-[#ffb900] tabular-nums">
                    {currentPizza.price}
                  </span>
                </div>
                <div className="h-4 w-px bg-stone-300 dark:bg-white/20" />
                <div className="flex items-center gap-1 text-stone-700 dark:text-stone-300">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{currentPizza.rating} / 5.0</span>
                </div>
                <div className="h-4 w-px bg-stone-300 dark:bg-white/20" />
                <div className="flex items-center gap-1 text-stone-700 dark:text-stone-300">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>{currentPizza.prepTime}</span>
                </div>
                <div className="h-4 w-px bg-stone-300 dark:bg-white/20 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-1 text-stone-700 dark:text-stone-300">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{currentPizza.calories}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/menu"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#e50916] py-3 pl-7 pr-3 text-base font-bold text-white shadow-[0_10px_25px_rgba(229,9,22,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff1624] sm:text-lg"
                >
                  <span>Order Now</span>
                  <span className="flex size-8 items-center justify-center rounded-full bg-white text-[#e50916] transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </span>
                </Link>

                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 dark:border-white/20 bg-white/60 dark:bg-white/5 px-6 py-3 text-sm font-bold text-stone-800 dark:text-white backdrop-blur-sm transition-all hover:bg-stone-100 dark:hover:bg-white/10"
                >
                  <Layers className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                  <span>Explore All Flavors</span>
                </Link>
              </div>

              {/* ================= 4 MINI CIRCULAR PIZZAS (User Wireframe Element) ================= */}
              <div className="pt-4 border-t border-stone-200/80 dark:border-white/10">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[11px] font-extrabold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                    Select Flavor Showcase ({selectedIdx + 1} of 4)
                  </p>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Click to spin &amp; preview
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto pb-2">
                  {heroShowcasePizzas.map((pizza, idx) => {
                    const isSelected = selectedIdx === idx;
                    return (
                      <button
                        key={pizza.id}
                        type="button"
                        onClick={() => handleSelectPizza(idx)}
                        className={`group relative flex flex-col items-center transition-all duration-300 focus:outline-none ${
                          isSelected
                            ? 'scale-110 -translate-y-1'
                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={pizza.name}
                      >
                        {/* Circular Mini Pizza */}
                        <div
                          className={`relative size-14 sm:size-16 rounded-full overflow-hidden p-0.5 border-2 transition-all shadow-md ${
                            isSelected
                              ? 'border-[#ffb900] ring-4 ring-[#ffb900]/30 shadow-orange-500/30'
                              : 'border-stone-300 dark:border-white/20 hover:border-[#ffb900]/70'
                          }`}
                        >
                          <img
                            src={pizza.image}
                            alt={pizza.name}
                            className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:rotate-45"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#ffb900]/10 rounded-full" />
                          )}
                        </div>

                        {/* Title Underneath */}
                        <span
                          className={`mt-1.5 text-[11px] font-bold truncate max-w-[70px] sm:max-w-[85px] transition-colors ${
                            isSelected
                              ? 'text-[#e50916] dark:text-[#ffb900]'
                              : 'text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {pizza.shortName}
                        </span>

                        {/* Price */}
                        <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 tabular-nums">
                          {pizza.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: BIG EDGE-BLEED CIRCULAR PIZZA ================= */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              {/* Outer Circular Tray Container */}
              <div className="relative flex items-center justify-center">
                {/* Ambient Radial Backlight */}
                <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-[#ffb900]/30 via-orange-500/20 to-red-500/10 blur-2xl pointer-events-none" />

                {/* Steam doodle decorative SVG */}
                <svg
                  viewBox="0 0 60 60"
                  className="absolute -top-8 right-12 z-30 h-14 w-14 text-white/80 animate-pulse pointer-events-none"
                  fill="currentColor"
                >
                  <path d="M12 22C24 14 38 12 44 16C48 19 30 24 12 22Z" />
                  <path d="M14 31C28 29 44 31 48 36C50 40 30 37 14 31Z" />
                  <path d="M12 40C22 44 34 50 36 54C37 57 22 49 12 40Z" />
                </svg>

                {/* The Giant Circular Pizza Plate (Bleeds off right edge on desktop) */}
                <div
                  className="relative size-[300px] sm:size-[420px] lg:size-[560px] xl:size-[640px] rounded-full p-2.5 sm:p-4 bg-stone-900/15 dark:bg-black/60 border-4 sm:border-8 border-stone-800/10 dark:border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.4)] backdrop-blur-sm lg:-mr-28 xl:-mr-36 transition-transform duration-700 ease-out"
                  style={{
                    transform: `rotate(${rotationDegree}deg)`,
                  }}
                >
                  {/* Pizza Image inside circular plate */}
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                    <img
                      src={currentPizza.image}
                      alt={currentPizza.name}
                      className="w-full h-full object-cover rounded-full"
                    />

                    {/* Subtle warm crust lighting overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-black/25 via-transparent to-white/10" />
                  </div>
                </div>

                {/* Floating Hot Fresh Badge */}
                <div className="absolute -bottom-2 sm:bottom-4 left-4 sm:left-2 z-30 flex items-center gap-2 rounded-2xl bg-white/95 dark:bg-[#16181a]/95 px-4 py-2 shadow-xl border border-stone-200 dark:border-white/10 backdrop-blur-md">
                  <div className="size-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-stone-900 dark:text-white uppercase tracking-wider">
                      Hot &amp; Fresh
                    </div>
                    <div className="text-[10px] text-stone-500 font-medium">
                      Oven Baked in 480°C
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Corner Red Wave Splash SVG */}
        <svg
          viewBox="0 0 260 120"
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-10 w-20 sm:h-16 sm:w-36 lg:h-20 lg:w-48"
          fill="none"
        >
          <path d="M0 0C55 68 155 104 260 120H0V0Z" fill="#e50916" />
        </svg>
      </section>

      {/* ========================================================
          2. FEATURED PIZZAS (Dynamic from API)
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
          4. WHY CHOOSE PIZZAHUB? (4-card layout with watermarks)
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
          5. HOW PIZZAHUB WORKS (3-card layout)
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
          6. INTERACTIVE CRUST LAB (Crust Visualizer)
      ======================================================== */}
      <section className="bg-[#fff8ed] dark:bg-[#08090b] px-5 py-20 text-[#30251f] dark:text-white sm:px-8 lg:px-12 border-t border-black/[0.04] dark:border-white/5">
        <div className="mx-auto max-w-7xl">
          <PizzaVisualizer />
        </div>
      </section>
    </div>
  );
}
