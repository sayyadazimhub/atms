import { verifyAdminToken } from '../lib/auth.js';

export async function requireAdminSession(req, res, next) {
  const token = req.cookies?.['auth-token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const admin = await verifyAdminToken(token);
  if (!admin?.id) return res.status(401).json({ error: 'Unauthorized' });

  req.auth = admin;
  return next();
}
