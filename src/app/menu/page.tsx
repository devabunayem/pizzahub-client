'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  MapPin,
  RotateCcw,
  Crown,
  ArrowUpRight,
  Pizza,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MenuGridSkeleton, BrowseMenuPageSkeleton } from '@/components/ui/Skeleton';
import { BrushHighlight } from '@/components/ui/BrushHighlight';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  'All',
  'Classic Pizzas',
  'Vegetarian Pizzas',
  'Meat Lovers',
  'Specialty / Gourmet Pizzas',
  'Sides & Appetizers',
  'Beverages & Desserts',
];

function isVendorPremium(vendor: any): boolean {
  if (!vendor || vendor.subscriptionPlan !== 'premium') return false;
  if (!vendor.subscriptionExpiresAt) return true;
  return new Date(vendor.subscriptionExpiresAt) > new Date();
}

function BrowseMenuContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category');
  const initialCategory =
    urlCategory && CATEGORIES.includes(urlCategory) ? urlCategory : 'All';

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>(initialCategory);
  const [location, setLocation] = useState<string>('');
  const [sort, setSort] = useState<string>('newest');

  useEffect(() => {
    if (urlCategory && CATEGORIES.includes(urlCategory)) {
      setCategory(urlCategory);
    }
  }, [urlCategory]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (category && category !== 'All') params.append('category', category);
      if (location.trim()) params.append('location', location.trim());
      if (sort) params.append('sort', sort);

      const res = await fetch(`${API_BASE}/menu?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.items) {
        setItems(data.items);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('');
    setSort('newest');
  };

  const handleCardClick = (itemId: string) => {
    if (!user) {
      router.push(`/signin?redirect=/menu/${itemId}`);
    } else {
      router.push(`/menu/${itemId}`);
    }
  };

  return (
    <section className="min-h-[85vh] bg-[#FAF7F2] py-10 md:py-14">
      <div className="site-container space-y-8">
        {/* Editorial Page Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9A4A12]">
              <span className="h-2 w-2 rounded-full bg-[#D91E18]" />
              <span>Wood-Fired Kitchens</span>
            </div>
            <h1 className="leading-[0.98] tracking-tight text-[#18120E]">
              <span className="font-display text-[clamp(2.1rem,3.8vw,3.2rem)] uppercase">
                BROWSE{' '}
              </span>
              <BrushHighlight immediate color="#D91E18" secondaryColor="#9A4A12" delay={0.18}>
                <span className="font-editorial italic font-normal lowercase text-[#9A4A12] text-[clamp(2.3rem,4.2vw,3.5rem)]">
                  artisan
                </span>
              </BrushHighlight>
              <span className="font-display text-[clamp(2.1rem,3.8vw,3.2rem)] uppercase">
                {' '}
                MENU
              </span>
            </h1>
            <p className="mt-2 text-sm text-[#6E6259]">
              Explore wood-fired pizzas, gourmet specialties, sides, and handcrafted desserts.
            </p>
          </div>

          <div className="inline-flex items-center self-start rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-[#18120E] tabular-nums shadow-sm sm:self-auto">
            <span>{items.length} items available</span>
          </div>
        </div>

        {/* Search & Control Bar */}
        <div className="space-y-4 rounded-3xl border border-stone-200/90 bg-white p-5 shadow-[0_14px_34px_-22px_rgba(24,18,14,0.14)]">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            {/* Search Term */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by pizza name or ingredient..."
                className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Location Filter */}
            <div className="relative w-full sm:w-48">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g. Brooklyn)"
                className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#18120E] placeholder:text-stone-400 transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Sort Selector */}
            <div className="w-full sm:w-44">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm font-medium text-[#18120E] transition focus:border-[#D91E18] focus:bg-white focus:outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="price_asc">Price: Low to high</option>
                <option value="price_desc">Price: High to low</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#D91E18] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#b81712] cursor-pointer"
            >
              Search
            </button>

            {(search || location || category !== 'All' || sort !== 'newest') && (
              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters"
                className="flex items-center justify-center rounded-xl border border-stone-200 bg-[#FAF7F2] p-2.5 text-[#6E6259] transition hover:border-[#D91E18] hover:text-[#D91E18] cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </form>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  category === cat
                    ? 'bg-[#18120E] text-white'
                    : 'border border-stone-200 bg-[#FAF7F2] text-[#6E6259] hover:border-stone-300 hover:text-[#18120E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        {loading ? (
          <MenuGridSkeleton count={6} />
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#9A4A12]">
              <Pizza className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl uppercase text-[#18120E]">
              No Matching Pizzas Found
            </h3>
            <p className="mt-1.5 text-sm text-[#6E6259]">
              Try adjusting your search keywords, location filter, or selected category.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-full bg-[#18120E] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#D91E18] cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const premium = isVendorPremium(item.vendorId);
              const vendorName =
                item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen';
              const vendorInitial = vendorName.trim().charAt(0).toUpperCase();
              const coverImage = item.images?.[0] || '/images/cat-classic.jpg';

              return (
                <article
                  key={item._id}
                  onClick={() => handleCardClick(item._id)}
                  className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_12px_30px_-18px_rgba(24,18,14,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9A4A12]/40 hover:shadow-[0_24px_48px_-20px_rgba(24,18,14,0.22)]"
                >
                  {/* 4:3 Image Frame */}
                  <div className="skeleton-shimmer relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={coverImage}
                      alt={item.itemName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/cat-classic.jpg';
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-3.5 top-3.5 rounded-full bg-[#18120E]/80 px-3 py-1 text-[11px] font-semibold text-[#FAF7F2] backdrop-blur-md">
                      {item.category}
                    </span>

                    {premium && (
                      <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1 rounded-full bg-[#9A4A12] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                        <Crown className="h-3 w-3 text-amber-200" />
                        <span>Premium</span>
                      </span>
                    )}
                  </div>

                  {/* Body */}
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

                    <div className="mt-auto pt-5">
                      <div className="mb-4 flex items-center justify-between gap-2 border-t border-stone-100 pt-4 text-xs text-[#6E6259]">
                        <div className="flex min-w-0 items-center gap-2">
                          {item.vendorId?.image ? (
                            <img
                              src={item.vendorId.image}
                              alt={vendorName}
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

                      <div className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#18120E] py-3 text-sm font-bold text-white transition-colors duration-200 group-hover:bg-[#D91E18]">
                        <span>View Details</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function BrowseMenuPage() {
  return (
    <Suspense fallback={<BrowseMenuPageSkeleton />}>
      <BrowseMenuContent />
    </Suspense>
  );
}
