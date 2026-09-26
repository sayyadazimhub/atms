import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyUserToken } from '@/lib/auth';
import serverApiUrl from '@/lib/server-api-url';
import VerifyTraderClient from './VerifyTraderClient';

export default async function VerifyTraderPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('user-token')?.value;

  if (!token) {
    redirect('/user/login');
  }

  const decoded = await verifyUserToken(token);
  if (!decoded) {
    redirect('/user/login');
  }

  const res = await fetch(`${serverApiUrl}/api/user/profile`, {
    headers: {
      Cookie: `user-token=${token}`
    }
  });

  const user = res.ok ? await res.json() : null;

  if (!user) {
    redirect('/user/login');
  }

  if (user.verificationStatus === 'APPROVED') {
    redirect('/user/dashboard');
  }

  return (
    <VerifyTraderClient 
      status={user.verificationStatus} 
      rejectionReason={user.rejectionReason}
      initialState={user.state}
      initialDistrict={user.district}
    />
  );
}
