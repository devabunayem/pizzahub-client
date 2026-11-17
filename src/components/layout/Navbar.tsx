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
    { name: 'Browse menu', href: '/menu' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#141415]/95 backdrop-blur-sm border-b border-black/[0.06] dark:border-white/[0.08] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900">
              <Pizza className="w-4 h-4 text-white dark:text-stone-900" />
            </div>
            <span className="font-semibold text-base tracking-tight text-stone-900 dark:text-white">
              Pizza<span className="text-[#b91c1c] dark:text-[#ea580c]">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-normal transition-colors ${
                    isActive
                      ? 'text-stone-900 dark:text-white font-medium bg-stone-100 dark:bg-white/[0.06]'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user && (
              <Link
                href={getDashboardPath()}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center space-x-1.5 ${
                  pathname.startsWith('/dashboard')
                    ? 'text-stone-900 dark:text-white font-medium bg-stone-100 dark:bg-white/[0.06]'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  {user.role === 'admin'
                    ? 'Admin portal'
                    : user.role === 'vendor'
                    ? 'Vendor dashboard'
                    : 'Dashboard'}
                </span>
              </Link>
            )}
          </nav>

          {/* Right Area */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {isLoading ? (
              <div className="w-20 h-8 bg-stone-100 dark:bg-white/[0.06] rounded-md animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 py-1 px-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] transition-colors"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-6 h-6 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center font-medium text-xs uppercase">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-medium text-stone-800 dark:text-stone-200 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-[#19191b] rounded-xl shadow-lg border border-black/[0.06] dark:border-white/[0.08] py-1 z-50 text-xs"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-black/[0.06] dark:border-white/[0.08]">
                      <p className="font-medium text-stone-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href={getDashboardPath()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-3.5 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/[0.04]"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-stone-400" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-3.5 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/[0.04]"
                    >
                      <Settings className="w-3.5 h-3.5 mr-2 text-stone-400" />
                      Profile settings
                    </Link>

                    <div className="border-t border-black/[0.06] dark:border-white/[0.08] my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/signin"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-[#b91c1c] hover:bg-[#991b1b] transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-stone-600 dark:text-stone-400"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#141415] px-4 py-3 space-y-1 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/[0.04]"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-stone-900 dark:text-white font-medium bg-stone-100 dark:bg-white/[0.05]"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/[0.04]"
              >
                Profile settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-red-600 dark:text-red-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-1.5">
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center rounded-md border border-stone-200 dark:border-white/[0.1] text-xs font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center rounded-md bg-[#b91c1c] text-white text-xs font-medium"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
