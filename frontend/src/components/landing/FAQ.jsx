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
    <section className="py-24 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl tracking-tight mb-4">
            Frequently Asked <span className="text-emerald-600 dark:text-emerald-400">Questions</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Everything you need to know about the platform. Can&apos;t find the answer you&apos;re looking for? Feel free to contact our support team.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i ? 'bg-slate-50 dark:bg-slate-900 shadow-md' : 'bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-900/50'}`}
            >
              <button 
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-emerald-500' : ''}`} />
              </button>
              
              <div 
                className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === i ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
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
