"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', message: '', image: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: '', role: '', message: '', image: '' });
    }
  }, [isOpen]);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/api/testimonials');
      setTestimonials(response.data);
    } catch (error) {
      console.error('Failed to load testimonials', error);
    }
  };

  useEffect(() => {
    if (!scrollRef.current || isHovering || testimonials.length <= 1) return;
    
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
  }, [isHovering, testimonials.length]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.post('/api/testimonials', formData);
      toast.success(response.data.message || 'Testimonial submitted successfully!');
      setFormData({ name: '', role: '', message: '', image: '' });
      setIsOpen(false);
    } catch (error) {
      if (error.response?.data?.errors) {
        toast.error(Object.values(error.response.data.errors)[0]);
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit testimonial.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-wide rounded-xl text-white bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-1 duration-300">
                    Share Your Experience
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle className="">Submit a Testimonial</DialogTitle>
                      <DialogDescription className="">
                        We&apos;d love to hear about your experience with ATMS. Share your story below!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-semibold text-slate-700">Name</label>
                        <input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="E.g. John Doe" className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="role" className="text-sm font-semibold text-slate-700">Role / Business</label>
                        <input id="role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="E.g. Agricultural Trader" className="flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="message" className="text-sm font-semibold text-slate-700">Your Story</label>
                        <textarea id="message" maxLength={300} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="How has ATMS helped your business?" rows={4} className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow resize-none" />
                        <div className="text-right text-[11px] font-medium text-slate-400 mt-1">
                          {formData.message.length}/300
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="image" className="text-sm font-semibold text-slate-700">Profile Image (Optional)</label>
                        <input 
                          id="image" 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                toast.error('Image must be less than 2MB');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({...formData, image: reader.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <button disabled={isSubmitting} type="submit" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50">
                        {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
                      </button>
                    </DialogFooter>
                  </form>
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
                    &quot;{t.message}&quot;
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-auto text-left">
                    {t.image ? (
                      <img 
                        src={t.image} 
                        alt={t.name} 
                        className="h-12 w-12 rounded-full object-cover shrink-0 border border-slate-200 shadow-sm"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-50 flex shrink-0 items-center justify-center text-emerald-600 font-bold text-lg border border-slate-200 shadow-inner">
                        {t.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
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
