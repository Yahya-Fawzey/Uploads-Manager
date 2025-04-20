const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('file'), (req, res) => {
  res.sendStatus(200);
});

app.get('/files', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json([]);
    res.json(files);
  });
});

app.delete('/delete/:filename', (req, res) => {
  const file = path.join(uploadDir, req.params.filename);
  fs.unlink(file, err => {
    if (err) return res.sendStatus(500);
    res.sendStatus(200);
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
