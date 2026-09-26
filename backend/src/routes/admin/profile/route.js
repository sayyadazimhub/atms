

import { verifyUserToken } from '../../../lib/auth.js';
import { profileService } from '../../../services/adminService/profileService.js';

export async function GET(req, res) {
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = await verifyUserToken(token);
        if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

        const admin = await profileService.getProfile(decoded.id);
        return res.status(200).json(admin);
    } catch (error) {
        console.error('Admin Profile GET:', error);
        return res.status(error.message === 'Admin not found' ? 404 : 500).json({ error: error.message === 'Admin not found' ? 'Admin not found' : 'Internal Server Error' });
    }
}

export async function PUT(req, res) {
  const params = req.params || {};
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.json({ error: 'Unauthorized' });

        const decoded = await verifyUserToken(token);
        if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

        const body = req.body;
        const admin = await profileService.updateProfile(decoded.id, body);

        return res.status(200).json(admin);
    } catch (error) {
        console.error('Admin Profile PUT:', error);
        return res.json({ error: 'Failed to update profile' });
    }
}
