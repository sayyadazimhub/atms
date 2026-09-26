

import { verifyUserToken } from '../../../lib/auth.js';
import { settingsService } from '../../../services/userService/settingsService.js';

export async function GET(req, res) {
  const params = req.params || {};
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

export async function PUT(req, res) {
  const params = req.params || {};
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
