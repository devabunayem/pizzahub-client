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
  Sparkles,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
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

  // Authentication & Role Redirection
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin?redirect=' + pathname);
      } else {
        // Prevent opening another role's dashboard by changing URL manually:
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
    return <LoadingSpinner fullScreen message="Verifying security credentials..." />;
  }

  // Navigation Links based on role
  let navItems: { name: string; href: string; icon: any }[] = [];

  if (user.role === 'vendor') {
    navItems = [
      { name: 'Overview', href: '/dashboard/vendor', icon: LayoutDashboard },
      { name: 'My Menu Items', href: '/dashboard/vendor/menu', icon: UtensilsCrossed },
      { name: 'Add Menu Item', href: '/dashboard/vendor/add-item', icon: PlusCircle },
      { name: 'Customer Orders', href: '/dashboard/vendor/orders', icon: ShoppingBag },
      { name: 'Subscription Plan', href: '/dashboard/vendor/subscription', icon: CreditCard },
      { name: 'Profile Settings', href: '/profile', icon: Settings },
    ];
  } else if (user.role === 'admin') {
    navItems = [
      { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
      { name: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
      { name: 'Manage Menu Items', href: '/dashboard/admin/menu', icon: UtensilsCrossed },
      { name: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
      { name: 'Profile Settings', href: '/profile', icon: Settings },
    ];
  } else {
    // Customer
    navItems = [
      { name: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
      { name: 'My Orders', href: '/dashboard/customer/orders', icon: ShoppingBag },
      { name: 'Browse Menu', href: '/menu', icon: Pizza },
      { name: 'Profile Settings', href: '/profile', icon: Settings },
    ];
  }

  return (
    <div className="min-h-screen flex bg-stone-100/70 dark:bg-stone-950">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pizza-600 to-pizza-500 flex items-center justify-center text-white shadow-md shadow-pizza-500/30">
                <Pizza className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white">
                  Pizza<span className="text-pizza-600">Hub</span>
                </span>
                <span className="text-[10px] font-bold text-pizza-500 uppercase tracking-widest -mt-1">
                  {user.role} workspace
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Card */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-center space-x-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-11 h-11 rounded-xl object-cover border border-pizza-400 shrink-0"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-pizza-600 text-white flex items-center justify-center font-bold text-base uppercase shrink-0">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-900 dark:text-white truncate">
                {user.name}
              </p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pizza-100 dark:bg-pizza-950/60 text-pizza-700 dark:text-pizza-300 capitalize">
                  {user.role}
                </span>
                {user.role === 'vendor' && user.subscriptionPlan === 'premium' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    ⭐ Premium
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pizza-600 to-pizza-500 text-white shadow-md shadow-pizza-500/25'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/70 hover:text-pizza-600 dark:hover:text-pizza-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area with Logout & Theme */}
        <div className="p-6 border-t border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Appearance</span>
            <ThemeToggle />
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="h-16 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white capitalize">
              {pathname.split('/').filter(Boolean).slice(-1)[0] || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/menu"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-pizza-50 dark:bg-stone-800 text-pizza-600 dark:text-pizza-400 text-xs font-bold hover:bg-pizza-100 transition-colors"
            >
              <Pizza className="w-3.5 h-3.5" />
              <span>Browse Live Menu</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
