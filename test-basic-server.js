const http = require('http');

console.log('Creating basic HTTP server...');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`Basic server working at ${new Date().toISOString()}\n`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

server.on('listening', () => {
  console.log('✅ Basic server successfully listening on http://127.0.0.1:3001');
});

server.listen(3001, '127.0.0.1', () => {
  console.log('🚀 Basic server started');
});

// Keep server alive and log status
setInterval(() => {
  console.log(`Server alive: ${!server.destroyed} | Listening: ${server.listening}`);
}, 2000); 