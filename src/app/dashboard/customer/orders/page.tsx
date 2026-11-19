'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  MessageSquare,
  Clock,
  XCircle,
  Pizza,
  CheckCircle2,
  Store,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusTimeline } from '@/components/ui/StatusTimeline';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CustomerOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this pending pizza order?')) return;

    const toastId = toast.loading('Cancelling order...');
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Order has been cancelled.', { id: toastId });
        fetchOrders();
      } else {
        toast.error(data.message || 'Failed to cancel order.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error cancelling order.', { id: toastId });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving your orders..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            My orders
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Track order preparation, delivery progress, or cancel pending requests.
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Pizza className="w-3.5 h-3.5" />
          <span>Browse menu</span>
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="w-10 h-10 mx-auto rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">No orders placed</h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs max-w-sm mx-auto">
            You haven&apos;t placed any pizza orders yet. Explore our menu to order fresh, handmade pizza.
          </p>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium text-xs"
            >
              <span>Explore menu</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;

            return (
              <div
                key={order._id}
                className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left Info */}
                  <div className="flex items-start space-x-4 min-w-0">
                    <img
                      src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                      alt={order.itemId?.itemName}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-baseline space-x-3">
                        <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                          {order.itemId?.itemName || 'Artisanal Pizza'}
                        </h3>
                        <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                          {formatPrice(order.itemId?.price || 0)}
                        </span>
                      </div>

                      <p className="text-xs text-stone-500 flex items-center">
                        <Store className="w-3.5 h-3.5 mr-1 text-stone-400" />
                        <span>{order.vendorId?.businessName || order.vendorId?.name}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400 pt-0.5">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
                          Delivery: <span className="ml-1 font-medium text-stone-800 dark:text-stone-200">{formatDate(order.deliveryDate)}</span>
                        </span>
                        <span className="flex items-center text-stone-400">
                          Placed: {formatDate(order.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 flex items-start pt-0.5">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400 shrink-0 mt-0.5" />
                        <span>{order.deliveryAddress}</span>
                      </p>

                      {order.message && (
                        <p className="text-xs text-stone-500 dark:text-stone-400 italic pt-0.5">
                          Note: &ldquo;{order.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Status & Action */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                        order.status === 'pending'
                          ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
                          : order.status === 'accepted'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                          : order.status === 'rejected'
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                          : 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/40'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'pending'
                            ? 'bg-amber-500'
                            : order.status === 'accepted'
                            ? 'bg-emerald-500'
                            : 'bg-stone-400'
                        }`}
                      />
                      <span className="capitalize">{order.status}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : order._id)
                        }
                        className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide timeline' : 'Track progress'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-red-700 dark:text-red-300 font-medium text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Timeline Expansion */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-stone-200 dark:border-stone-800 space-y-3">
                    <h4 className="text-xs font-medium text-stone-500 dark:text-stone-400">
                      Order progress timeline
                    </h4>
                    <StatusTimeline status={order.status} deliveryDate={order.deliveryDate} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
