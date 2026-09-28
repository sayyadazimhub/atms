import { Router } from 'express';

import { verifyUserToken } from '../../../lib/auth.js';
import { settingsService } from '../../../services/userService/settingsService.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { userSettingsSchema } from '../../../validations/resources.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const settings = await settingsService.getSettings(decoded.id);

    return res.status(200).json(settings);
  } catch (err) {
    console.error('Settings GET error:', err);
    return res.json({ error: 'Failed to fetch settings' });
  }
}

async function handlePut(req, res) {
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const body = req.body;
    const settings = await settingsService.updateSettings(decoded.id, body);

    return res.status(200).json(settings);
  } catch (err) {
    console.error('Settings PUT error:', err);
    return res.json({ error: 'Failed to update settings' });
  }
}

router.get('/', handleGet);
router.put('/', validateRequest(userSettingsSchema), handlePut);

export default router;
