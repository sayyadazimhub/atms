'use client';

import Link from 'next/link';
import { Package, TrendingUp, BarChart3, Users, Truck, ShoppingCart, ArrowRight, CheckCircle2, Sprout, Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    {
      icon: Package,
      title: 'Inventory Management',
      desc: 'Track stock levels with automatic updates and low-stock alerts',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Sales & Purchases',
      desc: 'Record transactions with profit calculation and payment tracking',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      desc: 'Comprehensive insights with daily, monthly, and yearly analytics',
      color: 'bg-violet-100 text-violet-600',
    },
    {
      icon: Users,
      title: 'Customer Management',
      desc: 'Manage customers with transaction history and due tracking',
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Truck,
      title: 'Supplier Management',
      desc: 'Track providers and suppliers with purchase records',
      color: 'bg-rose-100 text-rose-600',
    },
    {
      icon: ShoppingCart,
      title: 'Transaction History',
      desc: 'Complete audit trail of all sales and purchase activities',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  const benefits = [
    'Real-time inventory tracking',
    'Automated profit calculations',
    'Payment & due management',
    'Comprehensive reporting',
    'Multi-user support',
    'Mobile responsive design',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-950 text-white shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
              <Sprout className="h-6 w-6 text-emerald-400 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase">ATMS</span>
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mt-1">Premium</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/user/login">
              <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase tracking-widest text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                Sign In
              </Button>
            </Link>
            <Link href="/user/register">
              <Button className="h-10 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white px-6 font-bold uppercase tracking-widest text-xs shadow-md">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
        {/* Floating Icons for Depth */}
        <div className="absolute top-20 left-[15%] opacity-20 animate-pulse">
          <ShoppingCart className="h-12 w-12 text-emerald-400/40 rotate-12" />
        </div>
        <div className="absolute bottom-20 right-[15%] opacity-20 animate-pulse delay-700">
          <BarChart3 className="h-12 w-12 text-blue-400/40 -rotate-12" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-1.5 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 mb-8 uppercase tracking-wider md:tracking-[0.2em] shadow-xl">
              <Users className="h-3.5 w-3.5 text-emerald-500" />
              Trusted by 100+ Professional Traders
              {/* Agricultural Trading Made Simple */}
            </div>

            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50 sm:text-6xl leading-[1.1] tracking-tight">
              Professional Tools for <br />
              <span className="text-emerald-600 dark:text-emerald-400">Trading Business Success</span>
            </h2>
            <p className="mt-8 text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
              Join the elite club of traders who have scaled their operations with ATMS. Get started with professional tools in seconds...
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/user/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white w-full font-bold uppercase tracking-widest transition-all group border-0 shadow-lg shadow-emerald-500/10">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/user/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="h-12 px-6 rounded-xl border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 w-full font-bold uppercase tracking-widest transition-all">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {[
                "No Credit Card Required",
                "Instant Dashboard Setup",
                "Enterprise-Grade Security"
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="min-h-screen flex items-center py-20 border-b">
        <div className="container mx-auto px-4">
          <div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          >
            {features.map((item) => (
              <div
                key={item.title}
                className="group p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 hover:bg-slate-50/10 dark:hover:bg-slate-800/10 transition-all duration-300 shadow-sm"
              >
                <div className={`inline-flex p-4 rounded-2xl ${item.color.replace('bg-', 'dark:bg-opacity-20 bg-').replace('text-', 'dark:text- opacity-100 text-')} mb-6`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="min-h-screen flex items-center py-20 bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden border-t border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl leading-tight">
                  Built for <span className="text-emerald-600 dark:text-emerald-400">Modern Trading</span>
                </h2>
                <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  ATMS provides all the tools you need to run your agricultural trading business efficiently and profitably.
                </p>
                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  {benefits.map((benefit, i) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-4 group"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-base font-semibold text-slate-700 dark:text-slate-300">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-12">
                  <Link href="/user/register">
                    <Button size="lg" className="h-12 px-8 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white transition-all shadow-md">
                      Get Started Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 blur-3xl rounded-[3rem] -z-10" />
                <div className="rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl relative overflow-hidden">
                  <div className="space-y-4">
                    {[
                      { label: "Stock Value", val: "₹2,45,000", color: "blue", icon: Package },
                      { label: "Gross Profit", val: "₹45,230", color: "emerald", icon: TrendingUp },
                      { label: "Receivables", val: "₹12,500", color: "violet", icon: Users }
                    ].map((stat, i) => (
                      <div
                        key={stat.label}
                        className={`flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 transition-all cursor-default`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-white dark:bg-slate-800 text-emerald-500 border border-slate-100 dark:border-slate-700 shadow-sm`}>
                            <stat.icon size={20} />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{stat.label}</span>
                        </div>
                        <span className={`text-lg font-black text-emerald-600 dark:text-emerald-400`}>{stat.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-slate-950 text-slate-400 py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2 max-w-7xl mx-auto">
            {/* Branding Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <Sprout className="h-6 w-6 relative z-10" />
                </div>
                <span className="text-2xl font-black text-white tracking-tight leading-none uppercase">ATMS</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Empowering agricultural traders with professional management tools for stock, sales, and analytics.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { Icon: Github, href: "https://github.com/sayyadazimhub" },
                  { Icon: Twitter, href: "https://x.com/azimxsayyad" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/in/sayyadazimmern/" }
                ].map((social, i) => (
                  <Link key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-white/5 hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
                    <social.Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Dashboard", "Updates"]
              },
              {
                title: "Company",
                links: ["About Us", "Contact", "Careers", "Blog"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "Privacy Policy", "Terms of Service"]
              }
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm hover:text-emerald-400 transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto text-sm">
            <p>© 2026 ATMS Premium. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-emerald-400 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
