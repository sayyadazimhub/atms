import Link from 'next/link';
import { Sprout, Github, Twitter, Linkedin, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[128px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[128px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 mb-16">
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <Sprout className="h-7 w-7 relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white tracking-tight leading-none uppercase">ATMS</span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mt-1">Trading Systems</span>
              </div>
            </div>
            
            <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
              The premier platform for agricultural trading businesses. Streamline your operations, manage inventory, and grow your profits with our professional suite of tools.
            </p>

            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-4">
                {[
                  { Icon: Facebook, href: "#", label: "Facebook" },
                  { Icon: Twitter, href: "https://x.com/azimxsayyad", label: "Twitter" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/in/sayyadazimmern/", label: "LinkedIn" },
                  { Icon: Github, href: "https://github.com/sayyadazimhub", label: "GitHub" }
                ].map((social, i) => (
                  <Link 
                    key={i} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={social.label}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all group shadow-sm"
                  >
                    <social.Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Our Features", "Pricing Plans", "Careers", "Contact"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <span className="h-px w-0 bg-emerald-400 group-hover:w-4 transition-all duration-300"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Contact Us</h4>
            <ul className="space-y-5">
              <li>
                <a href="mailto:support@atms-trading.com" className="flex items-start gap-3 group">
                  <div className="p-2 rounded-lg bg-slate-900 border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Email Support</span>
                    <span className="text-sm text-slate-300 group-hover:text-emerald-400 transition-colors">support@atms-trading.com</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+18001234567" className="flex items-start gap-3 group">
                  <div className="p-2 rounded-lg bg-slate-900 border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Phone Inquiry</span>
                    <span className="text-sm text-slate-300 group-hover:text-emerald-400 transition-colors">+91 907590-9896</span>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 group">
                  <div className="p-2 rounded-lg bg-slate-900 border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-all shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Headquarters</span>
                    <span className="text-sm text-slate-300 group-hover:text-emerald-400 transition-colors">Nanded, Maharashtra,<br />India - 431601</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row-reverse items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
            <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">Cookies</Link>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} ATMS Trading Systems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
