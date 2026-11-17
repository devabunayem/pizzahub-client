'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Pizza,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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
  const [sort, setSort] = useState<string>('newest'); // 'newest' | 'price_asc' | 'price_desc'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pizza-100 dark:bg-pizza-950/60 text-pizza-700 dark:text-pizza-300 text-xs font-bold uppercase tracking-wider">
          <Pizza className="w-3.5 h-3.5 text-pizza-600" />
          <span>Full Culinary Collection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
          Browse Pizza Menu
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl">
          Discover all chef-crafted pizzas, gourmet sides, and appetizers. Filter by flavor,
          location, or sort by price.
        </p>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pizza name or ingredients..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>

          {/* Location Filter */}
          <div className="md:col-span-3 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Filter by city/area..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
            />
          </div>

          {/* Price Sorting (Challenge Requirement) */}
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2 flex space-x-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-sm shadow-md shadow-pizza-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            {(search || location || category !== 'All' || sort !== 'newest') && (
              <button
                type="button"
                onClick={resetFilters}
                title="Reset filters"
                className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 mr-1" /> Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                category === cat
                  ? 'bg-pizza-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <LoadingSpinner message="Searching our pizza ovens..." />
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-pizza-50 dark:bg-pizza-950/60 flex items-center justify-center text-pizza-500">
            <Pizza className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 dark:text-white">
            No matching pizzas found
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
            Try adjusting your search keywords, clearing your location filter, or choosing a different category.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-pizza-600 hover:text-white font-semibold text-xs transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <span>Showing {items.length} approved delicacies</span>
            <span>Sorted by: {sort === 'price_asc' ? 'Price (Low to High)' : sort === 'price_desc' ? 'Price (High to Low)' : 'Newest'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-pizza-300 dark:hover:border-pizza-800 transition-all duration-300"
              >
                {/* Image Container with uniform height */}
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

                    <button
                      onClick={() => handleCardClick(item._id)}
                      className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-pizza-600 hover:text-white dark:hover:bg-pizza-600 dark:hover:text-white text-stone-900 dark:text-stone-100 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>View Details & Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
