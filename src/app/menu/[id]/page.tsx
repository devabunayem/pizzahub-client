'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Calendar,
  MessageSquare,
  ArrowLeft,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
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

  // Order Modal State
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
    return <ItemDetailSkeleton />;
  }

  if (errorMsg || !item) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-8 h-8 mx-auto text-stone-400" />
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
          Item not found
        </h2>
        <p className="text-stone-500 text-xs">
          {errorMsg || 'The menu item you are looking for does not exist or has been removed.'}
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to menu
        </Link>
      </div>
    );
  }

  const isVendorOfItem = user?._id === item.vendorId?._id;
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';
  const isApproved = item.status === 'approved';

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

  const images = item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/menu"
        className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Browse menu</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Images */}
        <div className="lg:col-span-7 space-y-3">
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-black/[0.06] dark:border-white/[0.08]">
            <img
              src={images[activeImageIndex]}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-1">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border transition-colors shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-stone-900 dark:border-white'
                      : 'border-black/[0.06] dark:border-white/[0.08] opacity-60'
                  }`}
                >
                  <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-medium">
                {item.category}
              </span>
              <h1 className="text-2xl font-semibold text-stone-900 dark:text-white tracking-tight">
                {item.itemName}
              </h1>
            </div>

            <div className="text-2xl font-semibold tabular-nums text-stone-900 dark:text-white">
              {formatPrice(item.price)}
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed pt-1">
              {item.description}
            </p>
          </div>

          {/* Kitchen details */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#19191b] border border-black/[0.06] dark:border-white/[0.08] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-stone-900 dark:text-white">
                {item.vendorId?.businessName || item.vendorId?.name}
              </span>
              {item.vendorId?.subscriptionPlan === 'premium' && (
                <span className="text-[11px] font-medium text-stone-600 dark:text-stone-400 bg-black/[0.04] dark:bg-white/[0.06] px-2 py-0.5 rounded">
                  Premium kitchen
                </span>
              )}
            </div>
            <div className="flex items-center text-stone-500">
              <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400 shrink-0" />
              <span>{item.location}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            {!isApproved ? (
              <div className="p-3 rounded-lg bg-stone-100 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-xs text-stone-500">
                This item is currently under review or inactive.
              </div>
            ) : isVendorOfItem ? (
              <div className="p-3 rounded-lg bg-stone-100 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-xs text-stone-500">
                You own this listing. Vendors cannot order their own items.
              </div>
            ) : isAdmin ? (
              <div className="p-3 rounded-lg bg-stone-100 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] text-xs text-stone-500">
                Administrator accounts cannot place customer food orders.
              </div>
            ) : isCustomer ? (
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full py-3 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Order for {formatPrice(item.price)}
              </button>
            ) : (
              <button
                onClick={() => router.push(`/signin?redirect=/menu/${item._id}`)}
                className="w-full py-3 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium text-xs text-center"
              >
                Sign in to place order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#19191b] max-w-md w-full rounded-2xl p-6 shadow-xl border border-black/[0.06] dark:border-white/[0.08] space-y-5">
            <div className="flex items-start justify-between border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-white">
                  Place order
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {item.itemName} — {formatPrice(item.price)}
                </p>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm font-medium"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Delivery date *
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Delivery address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street address, apartment or house number"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Special kitchen instructions (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Extra basil, well-done crust..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-black/[0.08] dark:border-white/[0.08] bg-stone-50 dark:bg-[#232325] text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-stone-100 dark:bg-white/[0.04] text-stone-600 dark:text-stone-400">
                Payment is settled upon delivery directly with the restaurant.
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] font-medium text-stone-600 dark:text-stone-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ordering}
                  className="flex-1 py-2.5 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white font-medium disabled:opacity-50"
                >
                  {ordering ? 'Placing order...' : 'Confirm order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
