import Sidebar from '@/components/portal/Sidebar';
import Header from '@/components/portal/Header';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import serverApiUrl from '@/lib/server-api-url';
import { redirect } from 'next/navigation';
import { ThemeProvider } from '@/components/portal/ThemeProvider';

export default async function UserDashboardLayout({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get('user-token')?.value;

  if (!token) {
    redirect('/portal/login');
  }

  const decoded = await verifyUserToken(token);
  if (!decoded) {
    redirect('/portal/login');
  }

  // CRITICAL: Verify user existence in DB via API
  const res = await fetch(`${serverApiUrl}/api/user/profile`, {
    headers: {
      Cookie: `user-token=${token}`
    }
  });
  const user = res.ok ? await res.json() : null;

  if (!user || !user.is_active) {
    console.warn(`Access denied: User ${decoded.id} not found or inactive.`);
    redirect('/portal/login');
  }

  if (user.verificationStatus !== 'APPROVED') {
    redirect('/portal/verify-trader');
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
