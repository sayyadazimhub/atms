
import db from '../../../../config/db.js';
import { generateResetToken } from '../../../../lib/auth.js';
import { sendResetEmail } from '../../../../lib/mail.js';

export async function POST(req, res) {
  const params = req.params || {};
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const admin = await db.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(404).json({ error: 'No account found with this email' });
    }
    const token = generateResetToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await db.admin.update({
      where: { id: admin.id },
      data: { resetToken: token, resetTokenExp: expires },
    });
    const baseUrl = process.env.ADMIN_URL || process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    await sendResetEmail(admin.email, resetLink);
    return res.status(200).json({ message: 'Reset instructions sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to send reset email' });
  }
}
