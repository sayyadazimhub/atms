import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken, hashPassword } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function requireAdmin() {
  const token = (await cookies()).get('auth-token')?.value;
  if (!token) throw new Error('Unauthorized');
  const decoded = await verifyUserToken(token);
  if (!decoded) throw new Error('Unauthorized');
  return decoded;
}

export async function GET(request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const admins = await prisma.admin.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        is_active: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ admins });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'ADMIN'
      },
      select: { id: true, name: true, email: true, is_active: true }
    });

    return NextResponse.json(newAdmin, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const adminReq = await requireAdmin();
    const body = await request.json();
    const { id, name, phone, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    if (id === adminReq.id && is_active === false) {
      return NextResponse.json({ error: 'You cannot suspend your own account' }, { status: 400 });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (is_active !== undefined) updateData.is_active = is_active;

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, is_active: true }
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const adminReq = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    if (id === adminReq.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}
