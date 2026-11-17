'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Pizza,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  MapPin,
  ShieldCheck,
  Award,
  ChevronRight,
  CheckCircle2,
  Users,
  Store,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const categories = [
  {
    name: 'Classic Pizzas',
    icon: '🍕',
    desc: 'Timeless Margherita, Quattro Formaggi & marinara legends.',
    image:
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Meat Lovers',
    icon: '🥩',
    desc: 'Smoked pepperoni, Italian sausage, bacon & BBQ chicken.',
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Vegetarian Pizzas',
    icon: '🥗',
    desc: 'Sun-dried tomatoes, artichokes, feta & garden veggies.',
    image:
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Specialty / Gourmet Pizzas',
    icon: '🍄',
    desc: 'Truffle mushrooms, prosciutto crudo & artisanal drizzle.',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sides & Appetizers',
    icon: '🥖',
    desc: 'Garlic herb dough knots, mozzarella sticks & dipping sauces.',
    image:
      'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Beverages & Desserts',
    icon: '🍰',
    desc: 'Authentic tiramisu, cannoli, cold brew & Italian sodas.',
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
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
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. Hero Banner Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-pizza-50/50 via-white to-transparent dark:from-stone-900/60 dark:via-stone-950 dark:to-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-pizza-100 dark:bg-pizza-950/60 text-pizza-700 dark:text-pizza-300 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-pizza-600 animate-pulse" />
                <span>Wood-Fired & Handcrafted Artisanal Crusts</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-white tracking-tight leading-[1.1]">
                Hot & Fresh Pizza{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pizza-600 via-orange-500 to-amber-500">
                  Delivered Straight
                </span>{' '}
                to Your Doorstep
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with the finest local pizzerias. Browse masterfully baked pies,
                customize delivery dates, and track your cravings with real-time status updates.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/menu"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-pizza-600 to-pizza-500 hover:from-pizza-700 hover:to-pizza-600 text-white font-bold text-base shadow-xl shadow-pizza-500/30 hover:shadow-pizza-500/40 transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <Pizza className="w-5 h-5" />
                  <span>Explore Pizza Menu</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>

                <Link
                  href="/signup?role=vendor"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl border-2 border-stone-300 dark:border-stone-700 hover:border-pizza-500 text-stone-800 dark:text-stone-200 font-semibold text-base transition-colors flex items-center justify-center space-x-2"
                >
                  <Store className="w-5 h-5 text-pizza-500" />
                  <span>Register as Restaurant</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400">
                <div className="flex items-center space-x-2 justify-center lg:justify-start">
                  <Clock className="w-5 h-5 text-pizza-500 shrink-0" />
                  <span className="text-xs font-semibold">30-Min Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start">
                  <Award className="w-5 h-5 text-pizza-500 shrink-0" />
                  <span className="text-xs font-semibold">100% Mozzarella</span>
                </div>
                <div className="flex items-center space-x-2 justify-center lg:justify-start">
                  <ShieldCheck className="w-5 h-5 text-pizza-500 shrink-0" />
                  <span className="text-xs font-semibold">Verified Chefs</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual with animated badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md lg:max-w-none">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80"
                    alt="Authentic Gourmet Woodfire Pizza"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Floating Floating Badge 1 */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-white dark:bg-stone-800 shadow-xl border border-stone-100 dark:border-stone-700 flex items-center space-x-3.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Customer Rating</p>
                    <p className="text-base font-bold text-stone-900 dark:text-white flex items-center">
                      4.9 / 5.0 <span className="text-amber-500 ml-1">★★★★★</span>
                    </p>
                  </div>
                </motion.div>

                {/* Floating Badge 2 */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                  className="absolute -top-6 -right-6 p-4 rounded-2xl bg-white dark:bg-stone-800 shadow-xl border border-stone-100 dark:border-stone-700 flex items-center space-x-3.5"
                >
                  <div className="w-12 h-12 rounded-xl bg-pizza-500/10 text-pizza-600 flex items-center justify-center">
                    <Pizza className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Daily Baked</p>
                    <p className="text-base font-bold text-stone-900 dark:text-white">
                      1000+ Slices
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Section 1: Featured Menu Items (At least 6 items from DB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 space-y-4 md:space-y-0">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-pizza-600 dark:text-pizza-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Chef&apos;s Recommendations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Featured Menu Items
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm mt-1">
              Hand-selected artisanal pizzas freshly approved by platform connoisseurs.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-pizza-600 dark:text-pizza-400 hover:text-pizza-700 group"
          >
            <span>View All Menu Items</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching featured pizzas from database..." />
        ) : featuredItems.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
            <Pizza className="w-12 h-12 mx-auto text-pizza-400 mb-3" />
            <p className="text-stone-600 dark:text-stone-400 font-semibold">
              No featured pizzas found at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex flex-col bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-pizza-300 dark:hover:border-pizza-800 transition-all duration-300"
              >
                {/* Image Container with fixed height for equal grid look */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white shadow-sm backdrop-blur-sm">
                      {item.category}
                    </span>
                    {item.vendorId?.subscriptionPlan === 'premium' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 mr-0.5" />
                        <span>Premium</span>
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-pizza-600 text-white text-sm font-black shadow-md">
                    {formatPrice(item.price)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-stone-900 dark:text-white line-clamp-1 group-hover:text-pizza-600 transition-colors">
                      {item.itemName}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                      <span className="font-semibold text-stone-900 dark:text-stone-200 truncate max-w-[130px]">
                        🏪 {item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen'}
                      </span>
                      <span className="flex items-center text-[11px] text-stone-500">
                        <MapPin className="w-3 h-3 mr-0.5 text-pizza-500 shrink-0" />
                        <span className="truncate max-w-[110px]">{item.location}</span>
                      </span>
                    </div>

                    <Link
                      href={`/menu/${item._id}`}
                      className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-pizza-600 hover:text-white dark:hover:bg-pizza-600 dark:hover:text-white text-stone-900 dark:text-stone-100 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <span>View Details & Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Dynamic Section 2: Pizza Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-pizza-600 dark:text-pizza-400 text-xs font-bold uppercase tracking-wider">
            <Pizza className="w-4 h-4" />
            <span>Curated Flavors</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Explore by Pizza Category
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm">
            Whether you love authentic Italian crusts, loaded meats, or vegan specialties, we have it all.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.name}
              href={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-48 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-transparent p-6 flex flex-col justify-end">
                <div className="text-2xl mb-1">{cat.icon}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-pizza-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Required Extra Section: Why Choose PizzaHub? */}
      <section className="bg-pizza-50/60 dark:bg-stone-900/50 py-16 border-y border-pizza-100 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center space-x-1.5 text-pizza-600 dark:text-pizza-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Platform Advantages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Why Choose Pizza<span className="text-pizza-600">Hub</span>?
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
              We connect pizza enthusiasts directly with local culinary masters while offering
              transparent ordering, verified kitchens, and zero hidden platform fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200/80 dark:border-stone-700/80 space-y-4 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-pizza-100 dark:bg-pizza-950/80 text-pizza-600 dark:text-pizza-400 flex items-center justify-center">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                Authentic Artisanal Ovens
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Every vendor is curated and verified. Enjoy wood-fired temperatures exceeding 800°F
                for authentic leopard-spotted crusts and bubbly buffalo mozzarella.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200/80 dark:border-stone-700/80 space-y-4 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                Scheduled & Live Deliveries
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Choose custom delivery dates and special instructions. Watch order status progress
                live from kitchen preparation straight to your door.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-stone-800 shadow-sm border border-stone-200/80 dark:border-stone-700/80 space-y-4 hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-white">
                Support Local Kitchens
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Independent restaurants keep their profits and grow with premium tools, unlimited
                menu publishing, and dedicated order management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Extra Section 2: How PizzaHub Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-pizza-600 dark:text-pizza-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Simple 3-Step Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            How PizzaHub Works
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-sm">
            Ordering your favorite gourmet slice has never been faster or easier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-pizza-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-pizza-500/30">
              1
            </div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-white">
              Discover Local Pizzerias
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Browse approved menus, filter by category or price, and explore chef specialties with
              detailed ingredient lists.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-pizza-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-pizza-500/30">
              2
            </div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-white">
              Customize Your Order
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Select your delivery date, provide your address, and add special dietary instructions
              for the kitchen.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-pizza-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-pizza-500/30">
              3
            </div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-white">
              Track & Enjoy Fresh
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Receive status confirmation from the vendor and enjoy piping-hot, crispy pizza
              delivered right on schedule.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-pizza-700 via-pizza-600 to-orange-600 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready for the Best Pizza of Your Life?
            </h2>
            <p className="text-pizza-100 text-base sm:text-lg leading-relaxed">
              Browse our approved menus now or join hundreds of restaurant owners growing their
              delivery business on PizzaHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center sm:justify-start">
              <Link
                href="/menu"
                className="px-8 py-3.5 rounded-xl bg-white text-pizza-700 hover:bg-pizza-50 font-bold text-base shadow-lg transition-colors text-center"
              >
                Browse Menu Now
              </Link>
              <Link
                href="/signup?role=vendor"
                className="px-8 py-3.5 rounded-xl bg-pizza-800/80 hover:bg-pizza-900 text-white font-semibold text-base border border-pizza-400/40 transition-colors text-center"
              >
                Become a Vendor
              </Link>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none hidden lg:block">
            <Pizza className="w-96 h-96 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
}
