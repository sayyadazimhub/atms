import React from 'react';
import { Package, TrendingUp, BarChart3, Users, Truck, ShoppingCart } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Package,
      title: 'Inventory Management',
      desc: 'Track stock levels with automatic updates and low-stock alerts',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: TrendingUp,
      title: 'Sales & Purchases',
      desc: 'Record transactions with profit calculation and payment tracking',
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      desc: 'Comprehensive insights with daily, monthly, and yearly analytics',
      color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    },
    {
      icon: Users,
      title: 'Customer Management',
      desc: 'Manage customers with transaction history and due tracking',
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      icon: Truck,
      title: 'Supplier Management',
      desc: 'Track providers and suppliers with purchase records',
      color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    },
    {
      icon: ShoppingCart,
      title: 'Transaction History',
      desc: 'Complete audit trail of all sales and purchase activities',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
  ];

  return (
    <section className="min-h-screen flex items-center py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl tracking-tight mb-4">
            Everything You Need To <span className="text-emerald-600 dark:text-emerald-400">Run Your Trade</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            A comprehensive suite of tools built specifically for the daily demands of agricultural trading.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => (
            <div
              key={item.title}
              className="group p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`inline-flex p-3 rounded-2xl ${item.color} transition-transform duration-300 group-hover:scale-110 shrink-0`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
