'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  ArrowLeft,
  AlertCircle,
  Crown,
  X,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { ItemDetailSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [ordering, setOrdering] = useState<boolean>(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=/menu/${id}`);
    }
  }, [user, authLoading, router, id]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`${API_BASE}/menu/${id}`);
        const data = await res.json();
        if (data.success && data.item) {
          setItem(data.item);
        } else {
          setErrorMsg(data.message || 'Menu item not found.');
        }
      } catch (err: any) {
        setErrorMsg('Failed to load menu item details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  if (authLoading || (loading && !errorMsg)) {
    return (
      <div className="min-h-[80vh] bg-[#FAF7F2]">
        <ItemDetailSkeleton />
      </div>
    );
  }

  if (errorMsg || !item) {
    return (
      <div className="min-h-[80vh] bg-[#FAF7F2] py-16">
        <div className="site-container">
          <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-[0_18px_40px_-20px_rgba(24,18,14,0.16)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#D91E18]">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl uppercase text-[#18120E]">
              Item Not Found
            </h2>
            <p className="text-sm text-[#6E6259]">
              {errorMsg || 'The menu item you are looking for does not exist or has been removed.'}
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-[#18120E] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#D91E18]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Browse Menu</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isVendorOfItem = user?._id === item.vendorId?._id;
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';
  const isApproved = item.status === 'approved';
  const isPremiumVendor =
    item.vendorId?.subscriptionPlan === 'premium' &&
    (!item.vendorId?.subscriptionExpiresAt ||
      new Date(item.vendorId.subscriptionExpiresAt) > new Date());

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDate || !deliveryAddress) {
      toast.error('Please specify both delivery date and delivery address.');
      return;
    }

    setOrdering(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemId: item._id,
          deliveryDate,
          deliveryAddress,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to place order.');
      } else {
        toast.success('Order placed successfully.');
        setOrderModalOpen(false);
        router.push('/dashboard/customer');
      }
    } catch (err) {
      toast.error('Network error. Unable to place order.');
    } finally {
      setOrdering(false);
    }
  };

  const images =
    item.images && item.images.length > 0
      ? item.images
      : ['/images/cat-classic.jpg'];

  const vendorName = item.vendorId?.businessName || item.vendorId?.name || 'Local Kitchen';

  return (
    <section className="min-h-[82vh] bg-[#FAF7F2] py-10 md:py-14">
      <div className="site-container space-y-8">
        {/* Back Link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Browse Menu</span>
        </Link>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Left Gallery */}
          <div className="space-y-3.5 lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_24px_48px_-22px_rgba(24,18,14,0.2)]">
              <img
                src={images[activeImageIndex]}
                alt={item.itemName}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[#18120E]/85 px-3.5 py-1.5 text-xs font-semibold text-[#FAF7F2] backdrop-blur-md">
                {item.category}
              </span>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#D91E18] shadow-sm'
                        : 'border-stone-200 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`view-${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Editorial Info Card */}
          <div className="lg:col-span-5">
            <div className="space-y-6 rounded-3xl border border-stone-200/90 bg-white p-7 sm:p-8 shadow-[0_20px_48px_-22px_rgba(24,18,14,0.14)]">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
                  <Flame className="h-3.5 w-3.5 text-[#D91E18]" />
                  <span>{item.category}</span>
                </div>

                <h1 className="font-display text-[clamp(2rem,3.4vw,2.75rem)] uppercase leading-[0.98] tracking-tight text-[#18120E]">
                  {item.itemName}
                </h1>

                <div className="font-display text-3xl tracking-wide text-[#D91E18] tabular-nums">
                  {formatPrice(item.price)}
                </div>

                <p className="pt-1 text-sm leading-relaxed text-[#6E6259]">
                  {item.description}
                </p>
              </div>

              {/* Kitchen Card */}
              <div className="space-y-2.5 rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-[#18120E]">
                    {vendorName}
                  </span>
                  {isPremiumVendor && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#9A4A12] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                      <Crown className="h-3 w-3 text-amber-200" />
                      <span>Premium</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs font-medium text-[#6E6259]">
                  <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-[#D91E18]" />
                  <span>{item.location}</span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="pt-1">
                {!isApproved ? (
                  <div className="rounded-2xl border border-stone-200 bg-[#FAF7F2] p-4 text-xs font-medium text-[#6E6259]">
                    This item is currently under admin review or inactive.
                  </div>
                ) : isVendorOfItem ? (
                  <div className="rounded-2xl border border-stone-200 bg-[#FAF7F2] p-4 text-xs font-medium text-[#6E6259]">
                    You own this listing. Restaurant kitchens cannot order their own items.
                  </div>
                ) : isAdmin ? (
                  <div className="rounded-2xl border border-stone-200 bg-[#FAF7F2] p-4 text-xs font-medium text-[#6E6259]">
                    Administrator accounts cannot place customer food orders.
                  </div>
                ) : isCustomer ? (
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D91E18] py-4 text-sm font-bold text-white shadow-[0_16px_32px_-12px_rgba(217,30,24,0.5)] transition hover:bg-[#b81712] cursor-pointer"
                  >
                    <span>Order Now — {formatPrice(item.price)}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push(`/signin?redirect=/menu/${item._id}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#18120E] py-4 text-sm font-bold text-white transition hover:bg-[#D91E18] cursor-pointer"
                  >
                    <span>Sign In to Place Order</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18120E]/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7 shadow-[0_28px_60px_-20px_rgba(24,18,14,0.3)]">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-[#18120E]">
                  Place Your Order
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[#6E6259]">
                  {item.itemName} —{' '}
                  <span className="font-bold text-[#D91E18]">{formatPrice(item.price)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="rounded-xl p-1.5 text-stone-400 transition hover:bg-[#FAF7F2] hover:text-[#18120E] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Delivery date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] focus:border-[#D91E18] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Delivery address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street address, apartment or house number"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#6E6259]">
                  Special kitchen instructions (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Extra basil, well-done crust..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF7F2] px-3.5 py-2.5 text-sm text-[#18120E] placeholder:text-stone-400 focus:border-[#D91E18] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="rounded-2xl border border-stone-200/80 bg-[#FAF7F2] p-3.5 text-xs text-[#6E6259]">
                Payment is settled upon delivery directly with the restaurant kitchen.
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="flex-1 rounded-xl border border-stone-200 bg-[#FAF7F2] py-3 text-xs font-bold text-[#18120E] transition hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ordering}
                  className="flex-1 rounded-xl bg-[#D91E18] py-3 text-xs font-bold text-white transition hover:bg-[#b81712] disabled:opacity-50 cursor-pointer"
                >
                  {ordering ? 'Placing order...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
