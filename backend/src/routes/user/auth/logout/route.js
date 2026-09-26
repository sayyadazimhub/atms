

export async function POST(req, res) {
  res.cookie('user-token', '', { maxAge: 0, path: '/' });
    return res.status(200).json({ message: 'Logged out' });
}
