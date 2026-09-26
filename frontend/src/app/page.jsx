import Link from 'next/link';
import { Package, TrendingUp, BarChart3, Users, Truck, ShoppingCart, ArrowRight, CheckCircle2, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import AppPreview from '@/components/landing/AppPreview';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Benefits from '@/components/landing/Benefits';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import CtaBanner from '@/components/landing/CtaBanner';
// import prisma from '@/lib/prisma'; // Removed direct DB access
import Navbar from '@/components/landing/Navbar';

export default async function HomePage() {
  let displayCount = 200;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/settings/public`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.activeTraders) displayCount = data.activeTraders;
    }
  } catch (err) {
    console.error('Failed to fetch settings', err);
  }


  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
        {/* Floating Icons for Depth */}
        <div className="absolute top-20 left-[15%] opacity-20 animate-pulse">
          <ShoppingCart className="h-12 w-12 text-emerald-400/40 rotate-12" />
        </div>
        <div className="absolute bottom-20 right-[15%] opacity-20 animate-pulse delay-700">
          <BarChart3 className="h-12 w-12 text-blue-400/40 -rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-1.5 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 mb-8 uppercase tracking-wider md:tracking-[0.2em] shadow-xl">
              <Users className="h-3.5 w-3.5 text-emerald-500" />
              Trusted by {displayCount}+ Professional Traders
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
                "Enterprise-Grade Security",
                "Instant Dashboard Setup",
                "24/7 Dedicated Support"
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

      <AppPreview />

      <Features />

      <HowItWorks />

      <Benefits />

      <Testimonials />
      <Pricing />
      <FAQ />
      <CtaBanner />

      {/* Professional Footer */}
      <Footer />
    </div>
  );
}
