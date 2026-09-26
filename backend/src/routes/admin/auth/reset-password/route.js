
import db from '../../../../config/db.js';
import { hashPassword } from '../../../../lib/auth.js';

export async function POST(req, res) {
  const params = req.params || {};
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    const admin = await db.admin.findFirst({
      where: { resetToken: token, resetTokenExp: { gte: new Date() } },
    });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }
    const hashed = await hashPassword(password);
    await db.admin.update({
      where: { id: admin.id },
      data: { password: hashed, resetToken: null, resetTokenExp: null },
    });
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Reset failed' });
  }
}
