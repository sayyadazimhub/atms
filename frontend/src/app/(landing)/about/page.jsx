import React from 'react';


import { Shield, Target, Users, Zap, Sprout, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import CtaBanner from '@/components/landing/CtaBanner';

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
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      desc: 'We prioritize the security and integrity of your trading data, ensuring your business information is always protected.',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Users,
      title: 'Community First',
      desc: 'Built with traders, for traders. We constantly evolve our platform based on real feedback from our community.',
      color: 'bg-violet-100 text-violet-600',
    },
    {
      icon: Zap,
      title: 'Innovation',
      desc: 'Bringing modern technology to traditional trading. We believe in fast, reliable, and forward-thinking solutions.',
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <>

      <main>
        {/* Hero Section */}
        <section className="relative flex items-center justify-center pt-32 pb-24 lg:pt-40 lg:pb-32 px-4 overflow-hidden bg-white border-b border-slate-200">
          
          {/* Abstract Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Animated Glowing Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-emerald-400/20 rounded-full blur-[80px] lg:blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-teal-400/20 rounded-full blur-[80px] lg:blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
          </div>

          {/* Centered Content */}
          <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-emerald-200 backdrop-blur-md shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              About Our Company
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-8">
              Empowering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Future of Trading</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
              ATMS was founded with a simple goal: to make agricultural trading management straightforward, efficient, and accessible to everyone.
            </p>
          </div>
        </section>

        {/* Story Section matching Homepage Features layout */}
        <section className="flex items-center py-12 lg:py-16 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
              <div className="max-w-xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-slate-600 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-6 border border-slate-200/50 shadow-sm backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Our Story
                </div>
                <h2 className="text-4xl font-black text-slate-900 sm:text-5xl lg:text-6xl tracking-tighter leading-[1.1] mb-6">
                  Born from <br className="hidden xl:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Real Frustration.</span>
                </h2>
                <p className="text-slate-600 text-sm md:text-base font-medium mb-6 leading-relaxed">
                  Agricultural trading is the backbone of our economy, yet many traders still rely on outdated methods like pen and paper or complex, clunky software to manage their daily operations. We saw the frustration firsthand.
                </p>
                <p className="text-slate-600 text-sm md:text-base font-medium mb-6 leading-relaxed">
                  That&apos;s why we created <strong>ATMS (Agricultural Trading Management System)</strong>. We brought together industry experts and top-tier engineers to build a solution that is powerful enough to handle complex inventory and accounting, yet simple enough to use every day without a steep learning curve.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {[
                    "Built by Traders",
                    "Simple & Intuitive",
                  ].map((badge) => (
                    <div key={badge} className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {badge}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group w-full aspect-square md:aspect-[4/3] border border-slate-200/50">
                {/* Main Image */}
                <img 
                  src="/images/about-story.jpg" 
                  alt="Modern Agricultural Trading Operations" 
                  className="max-w-7xl mx-auto h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Glassmorphic Stat Card */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-64 bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-xl flex items-center gap-4 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-inner">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 leading-none tracking-tight mb-1">500+</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Traders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section matching Homepage Features layout */}
        <section className="flex items-center py-12 lg:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="mb-12 lg:mb-16 flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-6 border border-emerald-200/50 shadow-sm backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Principles
              </div>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl tracking-tighter leading-[1.1] mb-4">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700">Core Values</span>
              </h2>
              <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl mx-auto">
                The principles that drive every decision we make and every feature we build.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="group p-8 rounded-3xl border border-slate-200 bg-white hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col h-full"
                >
                  <div className={`inline-flex p-4 rounded-2xl ${item.color} transition-transform duration-300 group-hover:scale-110 shrink-0 w-max mb-6`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Central CTA Component */}
        <CtaBanner />

      </main>

    </>
  );
}
