import { NextResponse } from 'next/server';
import { authService } from '@/services/userService/authService';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const settings = await prisma.systemSetting.findFirst();
    if (settings && !settings.traderSelfRegistration) {
      return NextResponse.json({ error: 'Registration is currently disabled by the administrator' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    const { email: registeredEmail } = await authService.register({ name, email, password, phone });

    // Send admin notification if enabled
    if (settings && settings.notifyOnNewTrader) {
      try {
        const { sendNewTraderNotification } = await import('@/lib/mail');
        // Fetch active admin emails
        const activeAdmins = await prisma.admin.findMany({
          where: { is_active: true },
          select: { email: true }
        });
        const adminEmails = activeAdmins.map(a => a.email);
        
        if (adminEmails.length > 0) {
          await sendNewTraderNotification(adminEmails, { name, email, phone });
        }
      } catch (mailError) {
        console.error('Failed to send admin notification email:', mailError);
        // Do not block registration if email fails
      }
    }

    return NextResponse.json(
      { message: 'Registration successful. Check your email for the OTP to verify your account.', email: registeredEmail },
      { status: 201 }
    );
  } catch (err) {
    console.error('User register error:', err);
    return NextResponse.json(
      { error: err.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
