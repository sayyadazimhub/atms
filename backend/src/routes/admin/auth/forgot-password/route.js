import { Router } from 'express';

import { authDal } from '../../../../dal/adminDal/authDal.js';
import { generateResetToken } from '../../../../lib/auth.js';
import { sendResetEmail } from '../../../../lib/mail.js';

const router = Router({ mergeParams: true });

async function handlePost(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const admin = await authDal.findByEmail(email);
    if (!admin) {
      return res.status(404).json({ error: 'No account found with this email' });
    }
    const token = generateResetToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await authDal.update(admin.id, { resetToken: token, resetTokenExp: expires });
    const baseUrl = process.env.ADMIN_URL || process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    await sendResetEmail(admin.email, resetLink);
    return res.status(200).json({ message: 'Reset instructions sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to send reset email' });
  }
}

router.post('/', handlePost);

export default router;
