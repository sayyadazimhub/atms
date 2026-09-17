'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, ArrowRight, CheckCircle2, ShoppingCart, BarChart3, Users, LineChart, ShieldCheck, Sparkles, Building2, Package, TrendingUp, Activity, Headset, Eye, EyeOff } from 'lucide-react';

export default function UserRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Front-end check for passwords since this isn't checked by the backend easily
    if (form.password !== form.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('/api/user/auth/register', form);
      toast.success('Check your email for the OTP');
      router.push(`/user/verify-otp?email=${encodeURIComponent(form.email)}`);
      return;
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.error || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Form Side (Right) */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12 bg-slate-50 relative py-12">
        
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
              Create an Account
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Fill in your details below to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors(prev => ({...prev, name: ''})); }}
                  onFocus={() => { setErrors(prev => ({...prev, name: ''})); }}
                  className={`h-11 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 transition-colors text-sm shadow-sm ${
                    errors.name ? 'border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500' : 'border-slate-200 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500'
                  }`}
                />
                {errors.name && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-semibold">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="09012345678"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setErrors(prev => ({...prev, phone: ''})); }}
                  onFocus={() => { setErrors(prev => ({...prev, phone: ''})); }}
                  className={`h-11 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 transition-colors text-sm shadow-sm ${
                    errors.phone ? 'border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500' : 'border-slate-200 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500'
                  }`}
                />
                {errors.phone && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors(prev => ({...prev, email: ''})); }}
                onFocus={() => { setErrors(prev => ({...prev, email: ''})); }}
                className={`h-11 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 transition-colors text-sm shadow-sm ${
                  errors.email ? 'border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500' : 'border-slate-200 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500'
                }`}
              />
              {errors.email && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.email}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => { setForm((f) => ({ ...f, password: e.target.value })); setErrors(prev => ({...prev, password: ''})); }}
                    onFocus={() => { setErrors(prev => ({...prev, password: ''})); }}
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
                {errors.password && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-semibold">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => { setForm((f) => ({ ...f, confirmPassword: e.target.value })); setErrors(prev => ({...prev, confirmPassword: ''})); }}
                    onFocus={() => { setErrors(prev => ({...prev, confirmPassword: ''})); }}
                    className={`h-11 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-4 transition-colors text-sm shadow-sm pr-10 ${
                      errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500' : 'border-slate-200 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs font-medium text-red-500 mt-1.5 ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm group mt-6" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register Now'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/user/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Sign in
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
