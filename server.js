const express = require('express');
const multer = require('multer');
const jsonServer = require('json-server');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const upload = multer({ dest: 'public/images/' });

// Serve static files
app.use(express.static('public'));

// Handle file uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.json({ 
    imageUrl: `./${req.file.filename}`
  });
});

// Proxy other API routes to json-server
const jsonServerRouter = jsonServer.router('data.json');
app.use('/courses', jsonServerRouter);
app.use('/users', jsonServerRouter); // Add other routes as needed

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});