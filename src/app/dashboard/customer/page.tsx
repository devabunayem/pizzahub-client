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
  Sparkles,
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
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pizza-600 via-pizza-500 to-orange-500 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Pizza Lover Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hi, {user?.name}! 👋
          </h1>
          <p className="text-sm text-pizza-100 max-w-xl">
            Track your artisanal pizza orders in real time, view scheduled delivery dates, and explore
            new woodfired kitchens.
          </p>
        </div>

        <Link
          href="/menu"
          className="px-6 py-3.5 rounded-2xl bg-white text-pizza-600 hover:bg-pizza-50 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Pizza className="w-4 h-4" />
          <span>Explore Fresh Pizzas</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-pizza-100 dark:bg-pizza-950/60 text-pizza-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white">
            {totalOrders}
          </div>
          <p className="text-xs text-stone-500">All-time cravings satisfied</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600">
            {pendingOrders}
          </div>
          <p className="text-xs text-stone-500">Under restaurant review</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Accepted Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/60 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-green-600">
            {acceptedOrders}
          </div>
          <p className="text-xs text-stone-500">Confirmed by the kitchen</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Rejected / Cancelled
            </span>
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white">
            {rejectedOrders}
          </div>
          <p className="text-xs text-stone-500">Archived past requests</p>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              Recent Pizza Orders
            </h3>
            <p className="text-xs text-stone-500">
              Track recent submissions and view active statuses
            </p>
          </div>
          <Link
            href="/dashboard/customer/orders"
            className="text-xs font-bold text-pizza-600 hover:text-pizza-700 flex items-center space-x-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            You haven&apos;t placed any pizza orders yet.{' '}
            <Link href="/menu" className="font-bold text-pizza-600 hover:underline">
              Browse the menu
            </Link>{' '}
            to get started!
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <img
                    src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                    alt={order.itemId?.itemName}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-white">
                      {order.itemId?.itemName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Restaurant: {order.vendorId?.businessName || order.vendorId?.name} •{' '}
                      {formatPrice(order.itemId?.price || 0)}
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Delivery for: {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      order.status === 'pending'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : order.status === 'accepted'
                        ? 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300'
                        : order.status === 'rejected'
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {order.status}
                  </span>
                  <Link
                    href="/dashboard/customer/orders"
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800"
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
