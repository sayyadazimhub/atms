import { NextResponse } from 'next/server';
import { authService } from '@/services/userService/authService';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const settings = await prisma.systemSetting.findFirst();
    if (settings && settings.maintenanceMode) {
      return NextResponse.json({ error: 'System is currently under maintenance' }, { status: 503 });
    }

    const { email, password } = await request.json();
    
    let fieldErrors = {};
    if (!email) fieldErrors.email = 'Email is required';
    if (!password) fieldErrors.password = 'Password is required';
    
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { errors: fieldErrors },
        { status: 400 }
      );
    }

    const { token, user } = await authService.login(email, password);

    const response = NextResponse.json(
      { message: 'Login successful', user },
      { status: 200 }
    );

    response.cookies.set('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('User login error:', err);
    return NextResponse.json(
      { error: err.message || 'Login failed' },
      { status: (err.message === 'Invalid credentials' || err.message.includes('verify your email')) ? 401 : 500 }
    );
  }
}
