'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  User as UserIcon,
  Mail,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  BadgeCheck,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/portal/PageHeader';
import { cn } from '@/lib/utils';

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [originalProfile, setOriginalProfile] = useState({ name: '', email: '', phone: '' });
  const [fullData, setFullData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setInitialLoading(true);
    try {
      const res = await api.get('/api/user/profile');
      const data = {
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
      };
      setProfile(data);
      setOriginalProfile(data);
      setFullData(res.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!profile.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const res = await api.put('/api/user/profile', {
        name: profile.name,
        phone: profile.phone
      });
      setProfile({
        name: res.data.name || profile.name,
        email: res.data.email || profile.email,
        phone: res.data.phone || profile.phone,
      });
      setOriginalProfile({
        name: res.data.name || profile.name,
        email: res.data.email || profile.email,
        phone: res.data.phone || profile.phone,
      });
      setFullData(res.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfile(originalProfile);
    toast('Changes discarded', { icon: 'ℹ️' });
  };

  const hasChanges = profile.name !== originalProfile.name || profile.phone !== originalProfile.phone;
  const initials = profile.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  if (initialLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent dark:border-slate-100" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <PageHeader
        title="Profile Settings"
        description="Manage your trader identity, contact information, and authentication status"
        icon={UserIcon}
        actionButton={
          hasChanges && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="h-10 px-4 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-2 bg-white dark:bg-slate-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Discard
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={loading}
                className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Card: Summary Avatar & Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden text-center p-6 sm:p-8">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black text-3xl shadow-xl ring-4 ring-slate-100 dark:ring-slate-800">
              {initials}
            </div>

            <div className="mt-5">
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{profile.name || 'Trader'}</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{profile.email}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3.5 text-left">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400 dark:text-slate-500">Status</span>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                  fullData?.verificationStatus === 'APPROVED'
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
                )}>
                  {fullData?.verificationStatus === 'APPROVED' ? (
                    <BadgeCheck className="h-3.5 w-3.5" />
                  ) : (
                    <ShieldAlert className="h-3.5 w-3.5" />
                  )}
                  {fullData?.verificationStatus || 'APPROVED'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400 dark:text-slate-500">Account Type</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">Trader Portal</span>
              </div>

              {fullData?.createdAt && (
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400 dark:text-slate-500">Member Since</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {new Date(fullData.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Verified Identity</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Trader profile authenticated on the ATMS Network</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Form: Editable fields (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Personal Information</CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Update your business contact details and legal trader name.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="h-11 pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-slate-100 font-medium"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Registered Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        value={profile.email}
                        className="h-11 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Email is verified and locked to this account.</p>
                  </div>
                </div>

                <div className="space-y-2 max-w-md">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="h-11 pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-slate-100 font-medium"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    disabled={loading || !hasChanges}
                    className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>

                  {hasChanges && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center gap-2"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Discard
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
