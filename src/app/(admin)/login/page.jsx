'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/admin/auth/login', { email, password }, { withCredentials: true });
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
    <div className="flex min-h-screen items-center justify-center bg-background bg-gradient-to-br from-slate-50 to-blue-50/40 p-4 force-light">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access ATMS
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          {/* <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </p> */}
        </CardContent>
      </Card>
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
//       await axios.post('/api/admin/auth/register', form);
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

