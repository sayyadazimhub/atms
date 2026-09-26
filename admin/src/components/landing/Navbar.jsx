import React from 'react';
import Link from 'next/link';
import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer inline-flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-950 text-white shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
            <Sprout className="h-6 w-6 text-emerald-400 relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase">ATMS</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mt-1">Premium</span>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="hidden sm:block">
            <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Home
            </Button>
          </Link>
          <Link href="/contact" className="hidden sm:block">
            <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              Contact
            </Button>
          </Link>
          <Link href="/user/login" className="hidden sm:block">
            <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
              Sign In
            </Button>
          </Link>
          <Link href="/user/register">
            <Button className="h-10 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-6 font-bold uppercase tracking-widest text-xs shadow-md">
              Get Started
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
