import { Sprout, ShoppingCart, BarChart3, Users, LineChart, Package, TrendingUp, Activity, Headset } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function AuthLayout({ children }) {
  const traderCount = await prisma.user.count({ where: { role: 'USER', is_active: true } });
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Branding Side (Left) */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 flex-col items-center justify-center p-12 relative overflow-hidden border-r border-slate-800 text-left">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-blue-900/40" />
        
        {/* Floating elements & Icons for Depth */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        
        <div className="absolute top-20 left-12 animate-pulse opacity-60">
          <ShoppingCart className="h-16 w-16 text-emerald-500/20 rotate-12" />
        </div>
        <div className="absolute top-32 right-16 animate-pulse delay-500 opacity-60">
          <LineChart className="h-20 w-20 text-emerald-400/10 -rotate-12" />
        </div>
        <div className="absolute bottom-32 left-16 animate-pulse delay-1000 opacity-60">
          <Package className="h-24 w-24 text-emerald-500/10 rotate-45" />
        </div>
        <div className="absolute bottom-20 right-16 animate-pulse delay-700 opacity-60">
          <BarChart3 className="h-16 w-16 text-blue-400/20 -rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-6 max-w-xl animate-in fade-in zoom-in-95 duration-1000 w-full">
          
          {/* Brand & Title */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                <Sprout className="h-7 w-7" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
                ATMS <span className="text-emerald-500">Premium</span>
              </h1>
            </div>
            
            <p className="text-slate-400 text-lg font-medium leading-relaxed w-full">
              Professional tools for your trading business. Streamline operations with comprehensive inventory tracking, sales management, and real-time analytics.
            </p>
          </div>

          {/* Feature List */}
          <div className="flex flex-col gap-4 w-full">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-5 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 w-full hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-950/50 border border-emerald-900/50 text-emerald-500">
                <Package className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-base">Inventory Management</h3>
                <p className="text-slate-400 text-sm">Track stock levels with automatic updates and low-stock alerts.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-5 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 w-full hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-950/50 border border-emerald-900/50 text-emerald-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-base">Sales & Purchases</h3>
                <p className="text-slate-400 text-sm">Record transactions with profit calculation and payment tracking.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-5 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 w-full hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-950/50 border border-emerald-900/50 text-emerald-500">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-base">Analytics & Reports</h3>
                <p className="text-slate-400 text-sm">Comprehensive insights with daily, monthly, and yearly analytics.</p>
              </div>
            </div>

          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-row items-center justify-start gap-3 backdrop-blur-sm transition-colors hover:bg-white/10">
              <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white tracking-tight">{traderCount}+</h3>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Traders</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-row items-center justify-start gap-3 backdrop-blur-sm transition-colors hover:bg-white/10">
              <div className="h-10 w-10 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white tracking-tight">99.9%</h3>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">Uptime</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-row items-center justify-start gap-3 backdrop-blur-sm transition-colors hover:bg-white/10">
              <div className="h-10 w-10 shrink-0 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Headset className="h-5 w-5 text-violet-400" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white tracking-tight">24/7</h3>
                <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mt-0.5">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side (Form) */}
      {children}
    </div>
  );
}
