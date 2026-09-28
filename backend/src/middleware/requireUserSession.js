import { verifyUserToken } from '../lib/auth.js';

export async function requireUserSession(req, res, next) {
  const token = req.cookies?.['user-token'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const user = await verifyUserToken(token);
  if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

  req.auth = user;
  return next();
}
