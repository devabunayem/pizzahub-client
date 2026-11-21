import React from 'react';
import Link from 'next/link';
import { Pizza, Mail, Phone, MapPin, Instagram, Facebook, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-100 dark:bg-[#0a0a0c] text-stone-600 dark:text-stone-400 border-t-2 border-stone-800/80 pt-14 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Bold Manifesto Top Banner */}
        <div className="border-b-2 border-stone-200 dark:border-stone-800 pb-10 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-stone-900 dark:text-white">
              EAT REAL PIZZA. SUPPORT LOCAL ARTISANS.
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-medium">
              Authentic wood-fired pizzas baked at 480°C by independent neighborhood pizzerias.
            </p>
          </div>
          <Link
            href="/menu"
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider self-start sm:self-auto shrink-0 transition-all shadow-lg shadow-red-600/20"
          >
            ORDER A SLICE NOW →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-200 dark:border-stone-800">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                <Pizza className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-base tracking-tighter uppercase text-stone-900 dark:text-white">
                PIZZA<span className="text-red-600">HUB</span>
              </span>
            </Link>
            <p className="text-stone-500 text-xs leading-relaxed max-w-sm">
              Connecting local wood-fired pizzerias with pizza lovers. Browse chef-crafted menus,
              customize delivery dates, and track orders directly.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-2 pt-1">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-md border border-black/[0.08] dark:border-white/[0.08] hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-md border border-black/[0.08] dark:border-white/[0.08] hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-md border border-black/[0.08] dark:border-white/[0.08] hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/devabunayem/pizzahub-client"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-md border border-black/[0.08] dark:border-white/[0.08] hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Menu Links */}
          <div className="space-y-2.5">
            <h4 className="text-stone-900 dark:text-stone-200 font-medium text-xs">
              Menu categories
            </h4>
            <ul className="space-y-1.5 text-stone-500">
              <li>
                <Link href="/menu?category=Classic+Pizzas" className="hover:text-stone-900 dark:hover:text-stone-200">
                  Classic pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Meat+Lovers" className="hover:text-stone-900 dark:hover:text-stone-200">
                  Meat lovers
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Vegetarian+Pizzas" className="hover:text-stone-900 dark:hover:text-stone-200">
                  Vegetarian pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Specialty+/+Gourmet+Pizzas" className="hover:text-stone-900 dark:hover:text-stone-200">
                  Specialty gourmet
                </Link>
              </li>
              <li>
                <Link href="/menu?category=Sides+&+Appetizers" className="hover:text-stone-900 dark:hover:text-stone-200">
                  Sides & desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* Role Access */}
          <div className="space-y-2.5">
            <h4 className="text-stone-900 dark:text-stone-200 font-medium text-xs">
              Platform access
            </h4>
            <ul className="space-y-1.5 text-stone-500">
              <li>
                <Link href="/signup?role=vendor" className="hover:text-stone-900 dark:hover:text-stone-200">
                  Register as vendor
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor" className="hover:text-stone-900 dark:hover:text-stone-200">
                  Vendor dashboard
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-stone-900 dark:hover:text-stone-200">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-stone-900 dark:hover:text-stone-200">
                  Profile settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-2.5">
            <h4 className="text-stone-900 dark:text-stone-200 font-medium text-xs">
              Contact
            </h4>
            <ul className="space-y-2 text-stone-500">
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                <span>Broadway, New York, NY 10013</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                <span>+1 (800) 749-9248</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                <span>support@pizzahub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} PizzaHub. All rights reserved.</p>
          <div className="flex space-x-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
