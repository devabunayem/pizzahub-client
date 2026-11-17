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
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { DashboardOverviewSkeleton } from '@/components/ui/Skeleton';

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
    return <DashboardOverviewSkeleton />;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      desc: 'All registered platform accounts',
      icon: Users,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      href: '/dashboard/admin/users',
    },
    {
      title: 'Restaurant Vendors',
      value: stats?.totalVendors || 0,
      desc: 'Active pizzeria kitchen owners',
      icon: Store,
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      href: '/dashboard/admin/users?role=vendor',
    },
    {
      title: 'Active Customers',
      value: stats?.totalCustomers || 0,
      desc: 'Registered food lovers',
      icon: UserCheck,
      color: 'bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400',
      href: '/dashboard/admin/users?role=customer',
    },
    {
      title: 'Total Menu Items',
      value: stats?.totalMenuItems || 0,
      desc: 'Submitted across all categories',
      icon: UtensilsCrossed,
      color: 'bg-pizza-100 text-pizza-600 dark:bg-pizza-950/60 dark:text-pizza-400',
      href: '/dashboard/admin/menu',
    },
    {
      title: 'Pending Menu Approvals',
      value: stats?.pendingMenuItems || 0,
      desc: 'Requires admin moderation',
      icon: Clock,
      color: 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400',
      href: '/dashboard/admin/menu?status=pending',
      highlight: stats?.pendingMenuItems > 0,
    },
    {
      title: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      desc: `${stats?.totalTransactions || 0} subscription transactions`,
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
      href: '/dashboard/admin/transactions',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            Platform administration
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            System overview, user moderation, menu approvals, and subscription transactions.
          </p>
        </div>

        {stats?.pendingMenuItems > 0 && (
          <Link
            href="/dashboard/admin/menu?status=pending"
            className="px-3.5 py-2 rounded-lg bg-pizza-700 hover:bg-pizza-800 text-white font-medium text-xs transition-colors flex items-center space-x-2 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Review pending items ({stats.pendingMenuItems})</span>
          </Link>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className={`p-5 rounded-xl bg-white dark:bg-stone-900 border transition-colors space-y-3 block ${
                card.highlight
                  ? 'border-amber-300 dark:border-amber-800/60 bg-amber-50/20'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  {card.title}
                </span>
                <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-semibold text-stone-900 dark:text-stone-100 font-mono tabular-nums">
                {card.value}
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1 border-t border-stone-100 dark:border-stone-800/80">
                <span>{card.desc}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Links & Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/admin/users"
          className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors space-y-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">User directory</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Search accounts by name or email, filter by customer or vendor role, and manage access permissions.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/menu"
          className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors space-y-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">Menu moderation</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Review submitted dishes, approve or reject listings, and maintain catalogue standards.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors space-y-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 flex items-center justify-center">
            <Receipt className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">Transaction ledger</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Read-only Stripe subscription records, verified transaction amounts, and plan histories.
          </p>
        </Link>
      </div>
    </div>
  );
}
