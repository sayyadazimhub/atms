import { Router } from 'express';
import { hashPassword } from '../../../lib/auth.js';
import { authDal } from '../../../dal/adminDal/authDal.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { adminSearchQuerySchema, idQuerySchema } from '../../../validations/queries.js';
import { adminCreateSchema, adminUpdateSchema } from '../../../validations/resources.js';



const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {

    const { search = '' } = req.query;

    const admins = await authDal.findMany(String(search));

    return res.status(200).json({ admins });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch admins' });
  }
}

async function handlePost(req, res) {
  try {

    const body = req.body;
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingAdmin = await authDal.findByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = await authDal.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'ADMIN',
    });

    return res.status(201).json({
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      is_active: newAdmin.is_active,
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return res.status(500).json({ error: 'Failed to create admin' });
  }
}

async function handlePut(req, res) {
  try {
    const adminReq = req.auth;
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

    const updatedAdmin = await authDal.update(id, updateData);

    return res.status(200).json({
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      is_active: updatedAdmin.is_active,
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return res.status(500).json({ error: 'Failed to update admin' });
  }
}

async function handleDelete(req, res) {
  try {
    const adminReq = req.auth;
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Admin ID is required' });
    }

    if (id === adminReq.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    await authDal.delete(id);

    return res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({ error: 'Failed to delete admin' });
  }
}

router.get('/', validateRequest(adminSearchQuerySchema, 'query'), handleGet);
router.post('/', validateRequest(adminCreateSchema), handlePost);
router.put('/', validateRequest(adminUpdateSchema), handlePut);
router.delete('/', validateRequest(idQuerySchema, 'query'), handleDelete);

export default router;
