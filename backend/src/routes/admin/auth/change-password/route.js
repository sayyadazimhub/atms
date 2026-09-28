import { Router } from 'express';

import { verifyAdminToken } from '../../../../lib/auth.js';
import { authService } from '../../../../services/adminService/authService.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { changePasswordSchema } from '../../../../validations/auth.js';

const router = Router({ mergeParams: true });

async function handlePut(req, res) {
  try {
    const token = req.cookies['auth-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = await verifyAdminToken(token);
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

router.put('/', validateRequest(changePasswordSchema), handlePut);

export default router;
