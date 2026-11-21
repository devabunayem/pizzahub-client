'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Flame,
  Clock,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Store,
  CheckCircle2,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MenuGridSkeleton } from '@/components/ui/Skeleton';
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
    <div className="space-y-20 sm:space-y-24 pb-20">
      {/* 1. Hero: Asymmetric Split with quiet chrome and real material */}
      <section className="pt-12 sm:pt-16 lg:pt-20 border-b border-black/[0.06] dark:border-white/[0.08] pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 text-xs text-stone-500 font-medium">
                <Flame className="w-3.5 h-3.5 text-[#b91c1c]" />
                <span>Wood-fired artisanal pizzas from local ovens</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-semibold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.08]">
                Fresh pizza from local kitchens delivered to your door
              </h1>

              <p className="text-base text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                Connect directly with independent neighborhood pizzerias. Slow-fermented dough, 480°C stone ovens, and direct order tracking from oven to doorstep.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/menu"
                  className="px-6 py-3 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white font-medium text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Explore menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/signup?role=vendor"
                  className="px-5 py-3 rounded-lg border border-black/[0.12] dark:border-white/[0.12] hover:bg-stone-50 dark:hover:bg-white/[0.03] text-stone-800 dark:text-stone-200 font-medium text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <Store className="w-4 h-4 text-stone-400" />
                  <span>Join as restaurant</span>
                </Link>
              </div>

              {/* Quiet Features Row */}
              <div className="pt-4 grid grid-cols-3 gap-6 text-xs text-stone-500 border-t border-black/[0.06] dark:border-white/[0.08]">
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm text-stone-900 dark:text-stone-200 tabular-nums">25 min</div>
                  <div className="text-stone-500">Average delivery</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm text-stone-900 dark:text-stone-200 tabular-nums">480°C</div>
                  <div className="text-stone-500">Hearth temperature</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm text-stone-900 dark:text-stone-200">Independent</div>
                  <div className="text-stone-500">Verified kitchens</div>
                </div>
              </div>
            </div>

            {/* Right Visual: The ONE bright element — authentic wood-fired pizza */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 dark:bg-[#141416] border border-black/[0.08] dark:border-white/[0.08]">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80"
                  alt="Wood-fired artisanal pizza"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Menu Items */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Recommendations
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
              Featured menu items
            </h2>
          </div>

          <Link
            href="/menu"
            className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 inline-flex items-center space-x-1"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <MenuGridSkeleton count={4} />
        ) : featuredItems.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 dark:bg-white/[0.02] rounded-xl border border-black/[0.06] dark:border-white/[0.08] text-xs text-stone-500">
            No items available at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col bg-white dark:bg-[#151517] rounded-xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] transition-colors hover:border-black/[0.2] dark:hover:border-white/[0.2]"
              >
                {/* Photo */}
                <div className="relative h-44 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/90 dark:bg-[#151517]/90 text-stone-800 dark:text-stone-200 backdrop-blur-sm border border-black/[0.04] dark:border-white/[0.08]">
                      {item.category}
                    </span>
                    {item.vendorId?.subscriptionPlan === 'premium' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
                        {item.itemName}
                      </h3>
                      <span className="font-semibold text-sm tabular-nums text-stone-900 dark:text-stone-100 shrink-0">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="truncate max-w-[120px]">
                        {item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen'}
                      </span>
                      <span className="flex items-center truncate max-w-[110px]">
                        <MapPin className="w-3 h-3 mr-0.5 text-stone-400 shrink-0" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    <Link
                      href={`/menu/${item._id}`}
                      className="w-full py-2 rounded-lg bg-stone-100 dark:bg-white/[0.05] hover:bg-stone-200 dark:hover:bg-white/[0.08] text-stone-900 dark:text-stone-100 font-medium text-xs text-center block transition-colors"
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

      {/* 3. Interactive Crust Lab */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <PizzaVisualizer />
      </section>

      {/* 4. Pizza Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            Menu selection
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Pizza categories
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-40 rounded-xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] transition-colors"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent p-5 flex flex-col justify-end">
                <h3 className="text-base font-semibold text-white">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 mt-0.5 line-clamp-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Why Choose PizzaHub */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-2xl bg-stone-50 dark:bg-[#141416] border border-black/[0.08] dark:border-white/[0.08]">
          <div className="max-w-xl mb-10 space-y-2">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              About the platform
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
              Why choose PizzaHub
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Direct connection to neighborhood pizza artisans without middleman markups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100">
                Traditional brick ovens
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Partner pizzerias use authentic ovens reaching 480°C for blistered leopard crusts and fresh mozzarella melts.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100">
                Scheduled delivery dates
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Order for immediate dispatch or select an upcoming delivery date with custom notes directly for the kitchen.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100">
                Independent kitchens
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Local restaurant owners manage their menu listings and orders directly on their own dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            How PizzaHub works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <span className="text-xs font-medium text-stone-400">01</span>
            <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100">
              Discover local kitchens
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Browse approved menus, filter by category or price, and explore ingredient descriptions.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-stone-400">02</span>
            <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100">
              Set delivery details
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Select your preferred delivery date and provide any special kitchen instructions.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-stone-400">03</span>
            <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100">
              Follow order progress
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Track review status in your customer dashboard as the restaurant prepares your meal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
