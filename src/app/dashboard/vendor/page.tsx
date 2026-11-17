'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VendorOverviewPage() {
  const { user, token } = useAuth();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [menuRes, ordersRes] = await Promise.all([
          fetch(`${API_BASE}/menu/vendor/my-items`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/orders/vendor`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const menuData = await menuRes.json();
        const ordersData = await ordersRes.json();

        if (menuData.success) setMenuItems(menuData.items || []);
        if (ordersData.success) setOrders(ordersData.orders || []);
      } catch (err) {
        console.error('Failed to fetch vendor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return <LoadingSpinner message="Loading your restaurant metrics..." />;
  }

  const totalMenuItems = menuItems.length;
  const activeMenuItems = menuItems.filter((i) => i.status === 'approved').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;
  const isPremium = user?.subscriptionPlan === 'premium';

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pizza-600 via-pizza-500 to-orange-500 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              {user?.businessName || "Chef's Kitchen"}
            </span>
            {isPremium ? (
              <span className="text-xs font-black bg-amber-400 text-stone-900 px-3 py-1 rounded-full flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Premium Partner
              </span>
            ) : (
              <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full">
                Free Plan (3 Items Limit)
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.name}!
          </h1>
          <p className="text-sm text-pizza-100 max-w-xl">
            Monitor incoming pizza orders, publish seasonal specialties, and track your kitchen
            performance in real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/vendor/add-item"
            className="px-5 py-3 rounded-2xl bg-white text-pizza-600 hover:bg-pizza-50 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Menu Item</span>
          </Link>
          {!isPremium && (
            <Link
              href="/dashboard/vendor/subscription"
              className="px-5 py-3 rounded-2xl bg-stone-900/40 hover:bg-stone-900/60 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Upgrade Plan</span>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Menu Items
            </span>
            <div className="w-10 h-10 rounded-xl bg-pizza-100 dark:bg-pizza-950/60 text-pizza-600 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white">
            {totalMenuItems}
          </div>
          <p className="text-xs text-stone-500">
            {isPremium ? 'Unlimited capacity enabled' : `${activeMenuItems} / 3 active allowed`}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Active Items (Approved)
            </span>
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/60 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white">
            {activeMenuItems}
          </div>
          <p className="text-xs text-stone-500">Visible to hungry customers</p>
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
          <p className="text-xs text-stone-500">Awaiting kitchen confirmation</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Accepted Orders
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-white">
            {acceptedOrders}
          </div>
          <p className="text-xs text-stone-500">Successfully handled</p>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-stone-500">
              Orders requiring your immediate culinary attention
            </p>
          </div>
          <Link
            href="/dashboard/vendor/orders"
            className="text-xs font-bold text-pizza-600 hover:text-pizza-700 flex items-center space-x-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            No customer orders placed yet. As soon as a customer orders your pizza, it will appear here.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0">
                    <img
                      src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                      alt={order.itemId?.itemName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-stone-900 dark:text-white">
                      {order.itemId?.itemName || 'Delicious Pizza'}
                    </p>
                    <p className="text-xs text-stone-500">
                      Customer: {order.customerId?.name} ({order.deliveryAddress})
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
                    href="/dashboard/vendor/orders"
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800"
                  >
                    Manage
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
