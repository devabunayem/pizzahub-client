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
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determine dashboard link based on role
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-stone-900/90 border-b border-pizza-100 dark:border-stone-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pizza-600 to-pizza-500 flex items-center justify-center text-white shadow-md shadow-pizza-500/30 group-hover:scale-105 transition-transform duration-200">
              <Pizza className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white flex items-center">
                Pizza<span className="text-pizza-600">Hub</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-pizza-500 -mt-1">
                Fresh & Fast
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-pizza-600 dark:text-pizza-400 bg-pizza-50 dark:bg-stone-800/80 font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:text-pizza-600 dark:hover:text-pizza-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {user && (
              <Link
                href={getDashboardPath()}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  pathname.startsWith('/dashboard')
                    ? 'text-pizza-600 dark:text-pizza-400 bg-pizza-50 dark:bg-stone-800/80 font-semibold'
                    : 'text-stone-700 dark:text-stone-300 hover:text-pizza-600 dark:hover:text-pizza-400'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-pizza-500" />
                <span>
                  {user.role === 'admin'
                    ? 'Admin Portal'
                    : user.role === 'vendor'
                    ? 'Vendor Dashboard'
                    : 'My Dashboard'}
                </span>
              </Link>
            )}
          </nav>

          {/* Right Area: Theme Toggle & Auth Buttons / Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {isLoading ? (
              <div className="w-24 h-9 bg-stone-200 dark:bg-stone-800 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pl-2.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-pizza-50 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition-colors"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-pizza-400"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-pizza-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-semibold text-stone-900 dark:text-white leading-tight">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-pizza-600 dark:text-pizza-400 font-medium capitalize">
                      {user.role} {user.subscriptionPlan === 'premium' && '⭐'}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-stone-100 dark:border-stone-700">
                      <p className="text-sm font-semibold text-stone-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {user.email}
                      </p>
                      {user.role === 'vendor' && user.subscriptionPlan === 'premium' && (
                        <span className="inline-flex items-center mt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 mr-1" /> Premium Vendor
                        </span>
                      )}
                    </div>

                    <Link
                      href={getDashboardPath()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-pizza-50 dark:hover:bg-stone-700/60 hover:text-pizza-600"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2.5 text-pizza-500" />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-pizza-50 dark:hover:bg-stone-700/60 hover:text-pizza-600"
                    >
                      <Settings className="w-4 h-4 mr-2.5 text-stone-500" />
                      Profile Settings
                    </Link>

                    <div className="border-t border-stone-100 dark:border-stone-700 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-pizza-600 dark:hover:text-pizza-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pizza-600 to-pizza-500 hover:from-pizza-700 hover:to-pizza-600 shadow-md shadow-pizza-500/20 hover:shadow-pizza-500/30 transition-all hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-stone-700 dark:text-stone-300 hover:bg-pizza-50 dark:hover:bg-stone-800"
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-base font-medium text-pizza-600 dark:text-pizza-400 bg-pizza-50 dark:bg-stone-800"
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-xl text-base font-medium text-stone-700 dark:text-stone-300 hover:bg-pizza-50 dark:hover:bg-stone-800"
              >
                <Settings className="w-5 h-5 mr-3" />
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center px-3 py-2.5 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-stone-800"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-semibold"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center rounded-xl bg-pizza-600 text-white font-semibold shadow-md shadow-pizza-500/30"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
