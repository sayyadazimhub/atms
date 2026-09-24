import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Package, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Benefits() {
  const benefits = [
    'Real-time inventory tracking',
    'Automated profit calculations',
    'Payment & due management',
    'Comprehensive reporting',
    'Multi-user support',
    'Mobile responsive design',
  ];

  return (
    <section className="min-h-screen flex items-center py-24 bg-white dark:bg-slate-900 relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="w-full">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                Built For You
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-5xl leading-tight tracking-tight">
                Built for <span className="text-emerald-600 dark:text-emerald-400">Modern Trading</span>
              </h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                ATMS provides all the tools you need to run your agricultural trading business efficiently, profitably, and without the headaches of manual record-keeping.
              </p>
              
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-4 group">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm group-hover:border-emerald-500/50 transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-12">
                <Link href="/user/register">
                  <Button size="lg" className="h-14 px-8 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white transition-all shadow-xl shadow-slate-900/10 font-bold uppercase tracking-widest text-sm">
                    Start Now For Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative mt-12 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 blur-3xl rounded-[3rem] -z-10" />
              <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-2xl relative overflow-hidden">
                <div className="space-y-4">
                  {[
                    { label: "Total Stock Value", val: "₹2,45,000", color: "blue", icon: Package },
                    { label: "Today's Gross Profit", val: "₹45,230", color: "emerald", icon: TrendingUp },
                    { label: "Pending Receivables", val: "₹12,500", color: "violet", icon: Users }
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-md cursor-default group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-950 text-emerald-500 border border-slate-200 dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform">
                          <stat.icon size={20} />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">{stat.label}</span>
                      </div>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
