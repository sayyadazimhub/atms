import Link from 'next/link';
import { Sprout, Github, Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-6 lg:pr-8">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer inline-flex w-max">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-950 text-white shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent" />
                <Sprout className="h-6 w-6 text-emerald-400 relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none uppercase">ATMS</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mt-1">Premium</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm font-medium">
              Join the elite club of traders who have scaled their operations with ATMS. Get started with professional tools in seconds.
            </p>
            <div className="flex gap-4 pt-2">
              {[
                { Icon: Twitter, href: "https://x.com/azimxsayyad" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/sayyadazimmern/" },
                { Icon: Github, href: "https://github.com/sayyadazimhub" },
                { Icon: Facebook, href: "#" }
              ].map((social, i) => (
                <Link key={i} href={social.href} target="_blank" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
                  <social.Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">Product</h3>
            <ul className="space-y-4">
              {['Features', 'Pricing Plans', 'Case Studies', 'Reviews'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">Company</h3>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Blog', 'Contact'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:support@atms-trading.com" className="flex items-center gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-medium">support@atms-trading.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+919075909896" className="flex items-center gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-medium">+91 907590-9896</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-all shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Maharashtra, India</span>
                </div>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} ATMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
