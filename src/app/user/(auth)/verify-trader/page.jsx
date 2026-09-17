import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyUserToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
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

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { 
      name: true, 
      verificationStatus: true, 
      rejectionReason: true,
      state: true,
      district: true
    }
  });

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
