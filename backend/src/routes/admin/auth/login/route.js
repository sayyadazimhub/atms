
import { authService } from '../../../../services/adminService/authService.js';

export async function POST(req, res) {
  const params = req.params || {};
  try {
    const { email, password } = req.body;
    console.log('Login attempt via API:', req.body);
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { token, admin } = await authService.login(email, password);

    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    return res.status(200).json({ message: 'Login successful', admin });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(err.message === 'Invalid credentials' ? 401 : 500).json({ error: err.message || 'Login failed' });
  }
}
