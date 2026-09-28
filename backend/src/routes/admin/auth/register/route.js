import { Router } from 'express';

import { verifyAdminToken } from '../../../../lib/auth.js';
import { authService } from '../../../../services/adminService/authService.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { adminRegistrationSchema } from '../../../../validations/auth.js';

const router = Router({ mergeParams: true });

async function handlePost(req, res) {
  try {
    const existingAdminToken = req.cookies['auth-token'];
    if (!existingAdminToken || !(await verifyAdminToken(existingAdminToken))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const body = req.body;
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const { token, admin } = await authService.register({ name, email, password, phone });

    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    return res.status(201).json({ message: 'Registration successful', admin });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
}

router.post('/', validateRequest(adminRegistrationSchema), handlePost);

export default router;
