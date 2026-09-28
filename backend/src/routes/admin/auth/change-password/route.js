import { Router } from 'express';

import { authService } from '../../../../services/adminService/authService.js';
import { validateRequest } from '../../../../middleware/validateRequest.js';
import { changePasswordSchema } from '../../../../validations/auth.js';

const router = Router({ mergeParams: true });

async function handlePut(req, res) {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    await authService.forceChangePassword(req.auth.id, newPassword);

    return res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: err.message || 'Update failed' });
  }
}

router.put('/', validateRequest(changePasswordSchema), handlePut);

export default router;
