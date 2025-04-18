import { readCodes } from './utils';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const code = req.body?.code?.trim();

      if (!code) {
        return res.status(400).json({ error: 'Code is required' });
      }

      const codes = readCodes();
      const codeData = codes[code];

      if (codeData && codeData.url) {
        return res.redirect(codeData.url);
      } else {
        return res.status(404).json({ error: 'Kode tidak ditemukan!' });
      }
    } catch (err) {
      console.error('Error checking code:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
