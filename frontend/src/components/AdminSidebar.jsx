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
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/traders', label: 'Traders', icon: Users },
  { href: '/admins', label: 'Administrators', icon: Shield },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch admin profile
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/profile`, { withCredentials: true })
      .then((res) => setAdmin(res.data))
      .catch(() => { });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/auth/logout`);
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex shrink-0 items-center justify-between p-4 bg-white border-b z-30">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
          <img src="/favicon.svg" alt="ATMS Logo" className="h-6 w-6 shrink-0" />
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
        "fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col", mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full", { withCredentials: true })}>
        {/* Logo / Brand */}
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="h-10 w-10 flex items-center justify-center">
            <img src="/favicon.svg" alt="ATMS Logo" className="h-10 w-10 drop-shadow-md rounded-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">ATMS Network</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Admin Portal</p>
          </div>
          {/* Close button inside mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-auto h-8 w-8 text-slate-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 ml-2">Menu</div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive(link.href)
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <link.icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive(link.href) ? "scale-110" : "group-hover:scale-110 text-slate-400 group-hover:text-indigo-600"
              )} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Bottom Profile Area */}
        <div className="p-4 border-t bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4 p-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {admin?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{admin?.name || 'Administrator'}</p>
              <p className="text-xs text-slate-500 truncate">{admin?.email || 'admin@atms.com'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-rose-600 font-medium hover:text-rose-700 hover:bg-rose-50 border-slate-200 rounded-xl"
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
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
