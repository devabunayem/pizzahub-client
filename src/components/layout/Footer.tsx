import React from 'react';
import Link from 'next/link';
import { Pizza, Mail, Phone, MapPin, Instagram, Facebook, Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pizza-600 to-pizza-500 flex items-center justify-center text-white shadow-md shadow-pizza-500/30">
                <Pizza className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Pizza<span className="text-pizza-500">Hub</span>
              </span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Discover authentic wood-fired, gourmet, and classic pizzas from top local artisanal
              kitchens. Hot, crisp, and fresh right to your doorstep.
            </p>
            {/* Social Links with new X logo */}
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-pizza-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="X (formerly Twitter)"
              >
                {/* SVG for new X logo */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-pizza-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-pizza-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/devabunayem/pizzahub-client"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-pizza-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/menu?category=Classic+Pizzas"
                  className="hover:text-pizza-400 transition-colors"
                >
                  Classic Pizzas
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=Meat+Lovers"
                  className="hover:text-pizza-400 transition-colors"
                >
                  Meat Lovers
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=Vegetarian+Pizzas"
                  className="hover:text-pizza-400 transition-colors"
                >
                  Vegetarian Pizzas
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=Specialty+/+Gourmet+Pizzas"
                  className="hover:text-pizza-400 transition-colors"
                >
                  Specialty Gourmet
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=Sides+&+Appetizers"
                  className="hover:text-pizza-400 transition-colors"
                >
                  Sides & Desserts
                </Link>
              </li>
            </ul>
          </div>

          {/* For Partners & Roles */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Partner With Us
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/signup?role=vendor" className="hover:text-pizza-400 transition-colors">
                  Join as Restaurant
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor" className="hover:text-pizza-400 transition-colors">
                  Vendor Dashboard
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-pizza-400 transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-pizza-400 transition-colors">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-2 text-stone-400">
                <MapPin className="w-4 h-4 text-pizza-500 shrink-0" />
                <span>452 Broadway, New York, NY 10013</span>
              </li>
              <li className="flex items-center space-x-2 text-stone-400">
                <Phone className="w-4 h-4 text-pizza-500 shrink-0" />
                <span>+1 (800) 749-9248</span>
              </li>
              <li className="flex items-center space-x-2 text-stone-400">
                <Mail className="w-4 h-4 text-pizza-500 shrink-0" />
                <span>support@pizzahub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} PizzaHub Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
