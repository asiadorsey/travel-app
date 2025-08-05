const express = require('express');
const path = require('path');

console.log('🚀 Starting Express alternative server...');

const app = express();

// Serve static files
app.use(express.static('.next/static'));
app.use(express.static('public'));

// Fallback route
app.get('*', (req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  res.sendFile(path.join(__dirname, '.next/static/index.html'), (err) => {
    if (err) {
      console.error('File serve error:', err);
      res.status(404).send('Not found');
    }
  });
});

const server = app.listen(3001, '127.0.0.1', () => {
  console.log('✅ Express server running on http://127.0.0.1:3001');
});

server.on('error', (err) => {
  console.error('❌ Express server error:', err);
}); 