import React from 'react';
import Link from 'next/link';
import {
  Pizza,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Clock,
  Heart,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-stone-200/80 dark:border-white/10 bg-[#fff8ed] dark:bg-[#08090b] text-stone-800 dark:text-white transition-colors">
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-emerald-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 size-80 rounded-full bg-orange-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-16">
        {/* Pre-Footer CTA Banner */}
        <div
          data-light-theme="footer-cta"
          className="mb-14 flex flex-col justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/80 via-[#10251e] to-[#111a17] text-white p-7 sm:flex-row sm:items-center sm:p-9 shadow-xl shadow-emerald-950/10"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-emerald-400">
              YOUR NEXT FAVORITE SLICE
            </p>
            <h3 className="mt-2 text-xl font-bold sm:text-2xl text-white">
              Hungry? Let&apos;s fix that!
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Explore delicious pizzas and find your perfect match from local kitchens.
            </p>
          </div>
          <Link
            href="/menu"
            className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-xl"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Column Footer Grid */}
        <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 border-t border-stone-200/80 dark:border-white/10">
          {/* Brand */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-2">
              <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Pizza className="w-6 h-6" />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                Pizza<span className="text-emerald-500">Hub.</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-stone-600 dark:text-white/50">
              Freshly baked happiness, delivered hot to your door. Discover amazing flavors and
              support your favorite local pizza makers with PizzaHub.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-10 items-center justify-center rounded-xl border border-stone-300 dark:border-white/10 bg-white dark:bg-white/[0.04] text-stone-700 dark:text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-emerald-600 hover:text-white"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-10 items-center justify-center rounded-xl border border-stone-300 dark:border-white/10 bg-white dark:bg-white/[0.04] text-stone-700 dark:text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-emerald-600 hover:text-white"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex size-10 items-center justify-center rounded-xl border border-stone-300 dark:border-white/10 bg-white dark:bg-white/[0.04] text-stone-700 dark:text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-emerald-600 hover:text-white"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white">
              Explore
            </h3>
            <div className="flex flex-col gap-3.5">
              <Link
                href="/"
                className="group flex items-center gap-2 text-sm text-stone-600 dark:text-white/50 transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowRight className="w-3.5 h-3.5 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 text-emerald-500" />
                Home
              </Link>
              <Link
                href="/menu"
                className="group flex items-center gap-2 text-sm text-stone-600 dark:text-white/50 transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowRight className="w-3.5 h-3.5 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 text-emerald-500" />
                Our Menu
              </Link>
              <Link
                href="/menu?category=Classic+Pizzas"
                className="group flex items-center gap-2 text-sm text-stone-600 dark:text-white/50 transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowRight className="w-3.5 h-3.5 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 text-emerald-500" />
                Classic Pizzas
              </Link>
              <Link
                href="/menu?category=Meat+Lovers"
                className="group flex items-center gap-2 text-sm text-stone-600 dark:text-white/50 transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowRight className="w-3.5 h-3.5 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 text-emerald-500" />
                Meat Lovers
              </Link>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white">
              Platform
            </h3>
            <div className="flex flex-col gap-3.5">
              <Link
                href="/menu"
                className="group flex items-center gap-2 text-sm text-stone-600 dark:text-white/50 transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowRight className="w-3.5 h-3.5 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 text-emerald-500" />
                Order Pizza
              </Link>
              <Link
                href="/signup?role=vendor"
                className="group flex items-center gap-2 text-sm text-stone-600 dark:text-white/50 transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowRight className="w-3.5 h-3.5 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 text-emerald-500" />
                Become a Vendor
              </Link>
              <Link
                href="/signin"
                className="group flex items-center gap-2 text-sm text-stone-600 dark:text-white/50 transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowRight className="w-3.5 h-3.5 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 text-emerald-500" />
                My Account
              </Link>
              <Link
                href="/dashboard/customer"
                className="group flex items-center gap-2 text-sm text-stone-600 dark:text-white/50 transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ArrowRight className="w-3.5 h-3.5 -ml-4 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100 text-emerald-500" />
                Order Tracking
              </Link>
            </div>
          </div>

          {/* Get In Touch */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white">
              Get In Touch
            </h3>
            <div className="flex flex-col gap-4 text-sm text-stone-600 dark:text-white/50">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400 w-4 h-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <a
                href="mailto:support@pizzahub.com"
                className="flex items-center gap-3 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Mail className="shrink-0 text-emerald-500 dark:text-emerald-400 w-4 h-4" />
                <span>support@pizzahub.com</span>
              </a>
              <a
                href="tel:+8801300725948"
                className="flex items-center gap-3 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Phone className="shrink-0 text-emerald-500 dark:text-emerald-400 w-4 h-4" />
                <span>+880 1300-725948</span>
              </a>
              <div className="flex items-center gap-3">
                <Clock className="shrink-0 text-emerald-500 dark:text-emerald-400 w-4 h-4" />
                <span>Always ready for your cravings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col justify-between gap-4 border-t border-stone-200/80 dark:border-white/10 py-7 text-center text-xs text-stone-500 dark:text-white/40 sm:flex-row sm:items-center sm:text-left">
          <p>© {new Date().getFullYear()} PizzaHub. All rights reserved.</p>
          <p className="inline-flex items-center justify-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> for pizza lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};
