import React from 'react';
import { Mail, Phone, MapPin, Send, Building2, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



export const metadata = {
  title: 'Contact Us | ATMS Trading Systems',
  description: 'Get in touch with our team for support or inquiries.',
};

export default function ContactPage() {
  return (
    <>

      <main className="flex-grow relative z-10 w-full mx-auto px-4 py-12 md:py-20 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left Column: Header & Contact Info */}
            <div className="flex flex-col h-full">
              {/* Premium Header Section */}
              <div className="mb-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-6 border border-emerald-200/50 dark:border-emerald-800 shadow-sm backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  Support 24/7
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white sm:text-5xl lg:text-6xl tracking-tighter leading-[1.1] mb-6">
                  Get in <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700">Touch</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                  Have questions about ATMS? Whether you need help with features, pricing, or anything else, our team is here to help you optimize your agricultural trading business.
                </p>
              </div>

              {/* Contact Information */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 flex-grow w-full lg:max-w-sm xl:max-w-md mx-auto lg:mx-0">

                {/* Chat to Sales Card */}
                <div className="flex-1 w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-5 group hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all shadow-sm hover:shadow-md">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:-rotate-3 transition-transform shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1">Chat to sales</h4>
                    <a href="mailto:support@atms-trading.com" className="text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 block mb-0.5">
                      support@atms-trading.com
                    </a>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Our friendly team is here to help.</p>
                  </div>
                </div>

                {/* Call Us Card */}
                <div className="flex-1 w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-5 group hover:bg-white/70 dark:hover:bg-slate-900/70 transition-all shadow-sm hover:shadow-md">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1">Call us</h4>
                    <a href="tel:+919075909896" className="text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 block mb-0.5">
                      +91 907590-9896
                    </a>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Mon-Fri from 8am to 5pm.</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 mt-8 flex flex-col items-center lg:items-start">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4 lg:pl-2 text-center lg:text-left">Follow Us</h4>
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                  {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                    <a key={social} href={`#${social.toLowerCase()}`} className="px-4 py-2 rounded-full bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all backdrop-blur-md shadow-sm hover:shadow">
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl h-full flex flex-col relative">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-8">Send us a message</h3>

              <form className="space-y-6 flex-grow flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                      <input type="text" id="fullName" className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                      <input type="email" id="email" className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Subject</label>
                    <input type="text" id="subject" className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400" placeholder="How can we help?" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 resize-none" 
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>
                </div>

                <Button type="button" className="w-full h-14 mt-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 border-0 transition-all duration-300 group">
                  Send Message
                  <Send className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              </form>
            </div>

          </div>
        </div>
      </main>

    </>
  );
}
