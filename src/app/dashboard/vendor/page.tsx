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
  Crown,
  Settings,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DashboardOverviewSkeleton } from '@/components/ui/Skeleton';
import { BrushHighlight } from '@/components/ui/BrushHighlight';
import { StatusDonutChart, MetricBarChart } from '@/components/dashboard/DashboardCharts';
import { PremiumStatCard } from '@/components/dashboard/PremiumStatCard';

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
  const pendingMenuItems = menuItems.filter((i) => i.status === 'pending').length;
  const inactiveMenuItems = menuItems.filter(
    (i) => i.status === 'inactive' || i.status === 'rejected'
  ).length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;
  const rejectedOrders = orders.filter(
    (o) => o.status === 'rejected' || o.status === 'cancelled'
  ).length;

  const isPremium =
    user?.subscriptionPlan === 'premium' &&
    (!user?.subscriptionExpiresAt ||
      new Date(user.subscriptionExpiresAt) > new Date());

  return (
    <div className="space-y-8">
      {/* Bold Charred Espresso Kitchen Command Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-[#18120E] p-7 sm:p-9 text-[#FAF7F2] shadow-[0_24px_56px_-22px_rgba(24,18,14,0.38)]">
        <img
          src="/images/woodfire-craft.jpg"
          alt="Wood-fired brick oven hearth"
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 object-cover opacity-25 md:block"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#18120E] via-[#18120E]/92 to-[#18120E]/70" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D97706]">
                {isPremium && <Crown className="h-3.5 w-3.5 text-amber-300" />}
                <span>{isPremium ? 'Premium Partner Kitchen' : 'Free Kitchen Tier'}</span>
              </span>
              <span className="text-xs font-semibold text-stone-300">
                {user?.businessName || user?.name}
              </span>
            </div>

            <h1 className="leading-[0.96] tracking-tight text-white">
              <span className="font-display text-[clamp(2rem,3.6vw,3rem)] uppercase">
                KITCHEN{' '}
              </span>
              <BrushHighlight immediate color="#E50916" secondaryColor="#D97706" delay={0.15}>
                <span className="font-editorial text-[clamp(2.2rem,3.8vw,3.2rem)] italic font-normal lowercase text-[#FAF7F2]">
                  studio
                </span>
              </BrushHighlight>
            </h1>

            <p className="max-w-xl text-sm text-stone-300">
              {isPremium
                ? 'Unlimited menu publishing active with featured homepage placement.'
                : `${activeMenuItems} of 3 free active menu slots used — upgrade anytime for unlimited listings.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/vendor/add-item"
              className="inline-flex items-center gap-2 rounded-full bg-[#E50916] px-6 py-3 text-xs font-bold text-white shadow-[0_12px_28px_-10px_rgba(229,9,22,0.7)] transition hover:bg-[#c80814]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Menu Item</span>
            </Link>
            {!isPremium && (
              <Link
                href="/dashboard/vendor/subscription"
                className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/50 bg-[#9A4A12]/40 px-5 py-3 text-xs font-bold text-amber-100 transition hover:bg-[#9A4A12]"
              >
                <Crown className="h-3.5 w-3.5" />
                <span>Upgrade Pro</span>
              </Link>
            )}
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Kitchen Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bento 5-Card KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <PremiumStatCard
          tone="dark"
          label="Total Menu Items"
          value={totalMenuItems}
          subtitle={isPremium ? 'Unlimited Pro capacity' : `${activeMenuItems} of 3 active`}
          badge={isPremium ? 'Pro' : 'Free'}
          icon={UtensilsCrossed}
          sparkline={[20, 30, 38, 45, 58, Math.max(66, totalMenuItems * 12)]}
        />

        <PremiumStatCard
          tone="emerald"
          label="Active Menu Items"
          value={activeMenuItems}
          subtitle="Approved & visible on menu"
          badge="Live"
          icon={CheckCircle2}
          sparkline={[18, 28, 36, 42, 54, Math.max(62, activeMenuItems * 14)]}
        />

        <PremiumStatCard
          tone="amber"
          label="Pending Orders"
          value={pendingOrders}
          subtitle="Awaiting kitchen action"
          badge="Action"
          icon={Clock}
          highlight={pendingOrders > 0}
          sparkline={[16, 30, 26, 40, 36, Math.max(48, pendingOrders * 15)]}
        />

        <PremiumStatCard
          tone="crimson"
          label="Accepted Orders"
          value={acceptedOrders}
          subtitle="Confirmed deliveries"
          badge="Done"
          icon={ShoppingBag}
          sparkline={[12, 24, 34, 44, 58, Math.max(64, acceptedOrders * 14)]}
        />

        <PremiumStatCard
          tone="espresso"
          label="Subscription Plan"
          value={isPremium ? 'Premium' : 'Free'}
          subtitle={isPremium ? 'Unlimited active items' : 'Max 3 active items'}
          badge={isPremium ? 'Active' : 'Upgrade'}
          icon={Crown}
          href="/dashboard/vendor/subscription"
          sparkline={isPremium ? [30, 42, 50, 62, 74, 86] : [20, 24, 28, 30, 32, 36]}
        />
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusDonutChart
          title="Kitchen Order Breakdown"
          subtitle="Live customer request response status"
          centerLabel="Orders"
          segments={[
            { label: 'Accepted', value: acceptedOrders, color: '#15803D' },
            { label: 'Pending', value: pendingOrders, color: '#D97706' },
            { label: 'Declined / Cancelled', value: rejectedOrders, color: '#D91E18' },
          ]}
        />

        <MetricBarChart
          title="Menu Listing Health"
          subtitle="Approval distribution across your kitchen items"
          data={[
            { label: 'Approved & Live', value: activeMenuItems, color: '#15803D' },
            { label: 'Pending Admin Review', value: pendingMenuItems, color: '#D97706' },
            { label: 'Inactive / Rejected', value: inactiveMenuItems, color: '#18120E' },
          ]}
        />
      </div>

      {/* Recent Orders */}
      <div className="space-y-4 rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
              Live Queue
            </span>
            <h2 className="mt-1 text-base font-extrabold text-[#18120E]">
              Recent Customer Orders
            </h2>
          </div>
          <Link
            href="/dashboard/vendor/orders"
            className="inline-flex items-center space-x-1 rounded-full border border-stone-200 bg-[#FAF7F2] px-4 py-1.5 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18]"
          >
            <span>Manage All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-10 text-center text-sm text-[#6E6259]">
            No orders received yet. New orders will appear here automatically.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex flex-col justify-between gap-3 py-3.5 text-xs sm:flex-row sm:items-center"
              >
                <div className="flex items-center space-x-3.5">
                  <img
                    src={order.itemId?.images?.[0] || '/images/cat-classic.jpg'}
                    alt={order.itemId?.itemName}
                    className="h-12 w-12 rounded-2xl border border-stone-200 object-cover"
                  />
                  <div>
                    <p className="text-sm font-extrabold text-[#18120E]">
                      {order.itemId?.itemName}
                    </p>
                    <p className="text-xs text-[#6E6259]">
                      {order.customerId?.name} • {order.deliveryAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <span className="font-display text-lg text-[#D91E18] tabular-nums">
                    {formatPrice(order.itemId?.price || 0)}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-bold capitalize ${
                      order.status === 'pending'
                        ? 'border-amber-200 bg-amber-50 text-[#9A4A12]'
                        : order.status === 'accepted'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-stone-200 bg-[#FAF7F2] text-[#6E6259]'
                    }`}
                  >
                    {order.status}
                  </span>
                  <Link
                    href="/dashboard/vendor/orders"
                    className="rounded-xl border border-stone-200 bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18]"
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
