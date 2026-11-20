'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  Pizza,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/signin';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'vendor') return '/dashboard/vendor';
    return '/dashboard/customer';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Menu', href: '/menu' },
  ];

  return (
    <div className="sticky top-0 z-50 mx-auto w-full max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
      <header className="relative">
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white/85 dark:border-white/10 dark:bg-[#111315]/80 px-4 py-2.5 shadow-lg shadow-black/10 dark:shadow-black/30 backdrop-blur-xl sm:px-5 transition-all"
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="PizzaHub home"
            className="flex shrink-0 items-center gap-2 text-base font-black tracking-tight text-stone-900 dark:text-white"
          >
            <Pizza className="w-5 h-5 text-emerald-500" />
            <span>
              Pizza<span className="text-emerald-500 dark:text-emerald-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition font-medium ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'text-stone-700 dark:text-white/75 hover:text-stone-950 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user && (
              <Link
                href={getDashboardPath()}
                className={`text-sm transition flex items-center gap-1.5 font-medium ${
                  pathname.startsWith('/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-stone-700 dark:text-white/75 hover:text-stone-950 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                <span>
                  {user.role === 'admin'
                    ? 'Admin Portal'
                    : user.role === 'vendor'
                    ? 'Vendor Dashboard'
                    : 'Dashboard'}
                </span>
              </Link>
            )}
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {isLoading ? (
              <div className="w-20 h-8 bg-stone-200/60 dark:bg-white/10 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-white/[0.08] border border-stone-200 dark:border-white/10 transition-colors"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#16181a] rounded-2xl shadow-xl border border-stone-200 dark:border-white/10 py-1.5 z-50 text-xs"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-stone-100 dark:border-white/10">
                      <p className="font-semibold text-stone-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={getDashboardPath()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/[0.05]"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2.5 text-emerald-500" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/[0.05]"
                    >
                      <Settings className="w-4 h-4 mr-2.5 text-stone-400" />
                      Profile Settings
                    </Link>

                    <div className="border-t border-stone-100 dark:border-white/10 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/signin"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl border border-stone-200 dark:border-white/10 bg-white/95 dark:bg-[#111315]/95 backdrop-blur-xl px-4 py-4 space-y-1.5 text-sm shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/[0.05]"
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-stone-900 dark:text-white font-semibold bg-stone-100 dark:bg-white/[0.05]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/[0.05]"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center rounded-xl border border-stone-200 dark:border-white/10 text-xs font-semibold text-stone-800 dark:text-stone-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2 text-center rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-600/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};
