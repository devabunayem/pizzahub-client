'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-pizza-100 dark:hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-pizza-500"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-stone-700 hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
