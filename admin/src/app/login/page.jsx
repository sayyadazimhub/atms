'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/auth/login`, { email, password }, { withCredentials: true });
      toast.success('Login successful');
      window.location.href = '/dashboard';
      return;
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

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
            <div className="space-y-0">
              <CardTitle className="text-[1.7rem] font-bold tracking-tight text-slate-950">Welcome back</CardTitle>
              <p className="text-sm leading-6 text-slate-500">Sign in with your administrator account to continue.</p>
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-8 pt-6 sm:px-9 sm:pb-9">
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-semibold text-slate-700">Password</Label>
                  <Link href="/forgot-password" className="text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-600">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-11 rounded-xl border-slate-200 bg-white pr-11 text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-4 focus-visible:ring-emerald-600/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="group mt-2 h-11 w-full rounded-xl bg-emerald-700 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            </form>
            <p className="mt-7 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-500">
              Restricted access. Authorized administrators only.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';

// export default function RegisterPage() {
//   const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/auth/register`, form, { withCredentials: true });
//       toast.success('Account created');
//       window.location.href = '/dashboard';
//       return;
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-background bg-gradient-to-br from-slate-50 to-blue-50/40 p-4 force-light">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader className="space-y-1 text-center">
//           <CardTitle className="text-2xl">Create account</CardTitle>
//           <p className="text-sm text-muted-foreground">
//             Register as admin for ATMS
//           </p>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 placeholder="Your name"
//                 value={form.name}
//                 onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={form.email}
//                 onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone (optional)</Label>
//               <Input
//                 id="phone"
//                 type="tel"
//                 placeholder="+1 234 567 8900"
//                 value={form.phone}
//                 onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={form.password}
//                 onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
//                 required
//                 minLength={6}
//               />
//               <p className="text-xs text-muted-foreground">Min 6 characters</p>
//             </div>
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? 'Creating…' : 'Create account'}
//             </Button>
//           </form>
//           <p className="mt-4 text-center text-sm text-muted-foreground">
//             Already have an account?{' '}
//             <Link href="/login" className="font-medium text-primary hover:underline">
//               Sign in
//             </Link>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

