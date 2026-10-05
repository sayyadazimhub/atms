'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sprout, Menu, X, Twitter, Linkedin, Github, Mail, Phone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex flex-col w-full">
      {/* Top Bar */}
      <div className="bg-emerald-600 text-emerald-50 py-1.5 sm:py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 text-[10px] sm:text-xs font-medium tracking-wide">
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="mailto:support@atms.com" className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5" />
              <span>support@atms.com</span>
            </a>
            <a href="tel:+919075909896" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 907590-9896</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://x.com/azimxsayyad" target="_blank" className="hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </Link>
            <Link href="https://www.linkedin.com/in/sayyadazimmern/" target="_blank" className="hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
            </Link>
            <Link href="https://github.com/sayyadazimhub" target="_blank" className="hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md w-full">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer inline-flex shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
            <Sprout className="h-6 w-6 text-emerald-400 relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">ATMS</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Platform</span>
          </div>
        </Link>
        
        {/* Progressive Desktop Navigation */}
        <nav className="flex items-center gap-4 md:gap-8 ml-auto mr-4">
          <Link href="/#features" className="hidden lg:block relative py-2 font-medium text-base text-slate-600 hover:text-emerald-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-emerald-600 after:transition-all after:duration-300">
            Features
          </Link>
          <Link href="/#pricing" className="hidden lg:block relative py-2 font-medium text-base text-slate-600 hover:text-emerald-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-emerald-600 after:transition-all after:duration-300">
            Pricing
          </Link>
          <Link href="/about" className="hidden md:block relative py-2 font-medium text-base text-slate-600 hover:text-emerald-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-emerald-600 after:transition-all after:duration-300">
            About
          </Link>
          <Link href="/contact" className="hidden md:block relative py-2 font-medium text-base text-slate-600 hover:text-emerald-600 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-emerald-600 after:transition-all after:duration-300">
            Contact
          </Link>
          <div className="hidden md:block w-px h-5 bg-slate-200" />
          <Link href="/portal/login" className="hidden sm:block px-4 py-2 rounded-xl font-semibold text-base text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-all">
            Sign In
          </Link>
        </nav>

        {/* Always visible Action & Hamburger (Hamburger hides on lg) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link href="/portal/register">
            <Button className="h-9 sm:h-10 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 px-4 sm:px-6 lg:px-8 font-semibold text-base shadow-sm hover:shadow-md transition-all duration-300">
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

      </div>

      {/* Dynamic Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col origin-top animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-4 flex flex-col gap-1">
            <Link href="/#features" className="flex lg:hidden items-center justify-between px-4 py-4 rounded-xl text-base font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-200/70 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Features</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link href="/#pricing" className="flex lg:hidden items-center justify-between px-4 py-4 rounded-xl text-base font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-200/70 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Pricing</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link href="/about" className="flex md:hidden items-center justify-between px-4 py-4 rounded-xl text-base font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-200/70 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
              <span>About</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link href="/contact" className="flex md:hidden items-center justify-between px-4 py-4 rounded-xl text-base font-semibold text-slate-700 hover:text-emerald-600 hover:bg-slate-200/70 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
              <span>Contact</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>
          
          <div className="px-6 pb-6 pt-4 bg-slate-50/50 border-t border-slate-100 md:hidden">
            <Link href="/portal/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-sm border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-emerald-100/70 hover:border-emerald-200 transition-all">
                Sign In to Portal
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
