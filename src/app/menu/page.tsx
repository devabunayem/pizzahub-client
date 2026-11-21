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
  Flame,
  ArrowRight,
  Sparkles,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      {/* Page Title: Monumental Header */}
      <div className="border-b-2 border-stone-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-red-500 mb-2">
            <Flame className="w-4 h-4 animate-pulse" />
            <span>Direct Kitchen Catalogs</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-stone-900 dark:text-white">
            THE OVEN ROSTER
          </h1>
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mt-2 max-w-xl">
            Explore authentic wood-fired pizzas, gourmet sides, and appetizers crafted by independent neighborhood pizzerias.
          </p>
        </div>

        {/* Total Count Badge */}
        <div className="px-5 py-3 rounded-2xl bg-stone-900 border-2 border-stone-800 text-white flex items-center space-x-3 self-start md:self-auto">
          <div className="text-2xl font-black text-red-500 tabular-nums">{items.length}</div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Active<br />Recipes
          </div>
        </div>
      </div>

      {/* Search & Control Console */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0e0e10] border-2 border-stone-200 dark:border-stone-800 space-y-5 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Term */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pizza name, crust or toppings..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white placeholder:text-stone-500 text-xs sm:text-sm font-medium focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Location Filter */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Filter by city/area..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white placeholder:text-stone-500 text-xs sm:text-sm font-medium focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-2 relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-3 rounded-xl border-2 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white text-xs sm:text-sm font-bold focus:border-red-500 focus:outline-none transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/20"
            >
              Search
            </button>
            {(search || location || category !== 'All' || sort !== 'newest') && (
              <button
                type="button"
                onClick={resetFilters}
                title="Reset All Filters"
                className="p-3 rounded-xl border-2 border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                category === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-800'
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
        <div className="text-center py-20 bg-stone-900/40 rounded-3xl border-2 border-stone-800 space-y-4">
          <p className="text-lg font-black uppercase tracking-tight text-white">
            No matching pizzas found
          </p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto font-medium">
            Try adjusting your search keywords, clearing your location filter, or selecting a different category.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-500 pb-2 border-b border-stone-800">
            <span>Showing {items.length} Oven-Fired Recipes</span>
            <span>
              {sort === 'price_asc'
                ? 'Sorted by Lowest Price'
                : sort === 'price_desc'
                ? 'Sorted by Highest Price'
                : 'Sorted by Fresh Additions'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => handleCardClick(item._id)}
                className="group cursor-pointer flex flex-col bg-white dark:bg-[#101012] rounded-2xl overflow-hidden border-2 border-stone-200 dark:border-stone-800 transition-all duration-300 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
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

                  {/* Bold Price Stamp */}
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

                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-red-600 dark:bg-stone-800 dark:hover:bg-red-600 text-stone-900 dark:text-white hover:text-white font-black text-xs tracking-wider uppercase text-center block transition-all"
                    >
                      Order this slice →
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
