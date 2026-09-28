import { Router } from 'express';

const router = Router({ mergeParams: true });

async function handlePost(req, res) {
  res.cookie('auth-token', '', { maxAge: 0, path: '/' });
  return res.status(200).json({ message: 'Logged out' });
}

router.post('/', handlePost);

export default router;
