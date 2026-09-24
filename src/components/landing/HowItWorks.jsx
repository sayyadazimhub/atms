import React from 'react';
import { UserPlus, PackagePlus, ArrowRightLeft, TrendingUp } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Create Account",
      desc: "Sign up in seconds and get instant access to your personalized trading dashboard."
    },
    {
      icon: PackagePlus,
      title: "2. Add Inventory",
      desc: "Input your agricultural products, set pricing, and establish baseline stock levels."
    },
    {
      icon: ArrowRightLeft,
      title: "3. Record Trades",
      desc: "Log your purchases from suppliers and sales to customers effortlessly."
    },
    {
      icon: TrendingUp,
      title: "4. Grow Profits",
      desc: "Use our real-time analytics to understand trends, reduce waste, and increase margins."
    }
  ];

  return (
    <section className="py-24 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl tracking-tight mb-4">
            How <span className="text-emerald-600 dark:text-emerald-400">ATMS</span> Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Streamlining your agricultural trading business is as simple as following these four straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Hidden on Mobile) */}
          <div className="hidden lg:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-500 to-emerald-100 dark:from-emerald-900/30 dark:via-emerald-500/50 dark:to-emerald-900/30 -z-10" style={{ left: '12%', right: '12%' }} />
          
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-950 shadow-xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 group-hover:border-emerald-100 dark:group-hover:border-emerald-900/30 transition-all duration-300">
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                <step.icon className="h-10 w-10 text-emerald-600 dark:text-emerald-400 relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm max-w-[250px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
