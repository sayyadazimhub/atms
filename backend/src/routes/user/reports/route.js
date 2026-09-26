

import { verifyUserToken } from '../../../lib/auth.js';
import { reportService } from '../../../services/userService/reportService.js';

export async function GET(req, res) {
  const params = req.params || {};
  try {
    const token = req.cookies['user-token'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = await verifyUserToken(token);
    if (!decoded) return res.status(401).json({ error: 'Unauthorized' });

    const options = {
      type: req.query.type || 'today',
      start: req.query.start,
      end: req.query.end
    };

    const data = await reportService.getUserReports(decoded.id, options);

    return res.status(200).json(data);
  } catch (err) {
    console.error('User Reports GET error:', err);
    return res.json({ error: 'Failed to load reports' });
  }
}
