import { Router } from 'express';

import { authDal } from '../../../../dal/userDal/authDal.js';
import { sendOtpEmail } from '../../../../lib/mail.js';
import crypto from 'crypto';

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

const router = Router({ mergeParams: true });

async function handlePost(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const user = await authDal.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await authDal.update(user.id, { otp, otpExpiresAt, resetToken: null, resetTokenExp: null });
    await sendOtpEmail(email, otp, 'reset');
    return res.status(200).json({ message: 'OTP sent to your email. It expires in 10 minutes.' });
  } catch (err) {
    console.error('User forgot password error:', err);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
}

router.post('/', handlePost);

export default router;
