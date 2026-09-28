import { Router } from 'express';

import { reportService } from '../../../services/userService/reportService.js';
import { validateRequest } from '../../../middleware/validateRequest.js';
import { userReportQuerySchema } from '../../../validations/queries.js';

const router = Router({ mergeParams: true });

async function handleGet(req, res) {
  try {
    const options = {
      type: req.query.type || 'today',
      start: req.query.start,
      end: req.query.end,
    };

    const data = await reportService.getUserReports(req.auth.id, options);

    return res.status(200).json(data);
  } catch (err) {
    console.error('User Reports GET error:', err);
    return res.json({ error: 'Failed to load reports' });
  }
}

router.get('/', validateRequest(userReportQuerySchema, 'query'), handleGet);

export default router;
