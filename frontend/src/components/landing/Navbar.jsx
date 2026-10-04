'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sprout, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer inline-flex shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
            <Sprout className="h-6 w-6 text-emerald-400 relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">ATMS</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Premium</span>
          </div>
        </Link>
        
        {/* Progressive Desktop Navigation */}
        <nav className="flex items-center gap-2 xl:gap-4 ml-auto mr-4">
          <Link href="/#features" className="hidden lg:block">
            <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 hover:text-emerald-600 transition-colors">
              Features
            </Button>
          </Link>
          <Link href="/#pricing" className="hidden lg:block">
            <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 hover:text-emerald-600 transition-colors">
              Pricing
            </Button>
          </Link>
          <Link href="/about" className="hidden md:block">
            <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 hover:text-emerald-600 transition-colors">
              About
            </Button>
          </Link>
          <Link href="/contact" className="hidden md:block">
            <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 hover:text-emerald-600 transition-colors">
              Contact
            </Button>
          </Link>
          <Link href="/portal/login" className="hidden sm:block">
            <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 hover:text-slate-900">
              Sign In
            </Button>
          </Link>
        </nav>

        {/* Always visible Action & Hamburger (Hamburger hides on lg) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link href="/portal/register">
            <Button className="h-9 sm:h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 sm:px-6 font-bold uppercase tracking-widest text-[10px] sm:text-xs shadow-md">
              Get Started
            </Button>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-600 hover:text-emerald-600 transition-colors p-1"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Dynamic Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl px-4 py-6 flex flex-col gap-2">
          
          <Link href="/#features" className="block lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start h-12 rounded-xl font-bold uppercase tracking-widest text-sm text-slate-600 hover:text-emerald-600 transition-colors">
              Features
            </Button>
          </Link>
          
          <Link href="/#pricing" className="block lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start h-12 rounded-xl font-bold uppercase tracking-widest text-sm text-slate-600 hover:text-emerald-600 transition-colors">
              Pricing
            </Button>
          </Link>
          
          <Link href="/about" className="block md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start h-12 rounded-xl font-bold uppercase tracking-widest text-sm text-slate-600 hover:text-emerald-600 transition-colors">
              About
            </Button>
          </Link>
          
          <Link href="/contact" className="block md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start h-12 rounded-xl font-bold uppercase tracking-widest text-sm text-slate-600 hover:text-emerald-600 transition-colors">
              Contact
            </Button>
          </Link>
          
          {/* Divider only shows if there are items above and below it, but we'll hide it on sm and up since Sign In disappears from here */}
          <div className="h-px bg-slate-200 my-2 block sm:hidden" />
          
          <Link href="/portal/login" className="block sm:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-sm border-slate-200 hover:bg-slate-50 text-slate-900">
              Sign In
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
