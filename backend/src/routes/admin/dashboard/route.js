

import { verifyUserToken } from '../../../lib/auth.js';
import { dashboardService } from '../../../services/adminService/dashboardService.js';

export async function GET(req, res) {
    try {
        const token = req.cookies['auth-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = await verifyUserToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Service handles stats, chart data, and recent traders
        const data = await dashboardService.getDashboardData();

        return res.status(200).json(data);
    } catch (error) {
        console.error('Admin dashboard API error:', error);
        return res.json({ error: 'Internal Server Error' });
    }
}
