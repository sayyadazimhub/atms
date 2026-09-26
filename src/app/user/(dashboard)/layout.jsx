import Sidebar from '@/components/sidebar';
import Header from '@/components/header';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';

export default async function UserDashboardLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get('user-token')?.value;

  if (!token) {
    redirect('/user/login');
  }

  const decoded = await verifyUserToken(token);
  if (!decoded) {
    redirect('/user/login');
  }

  // CRITICAL: Verify user existence in DB via API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/user/profile`, {
    headers: {
      Cookie: `user-token=${token}`
    }
  });
  const user = res.ok ? await res.json() : null;

  if (!user || !user.is_active) {
    console.warn(`Access denied: User ${decoded.id} not found or inactive.`);
    redirect('/user/login');
  }

  if (user.verificationStatus !== 'APPROVED') {
    redirect('/user/verify-trader');
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
