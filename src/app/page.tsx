'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Flame,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  ChevronRight,
  Store,
  Sparkles,
  Zap,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MenuGridSkeleton } from '@/components/ui/Skeleton';
import { PizzaVisualizer } from '@/components/home/PizzaVisualizer';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const categories = [
  {
    code: '01',
    name: 'Classic Pizzas',
    tag: 'NAPOLI HERITAGE',
    desc: 'Margherita, Quattro Formaggi and Marinara fire-baked in 900°F volcanic stone ovens.',
    image:
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '02',
    name: 'Meat Lovers',
    tag: 'CARNIVORE CRU',
    desc: 'Smoked artisan pepperoni, Calabrian sausage, crispy pancetta, and herb marinara.',
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '03',
    name: 'Vegetarian Pizzas',
    tag: 'FARM TO STONE',
    desc: 'San Marzano tomatoes, wood-roasted bell peppers, baby artichokes and crumbled feta.',
    image:
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '04',
    name: 'Specialty / Gourmet Pizzas',
    tag: 'CHEF\'S RESERVE',
    desc: 'Wild cremini mushrooms, fontina cheese, fresh rosemary, and white truffle oil drizzle.',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '05',
    name: 'Sides & Appetizers',
    tag: 'WARM DOUGH SIDES',
    desc: 'Garlic herb dough knots, spicy marinara dipping sauces, and melted mozzarella bites.',
    image:
      'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
  },
  {
    code: '06',
    name: 'Beverages & Desserts',
    tag: 'SWEET FINALE',
    desc: 'Espresso-soaked Italian tiramisu, crispy cannoli, and chilled artisanal sodas.',
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
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-x-hidden">
      {/* 1. HERO SECTION: Ultra-Bold Gastronomic Brutalism */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 border-b-2 border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 font-black text-xs uppercase tracking-widest">
                <Flame className="w-4 h-4 animate-pulse text-red-500" />
                <span>480°C Wood-Fired • Independent Oven Masters</span>
              </div>

              {/* Massive Monumental Headline */}
              <h1 className="text-5xl sm:text-7xl lg:text-[76px] font-black tracking-tighter uppercase leading-[0.93] text-stone-900 dark:text-white">
                CRAFTED IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-400">FIRE.</span>
                <br />
                DELIVERED <span className="text-stone-900 dark:text-white">HOT.</span>
                <br />
                ZERO COMPROMISE.
              </h1>

              {/* Punchy Subhead */}
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl font-medium leading-relaxed">
                Connect directly with independent neighborhood pizzerias. Slow-fermented 72-hour dough, blistered leopard crusts, and real-time oven tracking to your doorstep.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/menu"
                  className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm tracking-wider uppercase transition-all flex items-center justify-center space-x-3 shadow-xl shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Pizza Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/signup?role=vendor"
                  className="px-7 py-4 rounded-xl border-2 border-stone-800 hover:border-stone-600 bg-stone-900/60 hover:bg-stone-900 text-white font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center space-x-2.5"
                >
                  <Store className="w-4 h-4 text-orange-400" />
                  <span>Join As Pizzeria</span>
                </Link>
              </div>

              {/* Live Metric Row */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t-2 border-stone-800/80">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black tabular-nums text-red-500">25 MIN</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Avg. Delivery</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black tabular-nums text-orange-400">900°F</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Baking Temp</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black tabular-nums text-emerald-400">100%</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Real Artisans</div>
                </div>
              </div>
            </div>

            {/* Right Visual: Heavyweight Stamped Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-stone-800 shadow-2xl bg-stone-900 group">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85"
                  alt="Artisanal Wood-Fired Pizza"
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white font-black text-xs tracking-wider uppercase flex items-center space-x-1.5 shadow-lg">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span>Wood-Fired Pizza</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-stone-950/90 backdrop-blur-md p-4 rounded-2xl border border-stone-800 text-white flex items-center justify-between shadow-2xl">
                  <div>
                    <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                      Featured Crust Style
                    </div>
                    <div className="text-sm font-black tracking-tight text-white mt-0.5">
                      San Marzano D.O.P. Margherita
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">From</span>
                    <span className="text-lg font-black text-white">$17.50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE KINETIC MARQUEE TICKER */}
      <div className="py-4 bg-stone-950 border-y-2 border-stone-800 text-stone-200 overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs sm:text-sm font-black tracking-widest uppercase">
          <span>🔥 480°C VOLCANIC STONE OVENS</span>
          <span className="text-red-500">///</span>
          <span>⚡ 25-MIN HOT STEAM DELIVERY</span>
          <span className="text-red-500">///</span>
          <span>🍕 72-HOUR COLD FERMENTED DOUGH</span>
          <span className="text-red-500">///</span>
          <span>🧀 100% FIOR DI LATTE MOZZARELLA</span>
          <span className="text-red-500">///</span>
          <span>🇮🇹 NAPOLI ARTISANAL RECIPES</span>
          <span className="text-red-500">///</span>
          <span>📦 THERMAL STEAM-LOCK PACKAGING</span>
          <span className="text-red-500">///</span>
          <span>★ 4.98 RATED BY 12K+ PIZZA LOVERS</span>
          <span className="text-red-500">///</span>
          {/* Loop copy */}
          <span>🔥 480°C VOLCANIC STONE OVENS</span>
          <span className="text-red-500">///</span>
          <span>⚡ 25-MIN HOT STEAM DELIVERY</span>
          <span className="text-red-500">///</span>
          <span>🍕 72-HOUR COLD FERMENTED DOUGH</span>
          <span className="text-red-500">///</span>
          <span>🧀 100% FIOR DI LATTE MOZZARELLA</span>
          <span className="text-red-500">///</span>
          <span>🇮🇹 NAPOLI ARTISANAL RECIPES</span>
          <span className="text-red-500">///</span>
          <span>📦 THERMAL STEAM-LOCK PACKAGING</span>
          <span className="text-red-500">///</span>
          <span>★ 4.98 RATED BY 12K+ PIZZA LOVERS</span>
          <span className="text-red-500">///</span>
        </div>
      </div>

      {/* 3. FEATURED MENU: Fresh Off The Shovel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b-2 border-stone-800">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-red-500 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Recommendations</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-stone-900 dark:text-white">
              Featured Menu Items
            </h2>
          </div>

          <Link
            href="/menu"
            className="mt-4 sm:mt-0 px-5 py-2.5 rounded-xl border border-stone-700 hover:border-red-500 text-xs font-black uppercase tracking-wider text-stone-900 dark:text-white hover:text-red-500 transition-colors inline-flex items-center space-x-2 self-start sm:self-auto"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <MenuGridSkeleton count={4} />
        ) : featuredItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/40 rounded-2xl border-2 border-stone-800 text-sm font-bold text-stone-400 uppercase tracking-wider">
            Ovens are warming up. No featured pizzas listed at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col bg-white dark:bg-[#101012] rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 transition-all duration-300 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
              >
                {/* Photo & Badge Overlays */}
                <div className="relative h-52 w-full bg-stone-900 overflow-hidden">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'}
                    alt={item.itemName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-black/85 text-white backdrop-blur-sm border border-white/10">
                      {item.category}
                    </span>
                    {item.vendorId?.subscriptionPlan === 'premium' && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md">
                        ★ Premium
                      </span>
                    )}
                  </div>

                  {/* Price Tag Stamp */}
                  <div className="absolute bottom-3 right-3 bg-red-600 text-white font-black text-sm px-3 py-1 rounded-lg tabular-nums shadow-lg">
                    {formatPrice(item.price)}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-black text-base text-stone-900 dark:text-white line-clamp-1 group-hover:text-red-500 transition-colors">
                      {item.itemName}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-200 dark:border-stone-800/80 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-500">
                      <span className="truncate max-w-[130px] text-stone-900 dark:text-stone-300">
                        {item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen'}
                      </span>
                      <span className="flex items-center truncate max-w-[120px]">
                        <MapPin className="w-3 h-3 mr-1 text-red-500 shrink-0" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    <Link
                      href={`/menu/${item._id}`}
                      className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-red-600 dark:bg-stone-800 dark:hover:bg-red-600 text-stone-900 dark:text-white hover:text-white font-black text-xs tracking-wider uppercase text-center block transition-all"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. INTERACTIVE SHOWSTOPPER: THE CRUST LAB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <PizzaVisualizer />
      </div>

      {/* 5. PIZZA CATEGORIES: The Crust Spectrum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 pb-4 border-b-2 border-stone-800">
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-red-500 mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Menu Selection</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-stone-900 dark:text-white">
            Pizza Categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-48 rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 transition-all duration-300 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
                    {cat.tag}
                  </span>
                  <span className="text-xs font-mono font-black text-white/50">{cat.code}</span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-red-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE PIZZAHUB: The Crust Manifesto */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-14 rounded-3xl bg-[#0d0d0f] border-2 border-stone-800 text-white space-y-12">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-orange-400">
              <ShieldCheck className="w-4 h-4" />
              <span>The PizzaHub Standard</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Why Choose PizzaHub
            </h2>
            <p className="text-sm text-stone-400 font-medium">
              We cut out factory chain mass-production. Every order connects directly with passionate, independent wood-fired pizzerias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
              <div className="text-xs font-mono font-black text-red-500">01 // BRICK OVENS</div>
              <h3 className="font-black text-lg text-white uppercase tracking-tight">
                900°F Volcanic Baking
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Partner pizzerias use traditional brick ovens reaching over 480°C for authentic, blistered leopard crusts and fresh mozzarella melts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
              <div className="text-xs font-mono font-black text-orange-400">02 // TIMED CONCIERGE</div>
              <h3 className="font-black text-lg text-white uppercase tracking-tight">
                Scheduled Delivery Dates
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Order for immediate dispatch or schedule your delivery date with custom notes directly to the master pizzaiolo.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
              <div className="text-xs font-mono font-black text-emerald-400">03 // DIRECT TO CHEF</div>
              <h3 className="font-black text-lg text-white uppercase tracking-tight">
                Independent Kitchens
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Local restaurant owners manage their menu listings and orders directly on their own dashboard without corporate franchise markups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS: The 3-Step Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 pb-4 border-b-2 border-stone-800">
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-red-500 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Process</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-stone-900 dark:text-white">
            How PizzaHub Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-800 space-y-3">
            <span className="text-3xl font-black text-red-500 font-mono">01</span>
            <h3 className="font-black text-lg text-stone-900 dark:text-white uppercase tracking-tight">
              Discover Local Ovens
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Explore authentic neighborhood pizza menus, filter by category or price, and inspect ingredients and crust profiles.
            </p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-800 space-y-3">
            <span className="text-3xl font-black text-orange-400 font-mono">02</span>
            <h3 className="font-black text-lg text-stone-900 dark:text-white uppercase tracking-tight">
              Select Date & Address
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Lock in your delivery date and delivery address, and communicate specific crust baking requests to the kitchen.
            </p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-stone-200 dark:border-stone-800 space-y-3">
            <span className="text-3xl font-black text-emerald-500 font-mono">03</span>
            <h3 className="font-black text-lg text-stone-900 dark:text-white uppercase tracking-tight">
              Direct Tracking
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Track live review status from the customer dashboard as the chef kneads, bakes, and sends your meal via thermal lock transport.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
