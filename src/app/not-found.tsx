import Link from 'next/link';
import { Pizza, Home, ArrowUpRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-[#FAF7F2] px-4 py-16">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-stone-200/90 bg-white p-8 sm:p-10 text-center shadow-[0_24px_48px_-22px_rgba(24,18,14,0.16)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D91E18] text-white shadow-sm">
          <Pizza className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-[#9A4A12]">
            404 Error
          </span>
          <h1 className="font-display text-4xl uppercase tracking-tight text-[#18120E]">
            Page Not Found
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#6E6259]">
            The page you requested could not be located or may have been moved from our oven queue.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#18120E] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#D91E18] sm:w-auto"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/menu"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 bg-[#FAF7F2] px-6 py-3 text-xs font-bold text-[#18120E] transition hover:border-[#D91E18] hover:text-[#D91E18] sm:w-auto"
          >
            <span>Browse Menu</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
