import React from 'react';
import { Package, TrendingUp, BarChart3, Users, Truck, ShoppingCart } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Package,
      title: 'Inventory Management',
      desc: 'Track stock levels with automatic updates and low-stock alerts. Never run out of your most important agricultural goods.',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      glow: 'group-hover:bg-blue-500/5',
      borderGlow: 'group-hover:border-blue-500/50',
    },
    {
      icon: TrendingUp,
      title: 'Sales & Purchases',
      desc: 'Record every transaction accurately. Instantly calculate profits, track payment statuses, and maintain perfect ledgers.',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      glow: 'group-hover:bg-emerald-500/5',
      borderGlow: 'group-hover:border-emerald-500/50',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      desc: 'Get comprehensive insights into your business health with beautiful daily, monthly, and yearly analytics dashboards.',
      iconBg: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
      glow: 'group-hover:bg-violet-500/5',
      borderGlow: 'group-hover:border-violet-500/50',
    },
    {
      icon: Users,
      title: 'Customer Management',
      desc: 'Build strong relationships. Track individual customer transaction histories, pending dues, and bulk order patterns.',
      iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      glow: 'group-hover:bg-amber-500/5',
      borderGlow: 'group-hover:border-amber-500/50',
    },
    {
      icon: Truck,
      title: 'Supplier Management',
      desc: 'Manage your entire supply chain effortlessly. Keep detailed records of providers, suppliers, and purchase history.',
      iconBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
      glow: 'group-hover:bg-rose-500/5',
      borderGlow: 'group-hover:border-rose-500/50',
    },
    {
      icon: ShoppingCart,
      title: 'Complete Audit Trail',
      desc: 'Every action is securely recorded. Maintain a complete, unalterable history of all your sales and purchase activities.',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      glow: 'group-hover:bg-indigo-500/5',
      borderGlow: 'group-hover:border-indigo-500/50',
    },
  ];

  return (
    <section id="features" className="py-12 lg:py-16 relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col justify-center min-h-[auto] xl:min-h-screen">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        <div className="mb-12 lg:mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-950/50 text-slate-600 dark:text-slate-300 text-[11px] font-bold uppercase tracking-[0.2em] mb-6 border border-slate-200/50 dark:border-slate-800 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Powerful Features
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl lg:text-5xl tracking-tighter leading-[1.1]">
            Everything You Need To <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700">Run Your Trade.</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <div
              key={item.title}
              className={`group relative p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 overflow-hidden transition-all duration-500 ${item.borderGlow} shadow-sm hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Dynamic Background Hover Glow */}
              <div className={`absolute inset-0 transition-colors duration-500 ${item.glow} pointer-events-none opacity-0 group-hover:opacity-100`} />
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl ${item.iconBg} mb-4 transition-transform duration-500 group-hover:scale-110 shadow-sm`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
