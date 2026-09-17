'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, ArrowRight, CheckCircle2, ShoppingCart, BarChart3, Users, LineChart, ShieldCheck, Sparkles, Building2, Package, TrendingUp, Activity, Headset, Eye, EyeOff } from 'lucide-react';

function ErrorToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'registration_disabled') {
      toast.error('Registration is currently disabled by the administrator', { id: 'reg-disabled', duration: 4000 });
      router.replace('/user/login');
    } else if (error === 'maintenance') {
      toast.error('System is currently under maintenance', { id: 'maint', duration: 4000 });
      router.replace('/user/login');
    }
  }, [searchParams, router]);

  return null;
}

export default function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await axios.post('/api/user/auth/login', { email, password });
      toast.success('Login successful');
      window.location.href = '/user/dashboard';
      return;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.error || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <ErrorToast />
      </Suspense>

      {/* Form Side (Right) */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-slate-50 relative">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <Link href="/" className="lg:hidden flex items-center gap-3 absolute top-8 left-8 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-xl" />
            <Sprout className="h-5 w-5 text-emerald-400 relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-slate-900 uppercase leading-none">ATMS</span>
          </div>
        </Link>

        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-slate-200/50 p-8 sm:p-12 animate-in fade-in zoom-in-95 duration-1000 mt-16 lg:mt-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({...prev, email: ''})); }}
                onFocus={() => { setErrors(prev => ({...prev, email: ''})); }}
                autoComplete="email"
                className={`h-11 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 transition-colors text-sm shadow-sm ${
                  errors.email ? 'border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500' : 'border-slate-200 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500'
                }`}
              />
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                <Link
                  href="/user/forgot-password"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({...prev, password: ''})); }}
                  onFocus={() => { setErrors(prev => ({...prev, password: ''})); }}
                  autoComplete="current-password"
                  className={`h-11 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 transition-colors text-sm shadow-sm pr-10 ${
                    errors.password ? 'border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500' : 'border-slate-200 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">
                  {errors.password}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm group mt-6" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/user/register" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Create one now
              </Link>
            </p>
            <p className="text-xs text-emerald-500">
              <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center justify-center gap-1">
                <ArrowRight className="h-3 w-3 rotate-180" /> Back to home page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
