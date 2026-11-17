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
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

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
    return <LoadingSpinner message="Retrieving incoming orders..." />;
  }

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
            Customer Orders
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Review incoming orders, verify delivery schedules, and accept or reject requests.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1.5 p-1 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 self-start sm:self-auto">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-pizza-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-pizza-50 dark:bg-pizza-950/60 text-pizza-500 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">
            No {filter !== 'all' ? filter : ''} orders found
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-xs">
            {filter === 'pending'
              ? 'All incoming orders have been reviewed!'
              : 'Orders placed by customers will be displayed here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Order Info Left */}
              <div className="flex items-start space-x-4">
                <img
                  src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                  alt={order.itemId?.itemName}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {order.itemId?.itemName || 'Gourmet Pizza'}
                    </h3>
                    <span className="font-extrabold text-pizza-600 text-sm">
                      {formatPrice(order.itemId?.price || 0)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
                    <span className="flex items-center font-medium text-stone-700 dark:text-stone-300">
                      <User className="w-3.5 h-3.5 mr-1 text-pizza-500" />
                      {order.customerId?.name} ({order.customerId?.email})
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-pizza-500" />
                      Delivery Date: <strong>{formatDate(order.deliveryDate)}</strong>
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 flex items-start pt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-pizza-500 shrink-0 mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </p>

                  {order.message && (
                    <div className="mt-2 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 flex items-start space-x-2">
                      <MessageSquare className="w-3.5 h-3.5 text-pizza-500 shrink-0 mt-0.5" />
                      <span>Special Note: &ldquo;{order.message}&rdquo;</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Actions Right */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800">
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'pending'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      : order.status === 'accepted'
                      ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300'
                      : order.status === 'rejected'
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                      : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                  }`}
                >
                  {order.status}
                </span>

                {order.status === 'pending' ? (
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'accepted')}
                      className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept Order</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'rejected')}
                      className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-stone-700 dark:text-stone-300 font-bold text-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-stone-400 italic">
                    Decision finalized ({order.status})
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
