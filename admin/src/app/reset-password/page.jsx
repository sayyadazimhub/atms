'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';

const appHomeUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset link');
      router.push('/login');
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/auth/reset-password`, { token, password });
      toast.success('Password updated');
      window.location.href = '/login';
      return;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="font-semibold text-slate-700">New password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter a new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm" className="font-semibold text-slate-700">Confirm password</Label>
        <Input
          id="confirm"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10"
        />
      </div>
      <Button type="submit" className="group h-11 w-full rounded-xl bg-emerald-700 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600" disabled={loading}>
        {loading ? 'Updating…' : 'Reset password'}
        {!loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="force-light relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-emerald-600" />
      <main className="relative w-full max-w-md">
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">
          <CardHeader className="space-y-5 px-7 pb-2 pt-8 sm:px-9 sm:pt-9">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 shadow-sm">
                <img src="/favicon.svg" alt="ATMS" className="h-10 w-10 rounded-lg" />
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-slate-950">ATMS Network</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100">
                <KeyRound className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">Set a new password</CardTitle>
                <p className="text-sm leading-6 text-slate-500">Choose a new password for your administrator account.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-8 pt-6 sm:px-9 sm:pb-9">
            <Suspense fallback={<p className="py-4 text-center text-sm text-slate-500">Loading reset form…</p>}>
              <ResetForm />
            </Suspense>
            <div className="mt-7 flex flex-col items-center gap-4 border-t border-slate-100 pt-5">
              <Link href="/login" className="flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-600">
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
              <Link href={appHomeUrl} className="text-xs font-medium text-slate-500 transition-colors hover:text-slate-800">
                Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
