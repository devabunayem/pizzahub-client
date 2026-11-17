'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DashboardOverviewSkeleton } from '@/components/ui/Skeleton';

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
    return <DashboardOverviewSkeleton />;
  }

  const totalMenuItems = menuItems.length;
  const activeMenuItems = menuItems.filter((i) => i.status === 'approved').length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;
  const isPremium = user?.subscriptionPlan === 'premium';

  return (
    <div className="space-y-8">
      {/* Contextual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="flex items-center space-x-2 text-xs text-stone-500">
            <span>{user?.businessName || 'Kitchen workspace'}</span>
            <span>•</span>
            <span>{isPremium ? 'Premium plan' : 'Free tier'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 dark:text-white tracking-tight mt-1">
            Kitchen overview
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/dashboard/vendor/add-item"
            className="px-3 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add menu item</span>
          </Link>
          {!isPremium && (
            <Link
              href="/dashboard/vendor/subscription"
              className="px-3 py-2 rounded-lg border border-black/[0.1] dark:border-white/[0.1] hover:bg-stone-100 dark:hover:bg-white/[0.04] text-xs font-medium text-stone-700 dark:text-stone-300 transition-colors"
            >
              Upgrade plan
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row: Clean Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-[#19191b] border border-black/[0.06] dark:border-white/[0.08] space-y-1">
          <span className="text-xs text-stone-500 font-medium">Total menu items</span>
          <div className="text-2xl font-semibold tabular-nums text-stone-900 dark:text-white">
            {totalMenuItems}
          </div>
          <p className="text-[11px] text-stone-400">
            {isPremium ? 'Unlimited capacity' : `${activeMenuItems} of 3 active`}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#19191b] border border-black/[0.06] dark:border-white/[0.08] space-y-1">
          <span className="text-xs text-stone-500 font-medium">Active items</span>
          <div className="text-2xl font-semibold tabular-nums text-stone-900 dark:text-white">
            {activeMenuItems}
          </div>
          <p className="text-[11px] text-stone-400">Visible on public menu</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#19191b] border border-black/[0.06] dark:border-white/[0.08] space-y-1">
          <span className="text-xs text-stone-500 font-medium">Pending orders</span>
          <div className="text-2xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
            {pendingOrders}
          </div>
          <p className="text-[11px] text-stone-400">Awaiting review</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#19191b] border border-black/[0.06] dark:border-white/[0.08] space-y-1">
          <span className="text-xs text-stone-500 font-medium">Accepted orders</span>
          <div className="text-2xl font-semibold tabular-nums text-stone-900 dark:text-white">
            {acceptedOrders}
          </div>
          <p className="text-[11px] text-stone-400">Confirmed by kitchen</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#19191b] border border-black/[0.06] dark:border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
          <h2 className="text-sm font-semibold text-stone-900 dark:text-white">
            Recent customer orders
          </h2>
          <Link
            href="/dashboard/vendor/orders"
            className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white inline-flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            No orders received yet. New orders will appear here automatically.
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={order.itemId?.images?.[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80'}
                    alt={order.itemId?.itemName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-stone-900 dark:text-white">
                      {order.itemId?.itemName}
                    </p>
                    <p className="text-stone-500">
                      {order.customerId?.name} • {order.deliveryAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                      order.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                        : order.status === 'accepted'
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                        : 'bg-stone-100 text-stone-600 dark:bg-white/[0.04] dark:text-stone-400'
                    }`}
                  >
                    {order.status}
                  </span>
                  <Link
                    href="/dashboard/vendor/orders"
                    className="px-2.5 py-1 rounded border border-black/[0.08] dark:border-white/[0.08] text-stone-600 dark:text-stone-300 hover:text-stone-900"
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
