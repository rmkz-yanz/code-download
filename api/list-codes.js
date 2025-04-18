import { readCodes } from './utils';

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const codes = readCodes();
      return res.status(200).json(codes);
    } catch (err) {
      console.error('Error listing codes:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
