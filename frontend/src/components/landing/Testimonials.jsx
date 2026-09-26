"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!scrollRef.current || isHovering) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const { scrollLeft: currentScroll, scrollWidth, clientWidth } = scrollRef.current;
      if (currentScroll <= 10) {
        scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const { scrollLeft: currentScroll, scrollWidth, clientWidth } = scrollRef.current;
      if (currentScroll + clientWidth >= scrollWidth - 10) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
      }
    }
  };

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Wholesale Grain Trader",
      text: "ATMS completely transformed how I track my inventory. I used to rely on notebooks, but now I know my exact stock value and profits at any given second.",
      initials: "RK"
    },
    {
      name: "Amit Patel",
      role: "Agri-Inputs Supplier",
      text: "The payment tracking feature is a lifesaver. I no longer have to manually chase down pending payments from customers. It's all perfectly organized on the dashboard.",
      initials: "AP"
    },
    {
      name: "Amit Patel",
      role: "Agri-Inputs Supplier",
      text: "The payment tracking feature is a lifesaver. I no longer have to manually chase down pending payments from customers. It's all perfectly organized on the dashboard.",
      initials: "AP"
    },
    {
      name: "Amit Patel",
      role: "Agri-Inputs Supplier",
      text: "Th is very usefull",
      initials: "AP"
    },
    {
      name: "Suresh Reddy",
      role: "Fresh Produce Distributor",
      text: "I was hesitant to switch to software, but the interface is incredibly simple. It took me less than 10 minutes to understand the system and start adding my stock.",
      initials: "SR"
    }
  ];

  return (
    <section className="py-24 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              Success Stories
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 sm:text-5xl sm:leading-tight tracking-tight mb-6">
              Empowering Traders <br className="hidden xl:block" />
              <span className="text-emerald-600 dark:text-emerald-400">Every Single Day.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed max-w-lg">
              Join the growing community of agricultural wholesalers and distributors who have transformed their operations, scaled their profits, and taken control of their inventory with ATMS.
            </p>

            {/* Social Proof Stats */}
            <div className="mb-10 grid grid-cols-2 gap-8 max-w-md">
              <div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">500<span className="text-emerald-500">+</span></h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-2">Active Traders</p>
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-slate-50 tracking-tight">₹10Cr<span className="text-emerald-500">+</span></h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-2">Processed Daily</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wide rounded-xl text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 shadow-xl shadow-slate-900/10 dark:shadow-none transition-all hover:-translate-y-1 duration-300">
                    Share Your Experience
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
                  <DialogHeader>
                    <DialogTitle className="dark:text-white">Submit a Testimonial</DialogTitle>
                    <DialogDescription className="dark:text-slate-400">
                      We&apos;d love to hear about your experience with ATMS. Share your story below!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                      <input id="name" placeholder="E.g. John Doe" className="flex h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-50 transition-shadow" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="role" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role / Business</label>
                      <input id="role" placeholder="E.g. Agricultural Trader" className="flex h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-50 transition-shadow" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="testimonial" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Story</label>
                      <textarea id="testimonial" placeholder="How has ATMS helped your business?" rows={4} className="flex w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-slate-50 transition-shadow resize-none" />
                    </div>
                  </div>
                  <DialogFooter>
                    <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
                      Submit Testimonial
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Right Column: Carousel */}
          <div className="relative group w-full min-w-0">
          <button 
            onClick={scrollLeft} 
            className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all hover:scale-110 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 shadow-xl"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="flex overflow-x-auto py-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          {testimonials.map((t, i) => (
            <div key={i} className="shrink-0 w-full snap-center px-4 sm:px-6">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 blur-2xl rounded-[3rem] -z-10" />
                <div className="bg-white dark:bg-slate-950 p-8 sm:p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                  <div className="flex gap-1 mb-6 text-emerald-500 justify-center">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-8 text-lg sm:text-xl italic leading-relaxed max-w-2xl mx-auto font-medium">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-auto text-left">
                    <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-900 flex shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg border border-slate-200 dark:border-slate-800 shadow-inner">
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-50 tracking-tight">
                        {t.name}
                      </h4>
                      <p className="text-emerald-600 dark:text-emerald-500 text-xs font-bold uppercase tracking-wider mt-1">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

          <button 
            onClick={scrollRight} 
            className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all hover:scale-110 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 shadow-xl"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}
