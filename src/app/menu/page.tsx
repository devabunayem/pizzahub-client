'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  RotateCcw,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { MenuGridSkeleton } from '@/components/ui/Skeleton';

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

export default function BrowseMenuPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('All');
  const [location, setLocation] = useState<string>('');
  const [sort, setSort] = useState<string>('newest');

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-white tracking-tight">
          Browse menu
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Explore pizzas, gourmet sides, and appetizers from local kitchens.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#19191b] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pizza name..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white text-xs focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 absolute inset-y-0 left-3 my-auto text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or area..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white text-xs focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="md:col-span-2 relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div className="md:col-span-2 flex space-x-1.5">
            <button
              type="submit"
              className="flex-1 py-2 px-3 rounded-lg bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition-colors cursor-pointer"
            >
              Search
            </button>
            {(search || location || category !== 'All' || sort !== 'newest') && (
              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters"
                className="p-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] hover:bg-stone-100 dark:hover:bg-white/[0.05] text-stone-500"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs transition-colors whitespace-nowrap cursor-pointer ${
                category === cat
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium'
                  : 'bg-stone-100 dark:bg-white/[0.04] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <MenuGridSkeleton count={8} />
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#19191b] rounded-xl border border-black/[0.06] dark:border-white/[0.08] space-y-3">
          <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
            No matching pizzas found
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing your location filter, or selecting a different category.
          </p>
          <button
            onClick={resetFilters}
            className="px-3.5 py-1.5 rounded-lg border border-black/[0.1] dark:border-white/[0.1] text-xs font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{items.length} items available</span>
            <span>
              {sort === 'price_asc'
                ? 'Price: Low to High'
                : sort === 'price_desc'
                ? 'Price: High to Low'
                : 'Newest first'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col bg-white dark:bg-[#19191b] rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.08] transition-colors hover:border-black/[0.15] dark:hover:border-white/[0.15]"
              >
                <div className="relative h-44 w-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/90 dark:bg-[#19191b]/90 text-stone-800 dark:text-stone-200 backdrop-blur-sm border border-black/[0.04] dark:border-white/[0.08]">
                      {item.category}
                    </span>
                    {item.vendorId?.subscriptionPlan === 'premium' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm text-stone-900 dark:text-white line-clamp-1">
                        {item.itemName}
                      </h3>
                      <span className="font-semibold text-sm tabular-nums text-stone-900 dark:text-white shrink-0">
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

                    <button
                      onClick={() => handleCardClick(item._id)}
                      className="w-full py-2 rounded-lg bg-stone-100 dark:bg-white/[0.05] hover:bg-stone-200 dark:hover:bg-white/[0.08] text-stone-900 dark:text-stone-100 font-medium text-xs text-center block transition-colors cursor-pointer"
                    >
                      View details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
