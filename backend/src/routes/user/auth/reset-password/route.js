import { Router } from 'express';

import { authDal } from '../../../../dal/userDal/authDal.js';
import { hashPassword } from '../../../../lib/auth.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { userResetPasswordSchema } from '../../../../validations/auth.js';

const router = Router({ mergeParams: true });

async function handlePost(req, res) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP and new password are required' });
    }
    const user = await authDal.findByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    if (user.otp !== otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    const hashed = await hashPassword(newPassword);
    await authDal.update(user.id, { password: hashed, otp: null, otpExpiresAt: null });
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('User reset password error:', err);
    return res.status(500).json({ error: 'Reset failed' });
  }
}

router.post('/', validateRequest(userResetPasswordSchema), handlePost);

export default router;
