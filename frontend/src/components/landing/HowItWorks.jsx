"use client";
import React, { useEffect, useRef, useState } from 'react';
import { UserPlus, PackagePlus, ArrowRightLeft, TrendingUp } from 'lucide-react';

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  const steps = [
    {
      num: "01",
      icon: UserPlus,
      title: "Create Account",
      desc: "Sign up in seconds and get instant access to your personalized trading dashboard.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      num: "02",
      icon: PackagePlus,
      title: "Add Inventory",
      desc: "Input your agricultural products, set pricing, and establish baseline stock levels.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      num: "03",
      icon: ArrowRightLeft,
      title: "Record Trades",
      desc: "Log your purchases from suppliers and sales to customers effortlessly.",
      color: "text-violet-500",
      bg: "bg-violet-500/10"
    },
    {
      num: "04",
      icon: TrendingUp,
      title: "Grow Profits",
      desc: "Use our real-time analytics to understand trends, reduce waste, and increase margins.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 lg:py-16 relative overflow-hidden bg-slate-50 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-800">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
        {/* Premium Header */}
        <div className="mb-10 lg:mb-12 flex flex-col items-center text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl lg:text-5xl tracking-tighter leading-[1.1] mb-4">
            How <span className="text-transparent bg-clip-text bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-700">ATMS</span> Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-medium max-w-2xl mx-auto">
            Streamlining your agricultural trading business is as simple as following these four straightforward steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative group/grid">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-[45px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent -z-10" />

          {steps.map((step, index) => (
            <div 
              key={step.num} 
              className="relative p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden group backdrop-blur-sm"
            >
              {/* Massive Watermark Number */}
              <div 
                className={`absolute -right-4 -bottom-6 text-[120px] font-black leading-none pointer-events-none select-none transition-all duration-1000 ${
                  isVisible 
                    ? 'text-emerald-700/20 dark:text-emerald-400/20 opacity-100 animate-pulse' 
                    : 'text-slate-50 dark:text-slate-800/30 opacity-0 translate-y-8'
                } group-hover:text-emerald-500 dark:group-hover:text-emerald-500 group-hover:animate-none group-hover:opacity-100 group-hover/grid:[animation-play-state:paused]`}
                style={{ 
                  animationDelay: `${index * 600}ms`,
                  animationDuration: '3s'
                }}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                <step.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-sm font-bold text-teal-600 dark:text-teal-400 mb-2 tracking-wider uppercase">
                  Step {step.num}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
