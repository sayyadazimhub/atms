import React from 'react';


import { Shield, Target, Users, Zap, Sprout, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const metadata = {
  title: 'About Us - ATMS',
  description: 'Learn about ATMS and our mission to simplify agricultural trading.',
};

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'To empower agricultural traders with intuitive, powerful tools that simplify their daily operations and scale their businesses.',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      desc: 'We prioritize the security and integrity of your trading data, ensuring your business information is always protected.',
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      icon: Users,
      title: 'Community First',
      desc: 'Built with traders, for traders. We constantly evolve our platform based on real feedback from our community.',
      color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    },
    {
      icon: Zap,
      title: 'Innovation',
      desc: 'Bringing modern technology to traditional trading. We believe in fast, reliable, and forward-thinking solutions.',
      color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
  ];

  return (
    <>

      <main>
        {/* Hero Section matching Homepage layout */}
        <section className="relative min-h-[calc(100vh-64px)] flex items-center border-b border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 py-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* Floating Icons for Depth */}
          <div className="absolute top-20 left-[15%] opacity-20 animate-pulse hidden md:block">
            <Sprout className="h-12 w-12 text-emerald-400/40 rotate-12" />
          </div>
          <div className="absolute bottom-40 right-[15%] opacity-20 animate-pulse delay-700 hidden md:block">
            <Users className="h-12 w-12 text-blue-400/40 -rotate-12" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center w-full">
            <div className="max-w-4xl mx-auto">
              
              {/* Badge matching homepage */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md px-4 py-1.5 text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 mb-8 uppercase tracking-wider md:tracking-[0.2em] shadow-xl">
                <Sprout className="h-3.5 w-3.5 text-emerald-500" />
                About Our Company
              </div>

              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 sm:text-6xl leading-[1.1] tracking-tight">
                Empowering the <br />
                <span className="text-emerald-600 dark:text-emerald-400">Future of Trading</span>
              </h1>
              
              <p className="mt-8 text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium mb-12">
                ATMS was founded with a simple goal: to make agricultural trading management straightforward, efficient, and accessible to everyone.
              </p>

              <div className="relative mx-auto max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 group">
                <Image 
                  src="/images/about-hero.jpg" 
                  alt="Agricultural Trading Management" 
                  width={1200} 
                  height={600} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Story Section matching Homepage Features layout */}
        <section className="min-h-[50vh] flex items-center py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="max-w-xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                  Our Story
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 sm:text-4xl sm:leading-tight tracking-tight mb-6">
                  Born from <br className="hidden xl:block" />
                  <span className="text-emerald-600 dark:text-emerald-400">Real Frustration.</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-6 leading-relaxed">
                  Agricultural trading is the backbone of our economy, yet many traders still rely on outdated methods like pen and paper or complex, clunky software to manage their daily operations. We saw the frustration firsthand.
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-6 leading-relaxed">
                  That's why we created <strong>ATMS (Agricultural Trading Management System)</strong>. We brought together industry experts and top-tier engineers to build a solution that is powerful enough to handle complex inventory and accounting, yet simple enough to use every day without a steep learning curve.
                </p>
                
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {[
                    "Built by Traders",
                    "Simple & Intuitive",
                  ].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Today, ATMS is helping professionals:</h3>
                  <ul className="space-y-6">
                    {[
                      "Streamline their stock management.",
                      "Organize and track all payments.",
                      "Grow trading businesses with absolute confidence."
                    ].map((item, idx) => (
                       <li key={idx} className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium text-lg leading-tight mt-2">{item}</p>
                       </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section matching Homepage Features layout */}
        <section className="min-h-[70vh] flex items-center py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl tracking-tight mb-4">
                Our <span className="text-emerald-600 dark:text-emerald-400">Core Values</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                The principles that drive every decision we make and every feature we build.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="group p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col h-full"
                >
                  <div className={`inline-flex p-4 rounded-2xl ${item.color} transition-transform duration-300 group-hover:scale-110 shrink-0 w-max mb-6`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA matching Homepage exactly */}
        <section className="py-24 bg-slate-900 dark:bg-slate-950 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/20" />
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Ready to scale your business?</h2>
            <p className="text-slate-300 mb-10 text-xl font-medium">Join the traders who are already using ATMS to manage their daily operations.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/trader/register" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 w-full group">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl border-slate-700 text-white hover:bg-slate-800 font-bold uppercase tracking-widest transition-all bg-transparent w-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

    </>
  );
}
