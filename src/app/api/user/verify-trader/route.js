import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const token = (await cookies()).get('user-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await verifyUserToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('proof');
    const state = formData.get('state');
    const district = formData.get('district');

    if (!file) {
      return NextResponse.json({ error: 'Proof document is required' }, { status: 400 });
    }

    if (!state || !district) {
      return NextResponse.json({ error: 'State and district are required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(buffer, 'atms/proofs', file.name);

    // Update user record
    await prisma.user.update({
      where: { id: decoded.id },
      data: {
        state,
        district,
        verificationProofUrl: uploadResult.secure_url,
        verificationStatus: 'PENDING',
        rejectionReason: null, // Clear any previous rejection reason
      },
    });

    return NextResponse.json({ message: 'Verification application submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Verify trader error:', error);
    return NextResponse.json({ error: 'Failed to submit verification' }, { status: 500 });
  }
}
