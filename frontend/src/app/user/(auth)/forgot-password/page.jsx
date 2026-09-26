'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UserForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      toast.success('OTP sent to your email');
      router.push(`/user/reset-password?email=${encodeURIComponent(email)}`);
      return;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-slate-50 relative py-12">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-200/50 p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-1000 mt-16 lg:mt-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Forgot Password
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Enter your email. We&apos;ll send an OTP to reset your password.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 transition-colors text-sm shadow-sm"
              />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm group mt-4" disabled={loading}>
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </Button>
          </form>
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
