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
  ArrowUpRight,
  Settings,
  DollarSign,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { DashboardOverviewSkeleton } from '@/components/ui/Skeleton';
import { BrushHighlight } from '@/components/ui/BrushHighlight';
import { StatusDonutChart } from '@/components/dashboard/DashboardCharts';
import { PremiumStatCard } from '@/components/dashboard/PremiumStatCard';

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
    return <DashboardOverviewSkeleton />;
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const acceptedOrders = orders.filter((o) => o.status === 'accepted').length;
  const rejectedOrders = orders.filter(
    (o) => o.status === 'rejected' || o.status === 'cancelled'
  ).length;
  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled' && o.status !== 'rejected')
    .reduce((sum, o) => sum + (o.itemId?.price || 0), 0);

  const firstName = user?.name?.split(' ')[0] || 'Foodie';

  return (
    <div className="space-y-8">
      {/* Bold Charred Espresso Hero Command Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-[#18120E] p-7 sm:p-9 text-[#FAF7F2] shadow-[0_24px_56px_-22px_rgba(24,18,14,0.38)]">
        <img
          src="/images/cat-classic.jpg"
          alt="Wood-fired Neapolitan pizza"
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 object-cover opacity-20 md:block"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#18120E] via-[#18120E]/92 to-[#18120E]/70" />

        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D97706]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E50916]" />
              Diner Command Center
            </span>
            <h1 className="leading-[0.96] tracking-tight text-white">
              <span className="font-display text-[clamp(2rem,3.6vw,3rem)] uppercase">
                HEY {firstName},{' '}
              </span>
              <BrushHighlight immediate color="#E50916" secondaryColor="#D97706" delay={0.15}>
                <span className="font-editorial text-[clamp(2.2rem,3.8vw,3.2rem)] italic font-normal lowercase text-[#FAF7F2]">
                  hungry?
                </span>
              </BrushHighlight>
            </h1>
            <p className="max-w-xl text-sm text-stone-300">
              {totalOrders} active &amp; past orders tracked •{' '}
              <span className="font-bold text-white">{formatPrice(totalSpent)}</span> total wood-fired orders value.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-[#E50916] px-6 py-3 text-xs font-bold text-white shadow-[0_12px_28px_-10px_rgba(229,9,22,0.7)] transition hover:bg-[#c80814]"
            >
              <Pizza className="h-4 w-4" />
              <span>Order Fresh Pizza</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:border-white/40 hover:bg-white/15"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bento 4-Card KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PremiumStatCard
          tone="dark"
          label="Total Orders"
          value={totalOrders}
          subtitle="All-time pizza deliveries"
          badge="Live"
          icon={ShoppingBag}
          sparkline={[18, 28, 24, 42, 46, Math.max(54, totalOrders * 8)]}
        />

        <PremiumStatCard
          tone="amber"
          label="Pending Review"
          value={pendingOrders}
          subtitle="Awaiting kitchen confirmation"
          badge="Queue"
          icon={Clock}
          sparkline={[20, 32, 30, 26, 38, Math.max(42, pendingOrders * 10)]}
        />

        <PremiumStatCard
          tone="emerald"
          label="Accepted"
          value={acceptedOrders}
          subtitle="Confirmed by brick oven"
          badge="Oven"
          icon={CheckCircle2}
          sparkline={[15, 25, 36, 48, 52, Math.max(62, acceptedOrders * 12)]}
        />

        <PremiumStatCard
          tone="crimson"
          label="Rejected / Cancelled"
          value={rejectedOrders}
          subtitle={`${formatPrice(totalSpent)} active orders spend`}
          badge="History"
          icon={XCircle}
          sparkline={[22, 34, 38, 45, 55, Math.max(48, rejectedOrders * 12)]}
        />
      </div>

      {/* 2-Column Visual Analytics + Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <StatusDonutChart
            title="Order Status Mix"
            subtitle="Live breakdown across all submissions"
            centerLabel="Orders"
            segments={[
              { label: 'Accepted', value: acceptedOrders, color: '#15803D' },
              { label: 'Pending', value: pendingOrders, color: '#D97706' },
              { label: 'Archived / Cancelled', value: rejectedOrders, color: '#D91E18' },
            ]}
          />
        </div>

        <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="mb-4 flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A4A12]">
                Activity Feed
              </span>
              <h3 className="mt-1 text-base font-extrabold text-[#18120E]">
                Recent Orders
              </h3>
            </div>
            <Link
              href="/dashboard/customer/orders"
              className="flex items-center space-x-1 rounded-full border border-stone-200 bg-[#FAF7F2] px-3.5 py-1.5 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18]"
            >
              <span>All Orders</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#6E6259]">
              <XCircle className="mx-auto mb-2 h-8 w-8 text-stone-300" />
              No orders placed yet.{' '}
              <Link href="/menu" className="font-bold text-[#D91E18] underline underline-offset-2">
                Browse menu
              </Link>{' '}
              to order your first wood-fired pie.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col justify-between gap-4 py-3.5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={order.itemId?.images?.[0] || '/images/cat-classic.jpg'}
                      alt={order.itemId?.itemName}
                      className="h-14 w-14 shrink-0 rounded-2xl border border-stone-200 bg-[#FAF7F2] object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-[#18120E]">
                        {order.itemId?.itemName}
                      </h4>
                      <p className="text-xs text-[#6E6259]">
                        {order.vendorId?.businessName || order.vendorId?.name} •{' '}
                        <span className="font-display text-sm text-[#D91E18] tabular-nums">
                          {formatPrice(order.itemId?.price || 0)}
                        </span>
                      </p>
                      <p className="text-[11px] text-[#6E6259]">
                        Delivery: {formatDate(order.deliveryDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${
                        order.status === 'pending'
                          ? 'border-amber-200 bg-amber-50 text-[#9A4A12]'
                          : order.status === 'accepted'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : order.status === 'rejected'
                          ? 'border-stone-200 bg-[#FAF7F2] text-[#6E6259]'
                          : 'border-red-200 bg-red-50 text-[#D91E18]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          order.status === 'pending'
                            ? 'bg-amber-500'
                            : order.status === 'accepted'
                            ? 'bg-emerald-500'
                            : order.status === 'cancelled'
                            ? 'bg-[#D91E18]'
                            : 'bg-stone-400'
                        }`}
                      />
                      <span className="capitalize">{order.status}</span>
                    </span>
                    <Link
                      href="/dashboard/customer/orders"
                      className="rounded-xl border border-stone-200 bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18]"
                    >
                      Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
