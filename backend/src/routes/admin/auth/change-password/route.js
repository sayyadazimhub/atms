

import { verifyToken } from '../../../../lib/auth.js';
import { authService } from '../../../../services/adminService/authService.js';

export async function PUT(req, res) {
  const params = req.params || {};
  try {
    const token = req.cookies['auth-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    await authService.forceChangePassword(decoded.id, newPassword);

    return res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: err.message || 'Update failed' });
  }
}

