import { readCodes, writeCodes } from './utils';

export default function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const { code } = req.query;

      if (!code) {
        return res.status(400).json({ message: 'Code is required' });
      }

      const codes = readCodes();

      if (!codes[code]) {
        return res.status(404).json({ message: 'Code not found' });
      }

      delete codes[code];
      writeCodes(codes);

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Error deleting code:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
