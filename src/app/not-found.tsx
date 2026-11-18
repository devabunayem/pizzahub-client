import Link from 'next/link';
import { Pizza, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-pizza-100 dark:bg-pizza-950/60 text-pizza-600 flex items-center justify-center shadow-lg animate-bounce">
          <Pizza className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-pizza-600">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            Slice Not Found!
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Oops! It seems this pizza slice was devoured or the page you are looking for does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-pizza-600 hover:bg-pizza-700 text-white font-bold text-xs shadow-md shadow-pizza-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/menu"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Pizza className="w-4 h-4 text-pizza-500" />
            <span>Browse Pizza Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
