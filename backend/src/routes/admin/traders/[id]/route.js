

import { verifyUserToken } from '../../../../lib/auth.js';
import { traderService } from '../../../../services/adminService/traderService.js';

export async function GET(req, res) {
  const params = req.params || {};
    try {
        const token = req.cookies['auth-token'];
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = await verifyUserToken(token);
        if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

        const { id } = await params;

        const data = await traderService.getTraderDetail(id);

        return res.status(200).json(data);
    } catch (error) {
        console.error('Admin trader detail API error:', error);
        if (error.message === 'Trader not found') {
            return res.json({ error: 'Trader not found' });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
