'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  User,
  Bell,
  Activity,
  Menu,
  LogOut,
  Settings,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    api.get(`/api/user/profile`)
      .then(res => setProfile(res.data))
      .catch(err => console.error("Header profile fetch error:", err));
  }, []);

  const handleLogout = async () => {
    try {
      await api.post(`/api/user/auth/logout`, {}, {
        withCredentials: true,
      });
      toast.success('Logged out successfully');
      router.push('/portal/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  const userInitials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  // Generate dynamic breadcrumb segments from pathname
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean); // ['portal', 'settings', 'profile']
    const breadcrumbs = [];
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath += `/${part}`;
      const label = part.charAt(0).toUpperCase() + part.slice(1);
      if (part === 'portal') {
        breadcrumbs.push({ label: 'Portal', href: '/portal/dashboard' });
      } else {
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    if (breadcrumbs.length === 1 && breadcrumbs[0].label === 'Portal') {
      breadcrumbs.push({ label: 'Dashboard', href: '/portal/dashboard' });
    }

    return breadcrumbs;
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Menu Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-10 w-10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl"
          onClick={toggleSidebar}
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          {getBreadcrumbs().map((item, index, arr) => {
            const isLast = index === arr.length - 1;
            return (
              <div key={item.href + index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                )}
                {isLast ? (
                  <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right: Status badge, Theme Toggle, User Profile Menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Status Badge */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-widest shadow-sm dark:shadow-none">
          <Activity className="h-3 w-3 animate-pulse" />
          Live
        </div>

        {/* Theme Toggle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 outline-none"
              aria-label="Toggle Theme"
            >
              {mounted && (
                <>
                  {theme === 'light' && <Sun className="h-4 w-4 text-amber-500" />}
                  {theme === 'dark' && <Moon className="h-4 w-4 text-blue-400" />}
                  {theme === 'system' && <Monitor className="h-4 w-4 text-slate-500" />}
                </>
              )}
              {!mounted && <Sun className="h-4 w-4 text-amber-500" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-2xl shadow-xl border-slate-200/80 dark:border-slate-800 p-1.5 bg-white dark:bg-slate-950">
            <DropdownMenuItem onClick={() => setTheme('light')} className="rounded-xl cursor-pointer py-2 px-3 flex items-center gap-2.5 text-xs font-semibold">
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')} className="rounded-xl cursor-pointer py-2 px-3 flex items-center gap-2.5 text-xs font-semibold">
              <Moon className="h-4 w-4 text-blue-400" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')} className="rounded-xl cursor-pointer py-2 px-3 flex items-center gap-2.5 text-xs font-semibold">
              <Monitor className="h-4 w-4 text-slate-500" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800 group outline-none">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {profile?.name || 'Trader'}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                  {profile?.verificationStatus === 'APPROVED' ? 'Verified Trader' : 'Trader'}
                </p>
              </div>

              {/* Avatar with Initials & Online Status Dot */}
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-bold shadow-sm ring-2 ring-slate-100 dark:ring-slate-800 group-hover:scale-105 transition-transform">
                  {userInitials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full" />
              </div>

              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors hidden sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-60 rounded-2xl shadow-xl border-slate-200/80 dark:border-slate-800 p-2 bg-white dark:bg-slate-950">
            <DropdownMenuLabel className="px-3 py-2.5">
              <p className="text-xs font-black text-slate-900 dark:text-slate-100">{profile?.name || 'Trader'}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{profile?.email || 'trader@atms.com'}</p>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />

            {/* Quick settings links inside profile dropdown */}
            <DropdownMenuItem
              onClick={() => router.push('/portal/settings/profile')}
              className="rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <User className="h-4 w-4 text-slate-400" />
              <span>Profile Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push('/portal/settings/security')}
              className="rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <Lock className="h-4 w-4 text-slate-400" />
              <span>Security & Password</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push('/portal/settings/preferences')}
              className="rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <Bell className="h-4 w-4 text-slate-400" />
              <span>Preferences & Alerts</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl cursor-pointer py-2.5 px-3 flex items-center gap-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
