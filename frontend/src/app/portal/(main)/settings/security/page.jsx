'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, KeyRound, CheckCircle2, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/portal/PageHeader';

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.next.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/user/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      toast.success('Password updated successfully');
      setPasswords({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <PageHeader
        title="Security Settings"
        description="Update your account credentials, manage encryption password, and safeguard access"
        icon={Shield}
      />

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Main Password Form (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/40 p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Change Password</CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Choose a strong password with a mix of letters, numbers, and symbols.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrent ? 'text' : 'password'}
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="h-11 pr-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-slate-100 font-medium"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNew ? 'text' : 'password'}
                      value={passwords.next}
                      onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                      className="h-11 pr-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-slate-100 font-medium"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="h-11 pr-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-slate-100 font-medium"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="submit"
                    disabled={loading || !passwords.current || !passwords.next || !passwords.confirm}
                    className="h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Security Recommendations Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Security Best Practices
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Use at least 8 characters with numbers and symbols</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Avoid reusing passwords from personal or social accounts</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>Rotate credentials regularly to protect transactional records</span>
              </li>
            </ul>
          </Card>

          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Session Protection</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sessions expire automatically on inactive sessions to keep data safe.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
