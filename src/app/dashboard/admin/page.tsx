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
  ShieldCheck,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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
    return <LoadingSpinner message="Loading platform overview metrics..." />;
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
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 text-white shadow-xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pizza-600 text-white text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Master Administration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            PizzaHub Platform Administration
          </h1>
          <p className="text-sm text-stone-400 max-w-xl">
            Audit user accounts, moderate submitted menu items, monitor Stripe subscriptions, and
            ensure 100% marketplace compliance.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/admin/menu?status=pending"
            className="px-5 py-3 rounded-2xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
          >
            <Clock className="w-4 h-4" />
            <span>Review Pending Pizzas ({stats?.pendingMenuItems || 0})</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className={`p-6 rounded-3xl bg-white dark:bg-stone-900 border transition-all hover:shadow-lg hover:-translate-y-0.5 space-y-3 block ${
                card.highlight
                  ? 'border-red-400 dark:border-red-800 ring-2 ring-red-400/20'
                  : 'border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-stone-900 dark:text-white">
                {card.value}
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>{card.desc}</span>
                <ArrowRight className="w-3.5 h-3.5 text-pizza-500" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Links & Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:border-pizza-500 transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900 dark:text-white">User Moderation</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Search users by name or email, filter by customer or vendor role, and block unauthorized
            or abusive accounts.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/menu"
          className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:border-pizza-500 transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-pizza-50 dark:bg-pizza-950/60 text-pizza-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900 dark:text-white">Menu Item Approval</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Approve or reject submitted pizzas, edit inappropriate descriptions, and manage
            marketplace catalogue quality.
          </p>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm hover:border-pizza-500 transition-all space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900 dark:text-white">
            Audit Transactions
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Audit read-only Stripe subscription transactions, verify payment amounts, and view
            vendor subscription dates.
          </p>
        </Link>
      </div>
    </div>
  );
}
