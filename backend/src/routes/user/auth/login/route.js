
import { authService } from '../../../../services/userService/authService.js';
import db from '../../../../config/db.js';

export async function POST(req, res) {
  const params = req.params || {};
  try {
    const settings = await db.systemSetting.findFirst();
    if (settings && settings.maintenanceMode) {
      return res.status(503).json({ error: 'System is currently under maintenance' });
    }

    const { email, password } = req.body;
    
    let fieldErrors = {};
    if (!email) fieldErrors.email = 'Email is required';
    if (!password) fieldErrors.password = 'Password is required';
    
    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({ errors: fieldErrors });
    }

    const { token, user } = await authService.login(email, password);

    res.cookie('user-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });
    return res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('User login error:', err);
    return res.status((err.message === 'Invalid credentials' || err.message.includes('verify your email')) ? 401 : 500).json({ error: err.message || 'Login failed' });
  }
}
