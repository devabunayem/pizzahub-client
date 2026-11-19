'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Pizza,
  ArrowRight,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CustomerOverviewPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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
        console.error('Failed to fetch customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner message="Loading your order history..." />;
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;
  const rejectedOrders = orders.filter((o) => o.status === 'rejected' || o.status === 'cancelled').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Order overview
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            Track active requests, review scheduled delivery dates, and explore the menu.
          </p>
        </div>

        <Link
          href="/menu"
          className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition-colors flex items-center space-x-2 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Pizza className="w-3.5 h-3.5" />
          <span>Browse menu</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Total orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
            {totalOrders}
          </div>
          <p className="text-xs text-stone-500">All-time order count</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Pending review
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-amber-700 dark:text-amber-400 font-mono tabular-nums">
            {pendingOrders}
          </div>
          <p className="text-xs text-stone-500">Awaiting vendor response</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Accepted
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
            {acceptedOrders}
          </div>
          <p className="text-xs text-stone-500">Confirmed by kitchen</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              Rejected / Cancelled
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-semibold text-stone-700 dark:text-stone-300 font-mono tabular-nums">
            {rejectedOrders}
          </div>
          <p className="text-xs text-stone-500">Archived records</p>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              Recent orders
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Review current submissions and delivery timeline
            </p>
          </div>
          <Link
            href="/dashboard/customer/orders"
            className="text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 text-stone-500 text-xs">
            No orders placed yet.{' '}
            <Link href="/menu" className="font-medium text-stone-900 dark:text-stone-100 underline underline-offset-2">
              Browse menu
            </Link>{' '}
            to get started.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                    alt={order.itemId?.itemName}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800"
                  />
                  <div>
                    <h4 className="font-medium text-xs text-stone-900 dark:text-stone-100">
                      {order.itemId?.itemName}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      {order.vendorId?.businessName || order.vendorId?.name} •{' '}
                      <span className="font-mono tabular-nums">{formatPrice(order.itemId?.price || 0)}</span>
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Delivery: {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
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
                  <Link
                    href="/dashboard/customer/orders"
                    className="px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700 text-[11px] font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
