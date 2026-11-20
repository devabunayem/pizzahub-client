import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { AuthProvider } from '@/context/AuthContext';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'PizzaHub — Authentic Pizza Ordering & Delivery Platform',
  description:
    'Discover local artisanal pizza shops, browse wood-fired menus, and order freshly baked gourmet pizza with real-time tracking.',
  keywords: ['pizza delivery', 'woodfire pizza', 'order pizza online', 'artisanal pizza', 'pizzahub'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-stone-900 antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <SmoothScrollProvider>
              <ToastProvider />
              <SiteHeader />
              {children}
              <Footer />
            </SmoothScrollProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
