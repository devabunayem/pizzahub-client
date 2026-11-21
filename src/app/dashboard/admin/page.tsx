'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Store,
  UserCheck,
  UtensilsCrossed,
  Clock,
  DollarSign,
  ArrowRight,
  Receipt,
  Settings,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DashboardOverviewSkeleton } from '@/components/ui/Skeleton';
import { BrushHighlight } from '@/components/ui/BrushHighlight';
import { StatusDonutChart, MetricBarChart } from '@/components/dashboard/DashboardCharts';
import { PremiumStatCard, type StatTone } from '@/components/dashboard/PremiumStatCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  if (loading) {
    return <DashboardOverviewSkeleton metricCount={6} />;
  }

  const statCards: {
    title: string;
    value: string | number;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    tone: StatTone;
    href: string;
    highlight?: boolean;
  }[] = [
    {
      title: 'Total Transactions',
      value: stats?.totalTransactions || 0,
      desc: `${formatPrice(stats?.totalRevenue || 0)} settled Stripe revenue`,
      icon: Receipt,
      tone: 'dark',
      href: '/dashboard/admin/transactions',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      desc: 'All registered platform accounts',
      icon: Users,
      tone: 'espresso',
      href: '/dashboard/admin/users',
    },
    {
      title: 'Restaurant Vendors',
      value: stats?.totalVendors || 0,
      desc: 'Active pizzeria kitchen owners',
      icon: Store,
      tone: 'amber',
      href: '/dashboard/admin/users?role=vendor',
    },
    {
      title: 'Active Customers',
      value: stats?.totalCustomers || 0,
      desc: 'Registered food lovers',
      icon: UserCheck,
      tone: 'emerald',
      href: '/dashboard/admin/users?role=customer',
    },
    {
      title: 'Total Menu Items',
      value: stats?.totalMenuItems || 0,
      desc: 'Submitted across all categories',
      icon: UtensilsCrossed,
      tone: 'crimson',
      href: '/dashboard/admin/menu',
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingMenuItems || 0,
      desc: 'Requires admin moderation',
      icon: Clock,
      tone: 'amber',
      href: '/dashboard/admin/menu?status=pending',
      highlight: (stats?.pendingMenuItems || 0) > 0,
    },
  ];

  const totalVendors = stats?.totalVendors || 0;
  const totalCustomers = stats?.totalCustomers || 0;
  const otherAdmins = Math.max(0, (stats?.totalUsers || 0) - totalVendors - totalCustomers);

  return (
    <div className="space-y-8">
      {/* Bold Charred Espresso Admin Command Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-[#18120E] p-5 sm:p-6 text-[#FAF7F2] shadow-[0_20px_44px_-22px_rgba(24,18,14,0.34)]">
        <img
          src="/images/cat-gourmet.jpg"
          alt="Artisan gourmet truffle burrata pizza"
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/2 object-cover opacity-20 md:block"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#18120E] via-[#18120E]/92 to-[#18120E]/70" />

        <div className="relative z-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D97706]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E50916]" />
              Global Governance Console
            </span>
            <h1 className="leading-[0.98] tracking-tight text-white">
              <span className="font-display text-[clamp(1.5rem,2.5vw,2.15rem)] uppercase">
                PLATFORM{' '}
              </span>
              <BrushHighlight immediate color="#E50916" secondaryColor="#D97706" delay={0.15}>
                <span className="font-editorial text-[clamp(1.6rem,2.6vw,2.2rem)] italic font-normal lowercase text-[#FAF7F2]">
                  control
                </span>
              </BrushHighlight>
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-stone-300">
              Monitor Stripe subscription revenue, moderate new restaurant dishes, and oversee user accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {stats?.pendingMenuItems > 0 && (
              <Link
                href="/dashboard/admin/menu?status=pending"
                className="inline-flex items-center gap-2 rounded-full bg-[#E50916] px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_-10px_rgba(229,9,22,0.7)] transition hover:bg-[#c80814]"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>Review Pending ({stats.pendingMenuItems})</span>
              </Link>
            )}
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Admin Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bento 6-Card Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, idx) => (
          <PremiumStatCard
            key={card.title}
            tone={card.tone}
            label={card.title}
            value={card.value}
            subtitle={card.desc}
            icon={card.icon}
            href={card.href}
            highlight={card.highlight}
            sparkline={[18 + idx * 3, 28, 34, 48 - idx * 2, 56, 72]}
          />
        ))}
      </div>

      {/* Visual Platform Analytics Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusDonutChart
          title="Platform Account Mix"
          subtitle="Ratio of customers, kitchen vendors, and admins"
          centerLabel="Users"
          segments={[
            { label: 'Customers', value: totalCustomers, color: '#D91E18' },
            { label: 'Kitchen Vendors', value: totalVendors, color: '#9A4A12' },
            { label: 'Administrators', value: otherAdmins, color: '#18120E' },
          ]}
        />

        <MetricBarChart
          title="Platform Scale Overview"
          subtitle="Live system counts across core resources"
          data={[
            { label: 'Total Accounts', value: stats?.totalUsers || 0, color: '#18120E' },
            { label: 'Menu Listings', value: stats?.totalMenuItems || 0, color: '#D91E18' },
            { label: 'Pending Reviews', value: stats?.pendingMenuItems || 0, color: '#D97706' },
            { label: 'Stripe Settlements', value: stats?.totalTransactions || 0, color: '#15803D' },
          ]}
        />
      </div>

      {/* Quick Action Directory Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Link
          href="/dashboard/admin/users"
          className="group space-y-2.5 rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#D91E18]/40"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#9A4A12]">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-base font-extrabold text-[#18120E] group-hover:text-[#D91E18]">
            User directory
          </h3>
          <p className="text-xs leading-relaxed text-[#6E6259]">
            Search accounts by name or email, filter by customer or vendor role, and manage access permissions.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/menu"
          className="group space-y-2.5 rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#D91E18]/40"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#9A4A12]">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <h3 className="text-base font-extrabold text-[#18120E] group-hover:text-[#D91E18]">
            Menu moderation
          </h3>
          <p className="text-xs leading-relaxed text-[#6E6259]">
            Review submitted dishes, approve or reject listings, and maintain catalogue standards.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="group space-y-2.5 rounded-3xl border border-stone-200/90 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#D91E18]/40"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#9A4A12]">
            <Receipt className="h-5 w-5" />
          </div>
          <h3 className="text-base font-extrabold text-[#18120E] group-hover:text-[#D91E18]">
            Transaction ledger
          </h3>
          <p className="text-xs leading-relaxed text-[#6E6259]">
            Read-only Stripe subscription records, verified transaction amounts, and plan histories.
          </p>
        </Link>
      </div>
    </div>
  );
}
