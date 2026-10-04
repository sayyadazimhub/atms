import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-12 lg:py-20 relative overflow-hidden bg-slate-950 border-t border-slate-900 flex flex-col justify-center">
      {/* Massive Central Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4 leading-[1.1]">
          Scale Your Trade<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300"> Today.</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base mb-10 max-w-md mx-auto font-medium">
          Join thousands of traders automating their inventory and maximizing profit instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link href="/portal/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-xl bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all duration-300 font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-emerald-500/20 border-0 group">
              Create Free Account
              <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1 text-emerald-600" />
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-xl bg-transparent text-white border-slate-700 hover:bg-slate-800 hover:text-white hover:scale-105 transition-all duration-300 font-bold uppercase tracking-[0.2em] text-[11px]">
              Contact Us
            </Button>
          </Link>
        </div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.1em]">
          No credit card required
        </p>
      </div>
    </section>
  );
}
