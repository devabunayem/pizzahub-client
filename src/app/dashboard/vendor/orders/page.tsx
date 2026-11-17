'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Calendar,
  MapPin,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  User,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { OrderListSkeleton } from '@/components/ui/Skeleton';
import { toast } from '@/lib/toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VendorOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch vendor orders:', err);
      toast.error('Failed to load incoming orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleUpdateStatus = async (orderId: string, status: 'accepted' | 'rejected') => {
    const toastId = toast.loading(`Marking order as ${status}...`);

    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Order #${orderId.slice(-6)} has been ${status}!`, { id: toastId });
        fetchOrders();
      } else {
        toast.error(data.message || 'Failed to update order status.', { id: toastId });
      }
    } catch (err) {
      toast.error('Network error updating order.', { id: toastId });
    }
  };

  if (loading) {
    return <OrderListSkeleton count={4} />;
  }

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Incoming orders
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Review incoming orders, verify scheduled delivery times, and update status.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 self-start sm:self-auto">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors cursor-pointer ${
                filter === tab
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-sm border border-stone-200 dark:border-stone-700'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
          <div className="w-10 h-10 mx-auto rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            No {filter !== 'all' ? filter : ''} orders
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {filter === 'pending'
              ? 'All incoming customer orders have been reviewed.'
              : 'Orders placed by customers will appear in this list.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors"
            >
              {/* Order Info Left */}
              <div className="flex items-start space-x-4 min-w-0">
                <img
                  src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                  alt={order.itemId?.itemName}
                  className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800"
                />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-baseline space-x-3">
                    <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                      {order.itemId?.itemName || 'Pizza order'}
                    </h3>
                    <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-100 tabular-nums">
                      {formatPrice(order.itemId?.price || 0)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
                    <span className="flex items-center text-stone-700 dark:text-stone-300">
                      <User className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      {order.customerId?.name} ({order.customerId?.email})
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      Delivery: <span className="ml-1 font-medium text-stone-800 dark:text-stone-200">{formatDate(order.deliveryDate)}</span>
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 flex items-start">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400 shrink-0 mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </p>

                  {order.message && (
                    <div className="mt-1 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300 flex items-start space-x-2">
                      <MessageSquare className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>Note: &ldquo;{order.message}&rdquo;</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Actions Right */}
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

                {order.status === 'pending' ? (
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'accepted')}
                      className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 text-stone-700 dark:text-stone-300 font-medium text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-stone-400">
                    Decision recorded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
