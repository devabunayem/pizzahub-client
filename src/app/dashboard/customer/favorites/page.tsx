'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Crown, ArrowUpRight, Star, Flame } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { formatPrice } from '@/lib/utils';
import { MenuGridSkeleton } from '@/components/ui/Skeleton';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function isVendorPremium(vendor: any): boolean {
  if (!vendor || vendor.subscriptionPlan !== 'premium') return false;
  if (!vendor.subscriptionExpiresAt) return true;
  return new Date(vendor.subscriptionExpiresAt) > new Date();
}

export default function CustomerFavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const fetchApprovedMenu = async () => {
      try {
        const res = await fetch(`${API_BASE}/menu?limit=100`);
        const data = await res.json();
        if (active && data.success) {
          setItems(data.items || []);
        }
      } catch (err) {
        console.error('Failed to load favorite pizzas:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchApprovedMenu();
    return () => {
      active = false;
    };
  }, []);

  const favoriteItems = items.filter((item) => favoriteIds.includes(item._id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-stone-200/80 pb-5 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
            <Heart className="h-3.5 w-3.5 fill-[#E50916] text-[#E50916]" />
            <span>Saved Cravings</span>
          </span>
          <h1 className="font-display mt-1 text-3xl uppercase tracking-tight text-[#18120E]">
            My Favorite Pizzas
          </h1>
          <p className="mt-1 text-sm text-[#6E6259]">
            Your hand-picked brick-oven selections ready to order anytime.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-bold text-[#18120E] tabular-nums shadow-sm sm:self-auto">
          <Heart className="h-3.5 w-3.5 fill-[#E50916] text-[#E50916]" />
          <span>{favoriteItems.length} saved</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <MenuGridSkeleton count={3} />
      ) : favoriteItems.length === 0 ? (
        <div className="rounded-3xl border border-stone-200/90 bg-white px-6 py-16 text-center shadow-[0_14px_34px_-22px_rgba(24,18,14,0.12)]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#E50916]">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl uppercase text-[#18120E]">
            No Saved Favorites Yet
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-[#6E6259]">
            Tap the heart icon on any pizza across the Home showcase or Browse Menu to keep your go-to pies one click away.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D91E18] px-6 py-2.5 text-xs font-bold text-white shadow-[0_12px_26px_-10px_rgba(217,30,24,0.5)] transition hover:bg-[#b81712]"
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Explore Pizza Menu</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteItems.map((item) => {
            const premium = isVendorPremium(item.vendorId);
            const vendorName =
              item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen';
            const vendorInitial = vendorName.trim().charAt(0).toUpperCase();
            const coverImage = item.images?.[0] || '/images/cat-classic.jpg';

            return (
              <article
                key={item._id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_12px_30px_-18px_rgba(24,18,14,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-[#9A4A12]/40 hover:shadow-[0_24px_48px_-20px_rgba(24,18,14,0.22)]"
              >
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

                  <div className="absolute right-3.5 top-3.5 flex items-center gap-1.5">
                    {premium && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#9A4A12] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                        <Crown className="h-3 w-3 text-amber-200" />
                        <span>Premium</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item._id, item.itemName)}
                      aria-label="Remove from favorites"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#E50916] shadow-sm transition hover:bg-rose-50 cursor-pointer"
                    >
                      <Heart className="h-4 w-4 fill-[#E50916]" />
                    </button>
                  </div>

                  {item.reviewCount > 0 && (
                    <span className="absolute bottom-3 left-3.5 inline-flex items-center gap-1 rounded-full bg-[#18120E]/80 px-2.5 py-0.5 text-[11px] font-bold text-[#FAF7F2] backdrop-blur-md tabular-nums">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{Number(item.averageRating || 0).toFixed(1)}</span>
                      <span className="text-stone-300">({item.reviewCount})</span>
                    </span>
                  )}
                </div>

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

                    <Link
                      href={`/menu/${item._id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#18120E] py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#D91E18]"
                    >
                      <span>Order Now</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
