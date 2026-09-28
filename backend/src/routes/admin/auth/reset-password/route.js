import { Router } from 'express';

import { authDal } from '../../../../dal/adminDal/authDal.js';
import { hashPassword } from '../../../../lib/auth.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { adminResetPasswordSchema } from '../../../../validations/auth.js';

const router = Router({ mergeParams: true });

async function handlePost(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    const admin = await authDal.findByResetToken(token);
    if (!admin) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }
    const hashed = await hashPassword(password);
    await authDal.update(admin.id, { password: hashed, resetToken: null, resetTokenExp: null });
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Reset failed' });
  }
}

router.post('/', validateRequest(adminResetPasswordSchema), handlePost);

export default router;
