'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pizza, ArrowUpRight, Mail, Phone, MapPin, Instagram, Facebook, Github } from 'lucide-react';
import { BrushHighlight } from '@/components/ui/BrushHighlight';

const CATEGORY_LINKS = [
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

export const Footer = () => {
  const pathname = usePathname();

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden bg-[#18120E] text-[#FAF7F2]">
      {/* Subtle top wood-ember hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E50916]/60 to-transparent" />

      <div className="site-container py-16 md:py-20">
        {/* Top Editorial Banner Row */}
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D97706]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E50916]" />
              <span>Wood-Fired Marketplace · 480°C Brick Ovens</span>
            </div>
            <h2 className="leading-[0.96] tracking-tight text-white">
              <span className="font-display block text-[clamp(2.25rem,4.4vw,3.75rem)] uppercase">
                Craving An{' '}
                <BrushHighlight color="#E50916" secondaryColor="#D97706" delay={0.15}>
                  <span className="font-editorial font-normal italic lowercase text-[#FAF7F2]">
                    authentic
                  </span>
                </BrushHighlight>{' '}
                Slice?
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-[#E50916] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-10px_rgba(229,9,22,0.65)] transition hover:bg-[#c80814]"
            >
              <span>Browse Full Menu</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/signup?role=vendor"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#FAF7F2] transition hover:border-white/30 hover:bg-white/10"
            >
              <span>Partner Your Kitchen</span>
            </Link>
          </div>
        </div>

        {/* Main 4-Column Directory */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-xl font-black tracking-tight text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e50916] text-white shadow-sm">
                <Pizza className="h-5 w-5" />
              </span>
              <span>
                Pizza<span className="text-[#e50916]">Hub</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-400">
              Hand-stretched 72-hour fermented dough, San Marzano DOP tomatoes, and neighborhood
              brick-oven kitchens delivering bubbling artisan pies straight to your table.
            </p>

            {/* Social Links — includes modern X SVG */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PizzaHub on X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-stone-300 transition hover:border-[#E50916]/60 hover:bg-[#E50916] hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PizzaHub on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-stone-300 transition hover:border-[#E50916]/60 hover:bg-[#E50916] hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PizzaHub on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-stone-300 transition hover:border-[#E50916]/60 hover:bg-[#E50916] hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PizzaHub on GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-stone-300 transition hover:border-[#E50916]/60 hover:bg-[#E50916] hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D97706]">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-stone-300 transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-stone-300 transition hover:text-white">
                  Browse Menu
                </Link>
              </li>
              <li>
                <Link href="/signin" className="text-stone-300 transition hover:text-white">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-stone-300 transition hover:text-white">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link href="/signup?role=vendor" className="text-stone-300 transition hover:text-white">
                  Become a Vendor
                </Link>
              </li>
            </ul>
          </div>

          {/* Pizza Categories Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D97706]">
              Oven Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORY_LINKS.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/menu?category=${encodeURIComponent(cat)}`}
                    className="text-stone-300 transition hover:text-white"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D97706]">
              Kitchen Desk
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E50916]" />
                <span>214 Mulberry Brick-Oven District, Downtown NY 10012</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#E50916]" />
                <a href="mailto:support@pizzahub.com" className="transition hover:text-white">
                  support@pizzahub.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#E50916]" />
                <a href="tel:+8801300725948" className="transition hover:text-white">
                  +880 1300-725948
                </a>
              </li>
            </ul>
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-stone-400">
              <span className="font-semibold text-[#FAF7F2]">Daily Hearth Hours:</span>{' '}
              11:00 AM — 11:30 PM EST
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-stone-400 sm:flex-row">
          <p>© {new Date().getFullYear()} PizzaHub Artisan Delivery. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/menu" className="transition hover:text-white">
              Menu Standards
            </Link>
            <Link href="/profile" className="transition hover:text-white">
              Account Settings
            </Link>
            <a href="mailto:support@pizzahub.com" className="transition hover:text-white">
              Help &amp; Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
