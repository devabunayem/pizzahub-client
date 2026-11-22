'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  LayoutDashboard,
  Settings,
  LogOut,
  Crown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CardNav, { type CardNavItem } from './CardNav';
import { BrandLogo } from '@/components/ui/BrandLogo';

export const SiteHeader = () => {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImgError(false);
    setProfileOpen(false);
    setNavOpen(false);
  }, [user?._id, user?.image, pathname]);

  useEffect(() => {
    if (!profileOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [profileOpen]);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const dashboardPath =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'vendor'
      ? '/dashboard/vendor'
      : '/dashboard/customer';

  const roleSpecificLinks =
    user?.role === 'admin'
      ? [
          { label: 'Admin Dashboard', href: '/dashboard/admin' },
          { label: 'Moderate Menu', href: '/dashboard/admin/menu' },
        ]
      : user?.role === 'vendor'
      ? [
          { label: 'Vendor Dashboard', href: '/dashboard/vendor' },
          { label: 'Add Menu Item', href: '/dashboard/vendor/add-item' },
        ]
      : [
          { label: 'My Dashboard', href: '/dashboard/customer' },
          { label: 'My Orders', href: '/dashboard/customer/orders' },
        ];

  const pizzaHubLogo = <BrandLogo variant="horizontal" theme="light" size="sm" />;

  const items: CardNavItem[] = [
    {
      label: 'Explore',
      bgColor: '#FAF7F2',
      textColor: '#18120E',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Browse Menu', href: '/menu' },
      ],
    },
    {
      label: user ? 'Workspace' : 'Account',
      bgColor: '#18120E',
      textColor: '#FAF7F2',
      links: user
        ? roleSpecificLinks
        : [
            { label: 'Sign In', href: '/signin' },
            { label: 'Sign Up', href: '/signup' },
          ],
    },
  ];

  const userInitial = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'P';
  const isPremiumVendor =
    user?.role === 'vendor' && user?.subscriptionPlan === 'premium';

  const navRightSlot = isLoading ? (
    <div
      aria-hidden="true"
      className="flex h-10 items-center gap-2 rounded-full p-1 sm:h-[44px] sm:rounded-[12px] sm:px-2 sm:pr-2.5"
    >
      <div className="skeleton-shimmer h-8 w-8 rounded-full" />
      <div className="hidden space-y-1.5 sm:block">
        <div className="skeleton-shimmer h-3 w-20 rounded" />
        <div className="skeleton-shimmer h-2.5 w-12 rounded" />
      </div>
    </div>
  ) : user ? (
    <button
      type="button"
      onClick={() => {
        setNavOpen(false);
        setProfileOpen((prev) => !prev);
      }}
      aria-expanded={profileOpen}
      aria-haspopup="menu"
      aria-label="Open account menu"
      className="flex h-10 items-center gap-2 rounded-full p-1 text-left text-stone-900 transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700 sm:h-[44px] sm:rounded-[12px] sm:px-2 sm:pr-2.5 cursor-pointer"
    >
      {user.image && !imgError ? (
        <img
          src={user.image}
          alt={user.name}
          onError={() => setImgError(true)}
          className="h-8 w-8 rounded-full object-cover ring-1 ring-black/15"
        />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D91E18] text-xs font-bold text-white shadow-sm">
          {userInitial}
        </span>
      )}

      <div className="hidden sm:block leading-tight">
        <p className="max-w-[120px] truncate text-xs font-bold text-[#18120E]">
          {user.name}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A4A12]">
          {user.role}
        </p>
      </div>

      <ChevronDown
        className={`hidden sm:block h-4 w-4 text-stone-500 transition-transform duration-200 ${
          profileOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
  ) : (
    <Link
      href="/signup"
      className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl bg-[#E50916] px-3 text-xs font-semibold text-white shadow-[0_6px_16px_-6px_rgba(229,9,22,0.55)] transition hover:bg-[#c80814] sm:h-[44px] sm:px-4 sm:text-sm"
    >
      Sign Up
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 pt-4 pb-2 backdrop-blur-sm">
      <div ref={dropdownRef} className="site-container relative">
        <CardNav
          logo={pizzaHubLogo}
          logoAlt="PizzaHub"
          logoHref="/"
          items={items}
          cta={undefined}
          rightSlot={navRightSlot}
          open={navOpen}
          onOpenChange={(next) => {
            setNavOpen(next);
            if (next) setProfileOpen(false);
          }}
          theme="light"
          surface="glass"
          accentColor="#e50916"
          cardHeight={124}
          maxWidth={1280}
          cardEffect="rise"
          openOn="click"
          linkComponent={Link}
          ariaLabel="PizzaHub navigation"
        />

        {!isLoading && user && profileOpen && (
          <div
            role="menu"
            className="absolute right-6 top-[calc(100%+8px)] z-50 w-64 origin-top-right overflow-hidden rounded-2xl border border-stone-200/90 bg-white/95 p-2 shadow-[0_24px_48px_-16px_rgba(24,18,14,0.22)] backdrop-blur-xl"
          >
            <div className="mb-1.5 rounded-xl bg-[#FAF7F2] px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-bold text-[#18120E]">
                  {user.name}
                </p>
                {isPremiumVendor && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-[#9A4A12]">
                    <Crown className="h-3 w-3" />
                    PRO
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-[#6E6259]">{user.email}</p>
            </div>

            <Link
              href={dashboardPath}
              role="menuitem"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#18120E] transition hover:bg-[#FAF7F2]"
            >
              <LayoutDashboard className="h-4 w-4 text-[#9A4A12]" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/profile"
              role="menuitem"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#18120E] transition hover:bg-[#FAF7F2]"
            >
              <Settings className="h-4 w-4 text-[#9A4A12]" />
              <span>Profile Settings</span>
            </Link>

            <div className="my-1.5 border-t border-stone-100" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setProfileOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#D91E18] transition hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
