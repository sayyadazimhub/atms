"use client";

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/api/contact', formData);
      toast.success(res.data.message || 'Message sent successfully!');
      setFormData({ fullName: '', email: '', subject: '', message: '' });
    } catch (error) {
      if (error.response?.data?.errors) {
        // Validation errors from backend (Show only the first error)
        const errs = error.response.data.errors;
        const firstError = Object.values(errs)[0];
        toast.error(firstError);
      } else {
        toast.error(error.response?.data?.message || 'Failed to send message');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex-grow flex flex-col justify-between">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              value={formData.fullName}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-base font-medium text-slate-900 placeholder:text-slate-400" 
              placeholder="John Doe" 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-base font-medium text-slate-900 placeholder:text-slate-400" 
              placeholder="john@example.com" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-bold text-slate-700 ml-1">Subject</label>
          <input 
            type="text" 
            id="subject" 
            value={formData.subject}
            onChange={handleChange}
            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-base font-medium text-slate-900 placeholder:text-slate-400" 
            placeholder="How can we help?" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-bold text-slate-700 ml-1">Message</label>
          <textarea 
            id="message" 
            rows={4} 
            value={formData.message}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-base font-medium text-slate-900 placeholder:text-slate-400 resize-none" 
            placeholder="Tell us more about your inquiry..."
          ></textarea>
        </div>
      </div>

      <Button disabled={loading} type="submit" className="w-full h-14 mt-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold uppercase tracking-[0.2em] text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 border-0 transition-all duration-300 group">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </>
        )}
      </Button>
    </form>
  );
}
