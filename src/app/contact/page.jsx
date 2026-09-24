import React from 'react';
import { Mail, Phone, MapPin, Send, Building2, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Contact Us | ATMS Trading Systems',
  description: 'Get in touch with our team for support or inquiries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main className="flex-grow relative z-10 w-full max-w-7xl mx-auto px-4 py-16 md:py-24">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-[1.1] mb-6 uppercase">
            Get in <span className="text-emerald-600 dark:text-emerald-400">Touch</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            Have questions about ATMS? Our team is here to help you optimize your agricultural trading business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold uppercase tracking-widest mb-8 text-slate-900 dark:text-slate-100">Contact Details</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Email Us</h4>
                    <a href="mailto:support@atms-trading.com" className="text-lg font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-slate-900 dark:text-slate-100">
                      support@atms-trading.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Call Us</h4>
                    <a href="tel:+919075909896" className="text-lg font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-slate-900 dark:text-slate-100">
                      +91 907590-9896
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Headquarters</h4>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      Nanded, Maharashtra,<br />India - 431601
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-8 text-slate-900 dark:text-slate-100">Send a Message</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">First Name</label>
                  <input type="text" id="firstName" className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Last Name</label>
                  <input type="text" id="lastName" className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Email Address</label>
                <input type="email" id="email" className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">Message</label>
                <textarea id="message" rows={5} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <Button type="button" className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all">
                Send Message
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
          
        </div>
      </main>

      <div className="w-full bg-white dark:bg-slate-900 mt-auto">
        <Footer />
      </div>
    </div>
  );
}
