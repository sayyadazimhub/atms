'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

const appHomeUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/auth/forgot-password`, { email }, { withCredentials: true });
      setSent(true);
      toast.success('Check your email for reset instructions');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="force-light relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-emerald-600" />
      <main className="relative w-full max-w-md">
        <Card className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">
          <CardHeader className="px-7 pb-2 pt-8 sm:px-9 sm:pt-9">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100">
                {sent ? <CheckCircle2 className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">
                  {sent ? 'Check your inbox' : 'Forgot password?'}
                </CardTitle>
                <p className="text-sm leading-6 text-slate-500">
                  {sent ? 'Reset instructions are on their way.' : 'Enter your admin email to receive a secure reset link.'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-8 pt-6 sm:px-9 sm:pb-9">
            {sent ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm leading-6 text-slate-700">
                If an account exists for <span className="font-semibold text-slate-900">{email}</span>, you will receive password reset instructions.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold text-slate-700">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11 rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10"
                  />
                </div>
                <Button type="submit" className="group h-11 w-full rounded-xl bg-emerald-700 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600" disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset link'}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                </Button>
              </form>
            )}
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
