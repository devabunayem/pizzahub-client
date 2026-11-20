import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { AuthProvider } from '@/context/AuthContext';

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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
