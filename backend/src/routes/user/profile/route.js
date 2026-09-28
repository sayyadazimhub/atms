import { Router } from 'express';

import { verifyUserToken } from '../../../lib/auth.js';
import { profileService } from '../../../services/userService/profileService.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { userProfileSchema } from '../../../validations/resources.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const profile = await profileService.getProfile(decoded.id);
    return res.status(200).json(profile);
  } catch (err) {
    console.error('User Profile GET:', err);
    return res.status(err.message === 'User not found' ? 404 : 500).json({
      error: err.message === 'User not found' ? 'User not found' : 'Failed to fetch profile',
    });
  }
}

async function handlePut(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const body = req.body;
    const updated = await profileService.updateProfile(decoded.id, body);

    return res.json(updated);
  } catch (err) {
    console.error('User Profile PUT:', err);
    const status = err.message === 'Name is required' ? 400 : 500;
    return res.status(status).json({
      error: err.message === 'Name is required' ? 'Name is required' : 'Failed to update profile',
    });
  }
}

router.get('/', handleGet);
router.put('/', validateRequest(userProfileSchema), handlePut);

export default router;
