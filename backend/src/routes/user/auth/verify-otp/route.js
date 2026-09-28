import { Router } from 'express';

import { authService } from '../../../../services/userService/authService.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { verifyOtpSchema } from '../../../../validations/auth.js';

const router = Router({ mergeParams: true });

async function handlePost(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const { token, user } = await authService.verifyOtp(email, otp);

    res.cookie('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    return res.status(200).json({ message: 'Email verified successfully', user });
  } catch (err) {
    console.error('OTP verify error:', err);
    return res
      .status(err.message === 'Invalid or expired OTP' ? 400 : 500)
      .json({ error: err.message || 'Verification failed' });
  }
}

router.post('/', validateRequest(verifyOtpSchema), handlePost);

export default router;
