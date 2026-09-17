'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Missing email');
      router.push('/user/forgot-password');
    }
  }, [email, router]);

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
      await axios.post('/api/user/auth/reset-password', { email, otp, newPassword: password });
      toast.success('Password updated');
      window.location.href = '/user/login';
      return;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-slate-500">
        Enter the OTP sent to <strong>{email}</strong> and your new password.
      </p>
      <div className="space-y-2">
        <Label htmlFor="otp" className="text-slate-700 font-semibold">OTP</Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          required
          className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-colors text-center tracking-[0.5em] shadow-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-700 font-semibold">New password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-colors text-sm shadow-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm" className="text-slate-700 font-semibold">Confirm password</Label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-colors text-sm shadow-sm"
        />
      </div>
      <Button type="submit" className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm group mt-4" disabled={loading}>
        {loading ? 'Updating…' : 'Reset password'}
      </Button>
    </form>
  );
}

export default function UserResetPasswordPage() {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-slate-50 relative py-12">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-200/50 p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-1000 mt-16 lg:mt-0">
          <div className="mb-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Reset Password
            </h2>
          </div>
          <Suspense fallback={<p className="text-center text-muted-foreground">Loading…</p>}>
            <ResetPasswordForm />
          </Suspense>
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-500">
              Remember your password?{' '}
              <Link href="/user/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
