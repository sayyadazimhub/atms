'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LogOut,
  Settings,
  LayoutDashboard,
  Users,
  BarChart3,
  Menu,
  X,
  Shield,
  User,
  Bell,
  Layout,
  Lock,
  ChevronDown,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const mainLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/traders', label: 'Traders', icon: Users },
  { href: '/admins', label: 'Administrators', icon: Shield },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/contact-messages', label: 'Contact Msgs', icon: Mail },
  { href: '/testimonials', label: 'Testimonials', icon: MessageSquare },
];

const settingsLinks = [
  { href: '/settings/profile', label: 'Profile', icon: User },
  { href: '/settings/security', label: 'Security', icon: Lock },
  { href: '/settings/system', label: 'System & Alerts', icon: Layout },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(pathname.startsWith('/settings'));

  useEffect(() => {
    // Fetch admin profile
    api.get(`/api/admin/profile`)
      .then((res) => setAdmin(res.data))
      .catch(() => { });
  }, []);

  const handleLogout = async () => {
    try {
      await api.post(`/api/admin/auth/logout`, {});
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex shrink-0 items-center justify-between p-4 bg-white border-b border-slate-200 z-30">
        <div className="flex items-center gap-2 text-slate-950 font-bold text-xl">
          <img src="/favicon.svg" alt="ATMS Logo" className="h-7 w-7 shrink-0 rounded-lg shadow-sm" />
          ATMS Admin
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col", mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full")}>
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-200 bg-white">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-950 shadow-sm">
            <img src="/favicon.svg" alt="ATMS Logo" className="h-9 w-9 rounded-xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-950 leading-tight">ATMS Network</h2>
            <p className="mt-1 text-[10px] font-bold text-emerald-700 uppercase tracking-[0.12em]">Admin Portal</p>
          </div>
          {/* Close button inside mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-auto h-8 w-8 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {pathname.startsWith('/settings') ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
                Back to Main Menu
              </Link>
              
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.16em] mb-3 ml-3 mt-4">Settings</div>
              <div className="space-y-1">
                {settingsLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 group",
                      pathname === link.href
                        ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    )}
                  >
                    {pathname === link.href && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-600" />}
                    <link.icon className={cn(
                      "h-[18px] w-[18px] transition-colors duration-200",
                      pathname === link.href ? "text-emerald-700" : "text-slate-400 group-hover:text-emerald-700"
                    )} />
                    {link.label}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.16em] mb-3 ml-3">Workspace</div>
              <div className="space-y-1">
                {mainLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 group",
                      isActive(link.href)
                        ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    )}
                  >
                    {isActive(link.href) && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-600" />}
                    <link.icon className={cn(
                      "h-[18px] w-[18px] transition-colors duration-200",
                      isActive(link.href) ? "text-emerald-700" : "text-slate-400 group-hover:text-emerald-700"
                    )} />
                    {link.label}
                  </Link>
                ))}
                
                <Link
                  href="/settings/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors duration-200 group"
                >
                  <Settings className="h-[18px] w-[18px] text-slate-400 group-hover:text-emerald-700 transition-colors duration-200" />
                  Settings
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Bottom Profile Area */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70">
          <Link 
            href="/settings/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-full bg-emerald-700 ring-4 ring-emerald-100 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:ring-emerald-200 transition-all">
              {admin?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-950 truncate group-hover:text-emerald-700 transition-colors">{admin?.name || 'Administrator'}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email || 'admin@atms.com'}</p>
            </div>
          </Link>
          <Button
            variant="outline"
            className="w-full justify-start text-slate-600 font-semibold hover:text-rose-700 hover:bg-rose-50 border-slate-200 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Mobile Overlay Background */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
