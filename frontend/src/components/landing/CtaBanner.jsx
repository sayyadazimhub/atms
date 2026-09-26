import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section className="py-24 relative overflow-hidden bg-emerald-600">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-emerald-400/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-emerald-800/30 rounded-full blur-[100px]" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
          Ready to Transform Your Trading Business?
        </h2>
        <p className="text-emerald-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
          Join thousands of agricultural traders who have already streamlined their inventory, automated their profit tracking, and scaled their operations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/user/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-14 px-8 rounded-xl bg-white text-emerald-700 hover:bg-slate-50 hover:scale-105 transition-all duration-300 font-bold uppercase tracking-widest text-sm shadow-xl shadow-emerald-900/20 border-0">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-emerald-100 text-sm sm:hidden mt-4">No credit card required</p>
        </div>
        <p className="hidden sm:block text-emerald-100 text-sm mt-6 font-medium">No credit card required. Instant access.</p>
      </div>
    </section>
  );
}
