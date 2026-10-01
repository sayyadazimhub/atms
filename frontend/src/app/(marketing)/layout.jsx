import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/Footer';

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      <Footer />
    </div>
  );
}
