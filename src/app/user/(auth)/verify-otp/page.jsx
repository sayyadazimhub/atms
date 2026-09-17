'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Missing email');
      router.push('/user/register');
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/user/auth/verify-otp', { email, otp });
      toast.success('Email verified');
      window.location.href = '/user/dashboard';
      return;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-slate-500">
        We sent a 6-digit OTP to <strong>{email}</strong>. Enter it below.
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
          className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500 transition-colors text-center text-lg tracking-[0.5em] shadow-sm"
        />
      </div>
      <Button type="submit" className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm group mt-4" disabled={loading}>
        {loading ? 'Verifying…' : 'Verify email'}
      </Button>
    </form>
  );
}

export default function UserVerifyOtpPage() {
  return (
    <>
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-slate-50 relative py-12">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-200/50 p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-1000 mt-16 lg:mt-0">
          <div className="mb-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Verify your email
            </h2>
          </div>
          <Suspense fallback={<p className="text-center text-muted-foreground">Loading…</p>}>
            <VerifyOtpForm />
          </Suspense>
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-500">
              <Link href="/user/register" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Use a different email
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
