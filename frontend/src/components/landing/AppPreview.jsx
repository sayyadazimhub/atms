import React from 'react';
import { LayoutDashboard, Users, Package, Wallet, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function AppPreview() {
  return (
    <section className="py-12 lg:py-16 relative overflow-hidden bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8 lg:mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 sm:text-4xl lg:text-5xl tracking-tight mb-4 leading-tight">
            See Your Business <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">At A Glance</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-medium max-w-xl mx-auto">
            Our intuitive dashboard puts everything you need front and center. Monitor inventory, track sales, and analyze profits in real-time.
          </p>
        </div>

        {/* Browser/Dashboard Mockup */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden max-w-5xl mx-auto ring-4 ring-slate-900/5 dark:ring-white/5 group transform transition-all hover:-translate-y-1 duration-700">
          
          {/* macOS-style Header */}
          <div className="h-10 sm:h-12 border-b border-slate-200/50 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center px-4 justify-between relative">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90 shadow-sm" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90 shadow-sm" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 shadow-sm" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-6 w-48 sm:w-64 rounded-md text-[10px] flex items-center justify-center text-slate-500 font-mono shadow-sm">
              <span className="text-slate-400 mr-1">🔒</span> app.atms.com
            </div>
          </div>
          
          {/* Mockup Body - Fixed height with internal scroll to save screen space */}
          <div className="flex flex-col md:flex-row bg-white dark:bg-slate-900 h-[350px] lg:h-[450px]">
            {/* Sidebar */}
            <div className="w-56 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-3 hidden md:flex flex-col gap-1 overflow-y-auto">
              <div className="flex items-center gap-3 px-2 py-3 mb-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs">A</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white tracking-tight text-sm">ATMS Pro</div>
              </div>
              
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm border border-emerald-500/20 text-sm">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-sm">
                <Package className="h-4 w-4" />
                <span>Inventory</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-sm">
                <Users className="h-4 w-4" />
                <span>Customers</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-sm">
                <Wallet className="h-4 w-4" />
                <span>Transactions</span>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-5 lg:p-6 relative overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex justify-between items-end mb-4 sm:mb-5 relative z-10">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Welcome back, Admin</h3>
                  <p className="text-slate-500 text-xs mt-1">Here's what's happening with your store today.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5 relative z-10">
                 {/* Stat Cards */}
                 {[
                   { label: "Total Revenue", val: "₹1,24,500", inc: "+12.5%", trend: "up" },
                   { label: "Net Profit", val: "₹45,200", inc: "+8.2%", trend: "up" },
                   { label: "Pending Orders", val: "12", inc: "-2.4%", trend: "down" }
                 ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <div className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                        <div className={`p-1 rounded-md ${stat.trend === 'up' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600'}`}>
                          {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{stat.val}</div>
                      <div className={`text-[10px] sm:text-xs font-semibold ${stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {stat.inc} <span className="text-slate-400 font-medium">vs last week</span>
                      </div>
                    </div>
                 ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 relative z-10">
                {/* Chart Area */}
                <div className="col-span-2 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex flex-col justify-between shadow-sm min-h-[160px] sm:min-h-[180px]">
                   <div className="flex justify-between items-center mb-3 sm:mb-4">
                     <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Revenue Overview</div>
                     <div className="text-[9px] sm:text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-full">This Week</div>
                   </div>
                   {/* Abstract chart bars */}
                   <div className="flex items-end gap-2 h-full w-full justify-between mt-2">
                     {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                        <div key={i} className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-t-lg relative h-full flex items-end overflow-hidden group-hover:bg-slate-200 dark:group-hover:bg-slate-800 transition-colors">
                           <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-1000 delay-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]" style={{ height: `${h}%` }}></div>
                        </div>
                     ))}
                   </div>
                </div>

                {/* Activity List */}
                <div className="col-span-1 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm overflow-hidden flex flex-col">
                   <div className="text-xs font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Recent Activity</div>
                   <div className="space-y-3 sm:space-y-4 flex-1">
                     {[
                       { title: "New order received", time: "2 min ago", icon: Package, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" },
                       { title: "Payment cleared", time: "1 hr ago", icon: Wallet, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30" },
                       { title: "Stock alert: Wheat", time: "3 hrs ago", icon: Activity, color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30" },
                     ].map((item, i) => (
                       <div key={i} className="flex gap-3 items-center">
                         <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                           <item.icon className="h-3 w-3" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</div>
                           <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">{item.time}</div>
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
