'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Pizza,
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
    return <LoadingSpinner fullScreen message="Loading workspace..." />;
  }

  let navItems: { name: string; href: string; icon: any }[] = [];

  if (user.role === 'vendor') {
    navItems = [
      { name: 'Overview', href: '/dashboard/vendor', icon: LayoutDashboard },
      { name: 'Menu items', href: '/dashboard/vendor/menu', icon: UtensilsCrossed },
      { name: 'Add menu item', href: '/dashboard/vendor/add-item', icon: PlusCircle },
      { name: 'Customer orders', href: '/dashboard/vendor/orders', icon: ShoppingBag },
      { name: 'Subscription', href: '/dashboard/vendor/subscription', icon: CreditCard },
      { name: 'Settings', href: '/profile', icon: Settings },
    ];
  } else if (user.role === 'admin') {
    navItems = [
      { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
      { name: 'Manage users', href: '/dashboard/admin/users', icon: Users },
      { name: 'Moderate menu', href: '/dashboard/admin/menu', icon: UtensilsCrossed },
      { name: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
      { name: 'Settings', href: '/profile', icon: Settings },
    ];
  } else {
    navItems = [
      { name: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
      { name: 'My orders', href: '/dashboard/customer/orders', icon: ShoppingBag },
      { name: 'Browse menu', href: '/menu', icon: Pizza },
      { name: 'Settings', href: '/profile', icon: Settings },
    ];
  }

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-[#0f0f10]">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar: 260px wide, quiet hairlines */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-[#141415] border-r border-black/[0.06] dark:border-white/[0.08] flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900">
                <Pizza className="w-3.5 h-3.5 text-white dark:text-stone-900" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-stone-900 dark:text-white">
                Pizza<span className="text-[#b91c1c] dark:text-[#ea580c]">Hub</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User profile compact tile */}
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.06] flex items-center space-x-2.5">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-8 h-8 rounded-md object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center font-medium text-xs uppercase">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-stone-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-stone-500 capitalize">
                {user.role} {user.subscriptionPlan === 'premium' && '• Premium'}
              </p>
            </div>
          </div>

          {/* Nav List: 36px tall rows, gap 2px */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-normal transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer in Sidebar */}
        <div className="p-5 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>Theme</span>
            <ThemeToggle />
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 py-2 px-3 rounded-lg text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white dark:bg-[#141415] border-b border-black/[0.06] dark:border-white/[0.08] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-stone-600 dark:text-stone-400"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-medium text-stone-800 dark:text-stone-200 capitalize">
              {pathname.split('/').filter(Boolean).slice(-1)[0]?.replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>

          <Link
            href="/menu"
            className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            View live menu →
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-6xl w-full">{children}</main>
      </div>
    </div>
  );
}
