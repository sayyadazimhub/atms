import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendVerificationApprovalEmail, sendVerificationRejectionEmail } from '@/lib/mail';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function PUT(request) {
  try {
    const token = (await cookies()).get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded || decoded.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, reason } = await request.json();

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    if (status === 'REJECTED' && !reason) {
        return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    const trader = await prisma.user.findUnique({
        where: { id }
    });

    if (!trader) {
        return NextResponse.json({ error: 'Trader not found' }, { status: 404 });
    }

    if (status === 'REJECTED' && trader.verificationProofUrl) {
        await deleteFromCloudinary(trader.verificationProofUrl);
    }

    const updatedTrader = await prisma.user.update({
      where: { id },
      data: {
        verificationStatus: status,
        rejectionReason: status === 'REJECTED' ? reason : null,
        verificationProofUrl: status === 'REJECTED' ? null : trader.verificationProofUrl,
        reviewedByAdminId: decoded.id,
        verifiedAt: status === 'APPROVED' ? new Date() : null,
      },
    });

    // Send emails
    try {
        if (status === 'APPROVED') {
            await sendVerificationApprovalEmail(updatedTrader.email, updatedTrader.name);
        } else {
            await sendVerificationRejectionEmail(updatedTrader.email, updatedTrader.name, reason);
        }
    } catch (mailError) {
        console.error('Failed to send verification email:', mailError);
        // Do not block the update if email fails
    }

    return NextResponse.json({ message: `Trader ${status.toLowerCase()} successfully` }, { status: 200 });
  } catch (error) {
    console.error('Admin verify trader error:', error);
    return NextResponse.json({ error: 'Failed to verify trader' }, { status: 500 });
  }
}
