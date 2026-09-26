

import { verifyUserToken } from '../../../lib/auth.js';
import { dashboardService } from '../../../services/userService/dashboardService.js';

export async function GET(req, res) {
  const params = req.params || {};
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const startDateParam = req.query.startDate;
    const endDateParam = req.query.endDate;

    const data = await dashboardService.getDashboardData(decoded.id, startDateParam, endDateParam);

    return res.status(200).json(data);
  } catch (err) {
    console.error('Dashboard GET:', err);
    return res.json({ error: 'Failed to load dashboard' });
  }
}
