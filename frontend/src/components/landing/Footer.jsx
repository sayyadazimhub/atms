import Link from 'next/link';
import { Sprout, Github, Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-10 lg:gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 flex flex-col gap-4 lg:gap-6 lg:pr-8">
            <Link href="/" className="flex items-center gap-4 group cursor-pointer inline-flex w-max">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl group-hover:scale-105 transition-all duration-300 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
                <Sprout className="h-8 w-8 text-emerald-400 relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">ATMS</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Platform</span>
              </div>
            </Link>
            <p className="text-base leading-relaxed text-slate-600 max-w-sm font-medium">
              Join the elite club of traders who have scaled their operations with ATMS. Get started with professional tools in seconds.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { Icon: Twitter, href: "https://x.com/azimxsayyad" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/sayyadazimmern/" },
                { Icon: Github, href: "https://github.com/sayyadazimhub" },
              ].map((social, i) => (
                <Link key={i} href={social.href} target="_blank" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-all">
                  <social.Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest mb-4 lg:mb-6">Product</h3>
            <ul className="space-y-2 md:space-y-3 lg:space-y-4">
              {[
                { name: 'Features', href: '/#features' },
                { name: 'Pricing Plans', href: '/#pricing' },
                { name: 'Sign In', href: '/portal/login' },
                { name: 'Get Started', href: '/portal/register' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-slate-600 hover:text-emerald-600 transition-colors font-medium block py-1">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest mb-4 lg:mb-6">Company</h3>
            <ul className="space-y-2 md:space-y-3 lg:space-y-4">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'FAQ', href: '/#faq' },
                { label: 'Contact Us', href: '/contact' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-slate-600 hover:text-emerald-600 transition-colors font-medium block py-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-widest mb-4 lg:mb-6">Contact Us</h3>
            <ul className="flex flex-row flex-wrap gap-x-4 gap-y-2 md:gap-4 md:flex-col lg:gap-0 lg:space-y-4">
              <li>
                <a href="mailto:support@atms.com" className="flex items-center gap-3 group py-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-emerald-600 transition-colors font-medium">support@atms.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+919075909896" className="flex items-center gap-3 group py-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-emerald-600 transition-colors font-medium">+91 907590-9896</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">Maharashtra, India</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} ATMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs font-bold tracking-widest text-slate-500">
            <Link href="/security" className="hover:text-emerald-600 transition-colors">Security</Link>
            <Link href="/privacy-policy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-emerald-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
