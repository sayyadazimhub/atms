import React from 'react';

export default function AppPreview() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl tracking-tight mb-4">
            See Your Business <span className="text-emerald-600 dark:text-emerald-400">At A Glance</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Our intuitive dashboard puts everything you need front and center. Monitor inventory, track sales, and analyze profits in real-time.
          </p>
        </div>

        {/* Browser/Dashboard Mockup */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden max-w-5xl mx-auto ring-1 ring-slate-900/5 dark:ring-white/10">
          {/* Mockup Header */}
          <div className="h-12 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-6 w-1/3 rounded text-[10px] flex items-center justify-center text-slate-500 font-mono">
              atms-premium.com/dashboard
            </div>
          </div>
          
          {/* Mockup Body */}
          <div className="flex min-h-[400px]">
            {/* Sidebar */}
            <div className="w-48 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 hidden md:block">
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`h-8 rounded-lg ${i === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 dark:bg-slate-900/50'}`} />
                ))}
              </div>
            </div>
            {/* Main Content Area */}
            <div className="flex-1 p-6 bg-white dark:bg-slate-900">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                 {/* Stat Cards */}
                 {[
                   { label: "Total Revenue", val: "₹1,24,500", inc: "+12.5%", color: "text-emerald-600 dark:text-emerald-400" },
                   { label: "Total Profit", val: "₹45,200", inc: "+8.2%", color: "text-emerald-600 dark:text-emerald-400" },
                   { label: "Low Stock Items", val: "12", inc: "-2.4%", color: "text-rose-600 dark:text-rose-400" }
                 ].map((stat, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{stat.label}</div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">{stat.val}</div>
                      <div className={`text-xs font-semibold ${stat.color}`}>{stat.inc} this week</div>
                    </div>
                 ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 h-64 p-4 relative overflow-hidden flex flex-col justify-end">
                   <div className="text-sm font-semibold text-slate-500 absolute top-4 left-4 uppercase tracking-wider">Sales Overview</div>
                   {/* Abstract chart bars */}
                   <div className="flex items-end gap-2 h-40 w-full justify-around mt-8 px-2">
                     {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                        <div key={i} className="w-1/12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-t-md relative h-full flex items-end">
                           <div className="w-full bg-emerald-500 rounded-t-md transition-all duration-1000" style={{ height: `${h}%` }}></div>
                        </div>
                     ))}
                   </div>
                </div>
                <div className="col-span-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 h-64 p-4">
                   <div className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-wider">Recent Activity</div>
                   <div className="space-y-4">
                     {[...Array(4)].map((_, i) => (
                       <div key={i} className="flex gap-3 items-center">
                         <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
                         <div className="space-y-2 flex-1">
                           <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                           <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
