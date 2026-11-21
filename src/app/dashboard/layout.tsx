'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardShellSkeleton } from '@/components/ui/Skeleton';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ShoppingBag,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Receipt,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin?redirect=' + pathname);
      } else {
        if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
          router.replace(user.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/customer');
        } else if (pathname.startsWith('/dashboard/vendor') && user.role !== 'vendor') {
          router.replace(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer');
        } else if (pathname.startsWith('/dashboard/customer') && user.role !== 'customer') {
          router.replace(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/vendor');
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) {
    return <DashboardShellSkeleton />;
  }

  let navItems: { name: string; href: string; icon: any }[] = [];

  if (user.role === 'vendor') {
    navItems = [
      { name: 'Overview', href: '/dashboard/vendor', icon: LayoutDashboard },
      { name: 'Menu items', href: '/dashboard/vendor/menu', icon: UtensilsCrossed },
      { name: 'Add menu item', href: '/dashboard/vendor/add-item', icon: PlusCircle },
      { name: 'Customer orders', href: '/dashboard/vendor/orders', icon: ShoppingBag },
      { name: 'Subscription', href: '/dashboard/vendor/subscription', icon: CreditCard },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
    ];
  } else if (user.role === 'admin') {
    navItems = [
      { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
      { name: 'Manage users', href: '/dashboard/admin/users', icon: Users },
      { name: 'Moderate menu', href: '/dashboard/admin/menu', icon: UtensilsCrossed },
      { name: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
    ];
  } else {
    navItems = [
      { name: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
      { name: 'My orders', href: '/dashboard/customer/orders', icon: ShoppingBag },
      { name: 'Browse menu', href: '/menu', icon: UtensilsCrossed },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: Settings },
    ];
  }

  const consoleLabel =
    user.role === 'admin'
      ? 'Admin Console'
      : user.role === 'vendor'
      ? 'Kitchen Studio'
      : 'Diner Portal';

  const pageLabel =
    pathname === '/dashboard/profile'
      ? 'Profile Settings'
      : pathname.split('/').filter(Boolean).slice(-1)[0]?.replace('-', ' ') || 'Overview';

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] text-[#18120E]">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[#18120E]/55 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Bold Charred Espresso Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-72 shrink-0 flex-col justify-between border-r border-white/10 bg-[#18120E] text-[#FAF7F2] transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Subtle Top Crimson Hearth Hairline */}
        <div className="relative flex flex-1 flex-col">
          <div className="h-[2px] w-full bg-gradient-to-r from-[#E50916] via-[#D97706] to-transparent" />

          <div className="space-y-6 p-6">
            {/* Brand Mark + Console Subtitle */}
            <div className="flex items-start justify-between">
              <div>
                <Link href="/" className="inline-flex items-center">
                  <BrandLogo variant="horizontal" theme="dark" size="md" />
                </Link>
                <p className="mt-1.5 pl-11 text-[10px] font-bold uppercase tracking-[0.22em] text-[#D97706]">
                  {consoleLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-white lg:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Interactive Profile Tile -> Opens In-Dashboard Profile Settings */}
            <Link
              href="/dashboard/profile"
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center space-x-3 rounded-2xl border p-3.5 transition-all ${
                pathname === '/dashboard/profile'
                  ? 'border-[#E50916]/60 bg-white/[0.1]'
                  : 'border-white/10 bg-white/[0.05] hover:border-white/25 hover:bg-white/[0.08]'
              }`}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-white/20"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D91E18] text-sm font-extrabold uppercase text-white">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  {user.name}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#D97706]">
                  {user.role} {user.subscriptionPlan === 'premium' && '• Pro'}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>

            {/* Primary Navigation */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 rounded-2xl px-4 py-3 text-xs font-bold tracking-wide transition-all ${
                      isActive
                        ? 'bg-[#E50916] text-white shadow-[0_12px_24px_-10px_rgba(229,9,22,0.8)]'
                        : 'text-stone-300 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer in Sidebar */}
        <div className="space-y-1.5 border-t border-white/10 p-5">
          <Link
            href="/"
            className="flex w-full items-center space-x-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Return to Storefront</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex w-full cursor-pointer items-center space-x-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-stone-300 transition-colors hover:bg-[#E50916]/15 hover:text-[#ff6b6b]"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-stone-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center space-x-3.5">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-stone-200 bg-[#FAF7F2] p-2 text-[#18120E] hover:border-[#D91E18] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A4A12] sm:block">
                PizzaHub • {consoleLabel}
              </span>
              <h2 className="font-display text-xl uppercase tracking-wide text-[#18120E]">
                {pageLabel}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/profile"
              className="hidden items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-bold text-[#18120E] transition hover:border-[#9A4A12] sm:inline-flex"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D91E18] text-[10px] font-bold text-white">
                  {user.name.charAt(0)}
                </span>
              )}
              <span>Edit Profile</span>
            </Link>

            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#18120E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#D91E18]"
            >
              <span>Live Menu</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        <main className="w-full max-w-6xl flex-1 p-5 sm:p-7 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
