'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Pizza,
  MapPin,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Order Modal & Form State
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [ordering, setOrdering] = useState<boolean>(false);

  // Authentication check: redirect to signin if not logged in (after auth loading finishes)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=/menu/${id}`);
    }
  }, [user, authLoading, router, id]);

  // Fetch Item
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
    return <LoadingSpinner fullScreen message="Loading pizza details..." />;
  }

  if (errorMsg || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-stone-900 dark:text-white">
          Item Not Found
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-sm max-w-md mx-auto">
          {errorMsg || 'The menu item you are looking for does not exist or has been removed.'}
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center px-6 py-2.5 rounded-xl bg-pizza-600 text-white font-semibold text-sm hover:bg-pizza-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Link>
      </div>
    );
  }

  // Permission rules:
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
        toast.success('Order placed successfully! Redirecting to your dashboard...');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back Button */}
      <Link
        href="/menu"
        className="inline-flex items-center space-x-2 text-xs font-bold text-stone-500 hover:text-pizza-600 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Browse Menu</span>
      </Link>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Images Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800 shadow-lg">
            <img
              src={images[activeImageIndex]}
              alt={item.itemName}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white shadow-sm backdrop-blur-sm">
                {item.category}
              </span>
              {item.vendorId?.subscriptionPlan === 'premium' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <span>Premium Kitchen</span>
                </span>
              )}
            </div>
          </div>

          {/* Multiple Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-pizza-500 scale-105 shadow-md'
                      : 'border-stone-200 dark:border-stone-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Order Column */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pizza-600 dark:text-pizza-400">
                  {item.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight mt-1">
                  {item.itemName}
                </h1>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-pizza-600">
                {formatPrice(item.price)}
              </div>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {item.description}
            </p>

            {/* Vendor Profile Card */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-3">
              <div className="flex items-center space-x-3">
                {item.vendorId?.image ? (
                  <img
                    src={item.vendorId.image}
                    alt={item.vendorId.name}
                    className="w-12 h-12 rounded-xl object-cover border border-pizza-300 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-pizza-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {item.vendorId?.name?.charAt(0) || 'V'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                      {item.vendorId?.businessName || item.vendorId?.name}
                    </p>
                    {item.vendorId?.subscriptionPlan === 'premium' && (
                      <span className="text-xs text-amber-500 font-bold" title="Premium Vendor">
                        ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 flex items-center truncate mt-0.5">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-pizza-500 shrink-0" />
                    <span>{item.location}</span>
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 grid grid-cols-2 gap-2 text-[11px] text-stone-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-pizza-500" /> Made to order
                </span>
                <span className="flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1 text-green-500" /> Verified Restaurant
                </span>
              </div>
            </div>
          </div>

          {/* Action Button & Ordering Rules */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            {!isApproved ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                <span>This item is currently under review or inactive and cannot be ordered.</span>
              </div>
            ) : isVendorOfItem ? (
              <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-300 text-stone-600 dark:text-stone-400 text-xs font-semibold flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-pizza-500 shrink-0" />
                <span>You own this item. Vendors cannot place orders for their own kitchen.</span>
              </div>
            ) : isAdmin ? (
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 shrink-0" />
                <span>Administrator accounts cannot place customer food orders.</span>
              </div>
            ) : isCustomer ? (
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl text-white font-bold bg-gradient-to-r from-pizza-600 to-pizza-500 hover:from-pizza-700 hover:to-pizza-600 shadow-xl shadow-pizza-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-base cursor-pointer"
              >
                <Pizza className="w-5 h-5" />
                <span>Order Now ({formatPrice(item.price)})</span>
              </button>
            ) : (
              <button
                onClick={() => router.push(`/signin?redirect=/menu/${item._id}`)}
                className="w-full py-4 px-6 rounded-2xl bg-pizza-600 text-white font-bold text-center hover:bg-pizza-700 transition-colors"
              >
                Sign In to Place Order
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Order Submission Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-stone-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-stone-900 dark:text-white">
                  Place Pizza Order
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {item.itemName} — {formatPrice(item.price)}
                </p>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Delivery Date & Time *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Delivery Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="House / Apartment #, Street Name, City"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                  Special Kitchen Message / Instructions (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-stone-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="e.g. Extra crispy crust, please do not ring doorbell..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pizza-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-pizza-50/70 dark:bg-stone-800 text-xs text-pizza-800 dark:text-pizza-300 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 shrink-0 text-pizza-600" />
                <span>
                  Cash on Delivery or In-Person payment upon receipt. No online card required for customer orders!
                </span>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-stone-300 dark:border-stone-700 font-semibold text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ordering}
                  className="flex-1 py-3 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md shadow-pizza-500/20 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  {ordering ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm Order</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
