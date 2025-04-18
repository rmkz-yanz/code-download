import { readCodes, writeCodes } from './utils';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { code, name, url } = req.body;

      if (!code || !name || !url) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const codes = readCodes();

      if (codes[code]) {
        return res.status(400).json({ message: 'Code already exists' });
      }

      codes[code] = { url, name };
      writeCodes(codes);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Error adding code:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
