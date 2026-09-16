import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { authService } from '@/services/adminService/authService';

export async function PUT(request) {
  try {
    const token = (await cookies()).get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { newPassword } = await request.json();
    if (!newPassword) {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    await authService.forceChangePassword(decoded.id, newPassword);

    return NextResponse.json({ message: 'Password updated' }, { status: 200 });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json(
      { error: err.message || 'Update failed' },
      { status: 500 }
    );
  }
}

