
import db from '../../../../config/db.js';
import { hashPassword } from '../../../../lib/auth.js';

export async function POST(req, res) {
  const params = req.params || {};
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP and new password are required' });
    }
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    if (user.otp !== otp || !user.otpExpiresAt || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    const hashed = await hashPassword(newPassword);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashed, otp: null, otpExpiresAt: null },
    });
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('User reset password error:', err);
    return res.status(500).json({ error: 'Reset failed' });
  }
}
