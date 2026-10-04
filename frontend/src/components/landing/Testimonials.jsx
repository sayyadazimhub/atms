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
    // {
    //   name: "Amit Patel",
    //   role: "Agri-Inputs Supplier",
    //   text: "The payment tracking feature is a lifesaver. I no longer have to manually chase down pending payments from customers. It's all perfectly organized on the dashboard.",
    //   initials: "AP"
    // },
    // {
    //   name: "Amit Patel",
    //   role: "Agri-Inputs Supplier",
    //   text: "Th is very usefull",
    //   initials: "AP"
    // },
    // {
    //   name: "Suresh Reddy",
    //   role: "Fresh Produce Distributor",
    //   text: "I was hesitant to switch to software, but the interface is incredibly simple. It took me less than 10 minutes to understand the system and start adding my stock.",
    //   initials: "SR"
    // }
  ];

  return (
    <section id="testimonials" className="py-12 lg:py-16 flex flex-col justify-center relative overflow-hidden bg-white border-b border-slate-200">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="w-full lg:max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-slate-600 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-6 border border-slate-200/50 shadow-sm backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Success Stories
            </div>
            <h2 className="text-4xl font-black text-slate-900 sm:text-5xl lg:text-6xl tracking-tighter leading-[1.1] mb-6">
              Empowering Traders <br className="hidden xl:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Every Single Day.</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed w-full lg:max-w-lg mb-10">
              Join the growing community of agricultural wholesalers and distributors who have transformed their operations, scaled their profits, and taken control of their inventory with ATMS.
            </p>

            {/* Social Proof Stats */}
            {/* <div className="mb-10 grid grid-cols-2 gap-8 w-full lg:max-w-md">
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">500<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">+</span></h3>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-2">Active Traders</p>
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">₹10Cr<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">+</span></h3>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.15em] mt-2">Processed Daily</p>
              </div>
            </div> */}
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wide rounded-xl text-white bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-1 duration-300">
                    Share Your Experience
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="">Submit a Testimonial</DialogTitle>
                    <DialogDescription className="">
                      We&apos;d love to hear about your experience with ATMS. Share your story below!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-semibold text-slate-700">Name</label>
                      <input id="name" placeholder="E.g. John Doe" className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="role" className="text-sm font-semibold text-slate-700">Role / Business</label>
                      <input id="role" placeholder="E.g. Agricultural Trader" className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="testimonial" className="text-sm font-semibold text-slate-700">Your Story</label>
                      <textarea id="testimonial" placeholder="How has ATMS helped your business?" rows={4} className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow resize-none" />
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
          {testimonials.length > 1 && (
            <button 
              onClick={scrollLeft} 
              className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-3 rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:scale-110 hover:text-emerald-600 active:scale-95 shadow-xl"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
        >
          {testimonials.length === 0 ? (
            <div className="shrink-0 w-full snap-center px-4 md:px-6">
              <div className="relative">
                <div className="absolute bg-gradient-to-br from-emerald-500/10 to-blue-500/10 blur-2xl rounded-[3rem] -z-10" />
                <div className="bg-white/50 p-8 sm:p-10 rounded-[2rem] border-2 border-dashed border-emerald-500/20 shadow-lg relative overflow-hidden flex flex-col items-center text-center">
                  <div className="flex gap-1 mb-6 text-slate-200 justify-center">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-500 mb-8 text-lg sm:text-xl italic leading-relaxed max-w-2xl mx-auto font-medium">
                    &quot;Be the first to share your experience with ATMS! Click the button to tell us your story.&quot;
                  </p>
                </div>
              </div>
            </div>
          ) : (
            testimonials.map((t, i) => (
              <div key={i} className="shrink-0 w-full snap-center px-4 md:px-6 py-2 md:py-6">
              <div className="relative">
                <div className="absolute bg-gradient-to-br from-emerald-500/10 to-blue-500/10 blur-xl rounded-[3rem] -z-10" />
                <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
                  <div className="flex gap-1 mb-6 text-emerald-500 justify-center">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-8 text-lg sm:text-xl italic leading-relaxed max-w-2xl mx-auto font-medium">
                    &quot;{t.text}&quot;
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-auto text-left">
                    <div className="h-12 w-12 rounded-full bg-slate-50 flex shrink-0 items-center justify-center text-emerald-600 font-bold text-lg border border-slate-200 shadow-inner">
                      {t.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 tracking-tight">
                        {t.name}
                      </h4>
                      <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mt-1">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
          )}
        </div>

          {testimonials.length > 1 && (
            <button 
              onClick={scrollRight} 
              className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center p-3 rounded-full border border-slate-200 bg-white text-slate-700 transition-all hover:scale-110 hover:text-emerald-600 active:scale-95 shadow-xl"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}
