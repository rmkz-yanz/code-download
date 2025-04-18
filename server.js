const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read codes
const readCodes = () => {
  try {
    const data = fs.readFileSync('codes.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist, create it
      fs.writeFileSync('codes.json', '{}');
      return {};
    }
    throw err;
  }
};

// Helper function to write codes
const writeCodes = (codes) => {
  fs.writeFileSync('codes.json', JSON.stringify(codes, null, 2));
};

// Route to check code
app.post('/check-code', (req, res) => {
  const code = req.body.code.trim();

  try {
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
});

// Route to add new code
app.post('/add-code', (req, res) => {
  const { code, name, url } = req.body;
  
  if (!code || !name || !url) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const codes = readCodes();

    // Check if code already exists
    if (codes[code]) {
      return res.status(400).json({ message: 'Code already exists' });
    }

    // Add new code with name and url
    codes[code] = {
      url: url,
      name: name
    };

    writeCodes(codes);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error adding code:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all codes (for management)
app.get('/list-codes', (req, res) => {
  try {
    const codes = readCodes();
    return res.status(200).json(codes);
  } catch (err) {
    console.error('Error listing codes:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Route to delete a code
app.delete('/delete-code/:code', (req, res) => {
  const code = req.params.code;

  try {
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
});

const multer = require('multer');

// Folder upload: public/file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'file'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage: storage });

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload' });
  }
  res.status(200).json({ success: true, filename: req.file.filename });
});

// Serve add.html
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'add251.html'));
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware untuk error 404 - Not Found
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'error.html'));
});

// Middleware untuk error 500 - Internal Server Error
app.use((err, req, res, next) => {
  console.error('Terjadi error internal:', err.stack);
  res.status(500).sendFile(path.join(__dirname, 'public', 'error.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});