import { verifyUserToken, hashPassword } from '../../../lib/auth.js';
import db from '../../../config/db.js';

async function requireAdmin(req) {
  const token = req.cookies['auth-token'];
  if (!token) throw new Error('Unauthorized');
  const decoded = await verifyUserToken(token);
  if (!decoded) throw new Error('Unauthorized');
  return decoded;
}

export async function GET(req, res) {
  const params = req.params || {};
  try {
    await requireAdmin(req);
    const { search = '' } = req.query;

    const admins = await db.admin.findMany({
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

    return res.status(200).json({ admins });
  } catch (error) {
    const status = error.message === 'Unauthorized' ? 401 : 500;
    return res.status(status).json({ error: status === 401 ? 'Unauthorized' : 'Failed to fetch admins' });
  }
}

export async function POST(req, res) {
  const params = req.params || {};
  try {
    await requireAdmin(req);
    const body = req.body;
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingAdmin = await db.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    
    const newAdmin = await db.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'ADMIN'
      },
      select: { id: true, name: true, email: true, is_active: true }
    });

    return res.status(201).json(newAdmin);
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ error: 'Failed to create admin' });
  }
}

export async function PUT(req, res) {
  const params = req.params || {};
  try {
    const adminReq = await requireAdmin(req);
    const body = req.body;
    const { id, name, phone, is_active } = body;

    if (!id) {
      return res.status(400).json({ error: 'Admin ID is required' });
    }

    if (id === adminReq.id && is_active === false) {
      return res.status(400).json({ error: 'You cannot suspend your own account' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (is_active !== undefined) updateData.is_active = is_active;

    const updatedAdmin = await db.admin.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, is_active: true }
    });

    return res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin:', error);
    const status = error.message === 'Unauthorized' ? 401 : 500;
    return res.status(status).json({ error: status === 401 ? 'Unauthorized' : 'Failed to update admin' });
  }
}

export async function DELETE(req, res) {
  const params = req.params || {};
  try {
    const adminReq = await requireAdmin(req);
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Admin ID is required' });
    }

    if (id === adminReq.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    await db.admin.delete({ where: { id } });

    return res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    const status = error.message === 'Unauthorized' ? 401 : 500;
    return res.status(status).json({ error: status === 401 ? 'Unauthorized' : 'Failed to delete admin' });
  }
}
