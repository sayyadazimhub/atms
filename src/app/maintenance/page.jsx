'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings2, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MaintenancePage() {
  const [isReloading, setIsReloading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center p-8 max-w-2xl">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
          <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center relative shadow-2xl">
            <Settings2 className="w-12 h-12 text-emerald-400 animate-[spin_4s_linear_infinite]" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          System Maintenance
        </h1>
        
        <p className="text-slate-400 text-lg mb-10 max-w-lg leading-relaxed">
          We are currently performing scheduled maintenance to upgrade our systems and improve your experience. We will be back online shortly.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a href="/user/login" onClick={() => setIsReloading(true)}>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 h-12 px-8 rounded-full text-base font-medium shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_60px_rgba(16,185,129,0.4)] flex items-center gap-2">
              <RefreshCcw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </a>
          
          <Link href="/">
            <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 h-12 px-8 rounded-full text-base font-medium transition-all flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
