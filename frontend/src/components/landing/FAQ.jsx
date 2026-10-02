"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: "Do I need accounting knowledge to use ATMS?",
      a: "Not at all. ATMS is designed specifically for agricultural traders, not accountants. The interface is intuitive, and all profit calculations and inventory updates happen automatically in the background."
    },
    {
      q: "Is my business data secure?",
      a: "Yes. We use enterprise-grade encryption to protect your data. Your financial information, customer details, and inventory records are strictly confidential and securely backed up daily."
    },
    {
      q: "Can I access the system on my mobile phone?",
      a: "Absolutely. The ATMS dashboard is fully responsive, meaning it works perfectly on your smartphone, tablet, or desktop computer. You can check your stock and record trades on the go."
    },
    {
      q: "What happens if I need help using the software?",
      a: "We offer 24/7 dedicated support via email. For Professional and Enterprise users, we also offer priority phone support and personalized onboarding sessions."
    },
    {
      q: "Can I export my reports for tax purposes?",
      a: "Yes, all your sales, purchase, and profit reports can be easily exported to Excel or PDF formats, making tax season and sharing data with your accountant a breeze."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-12 lg:py-16 flex flex-col justify-center min-h-[auto] xl:min-h-screen relative overflow-hidden bg-slate-50 border-b border-slate-200">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 relative z-10 w-full">
        {/* Premium Header */}
        <div className="mb-10 lg:mb-12 flex flex-col items-center text-center mx-auto">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-slate-200/50 shadow-sm backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-500"></span>
            </span>
            Got Questions?
          </div> */}
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl tracking-tighter leading-[1.1] mb-4">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-700">Questions</span>
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl mx-auto">
            Everything you need to know about the platform. Can&apos;t find the answer you&apos;re looking for? Feel free to contact our support team.
          </p>
        </div>

        <div className="space-y-4 relative">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-sm ${
                openIndex === i 
                  ? 'bg-white border-teal-500/30 shadow-lg shadow-teal-500/5' 
                  : 'bg-white/50 border-slate-200/80 hover:border-teal-500/20 hover:bg-white hover:shadow-md'
              }`}
            >
              <button 
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className={`font-extrabold pr-4 transition-colors ${openIndex === i ? 'text-teal-600' : 'text-slate-900 group-hover:text-teal-600'}`}>
                  {faq.q}
                </span>
                <div className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 ${openIndex === i ? 'bg-teal-100' : 'bg-slate-100 group-hover:bg-teal-50'}`}>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-teal-600' : 'text-slate-400 group-hover:text-teal-500'}`} />
                </div>
              </button>
              
              <div 
                className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === i ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-600 text-sm font-medium leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
