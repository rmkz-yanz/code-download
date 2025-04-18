import multer from 'multer';
import nextConnect from 'next-connect';
import path from 'path';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/file',
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + file.originalname;
      cb(null, unique);
    }
  })
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error('Upload error:', error);
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' not allowed` });
  }
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.status(200).json({ success: true, filename: req.file.filename });
  } catch (err) {
    console.error('Error handling upload:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false
  }
};
