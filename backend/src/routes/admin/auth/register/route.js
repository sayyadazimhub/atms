
import { authService } from '../../../../services/adminService/authService.js';

export async function POST(req, res) {
  const params = req.params || {};
  try {
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
