const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔍 Starting Next.js with advanced debugging...');

// Clear previous debug log
if (fs.existsSync('nextjs-detailed.log')) {
  fs.unlinkSync('nextjs-detailed.log');
}

const logStream = fs.createWriteStream('nextjs-detailed.log', { flags: 'a' });

const child = spawn('npx', ['next', 'start', '-p', '3001'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: {
    ...process.env,
    DEBUG: '*',
    NEXT_DEBUG: '1',
    NODE_OPTIONS: '--trace-warnings --trace-uncaught'
  }
});

// Log everything
child.stdout.on('data', (data) => {
  const message = `[STDOUT ${new Date().toISOString()}] ${data}`;
  console.log(message);
  logStream.write(message);
});

child.stderr.on('data', (data) => {
  const message = `[STDERR ${new Date().toISOString()}] ${data}`;
  console.error(message);
  logStream.write(message);
});

child.on('close', (code, signal) => {
  const message = `[EXIT ${new Date().toISOString()}] Process exited: code=${code}, signal=${signal}\n`;
  console.log(message);
  logStream.write(message);
  logStream.end();
});

child.on('error', (err) => {
  const message = `[ERROR ${new Date().toISOString()}] Failed to start: ${err}\n`;
  console.error(message);
  logStream.write(message);
});

// Monitor child process health
const healthCheck = setInterval(() => {
  const status = child.killed ? 'DEAD' : 'ALIVE';
  const message = `[HEALTH ${new Date().toISOString()}] Process status: ${status}\n`;
  console.log(message);
  logStream.write(message);
  
  if (child.killed) {
    clearInterval(healthCheck);
  }
}, 1000);

console.log('Debug output will be saved to nextjs-detailed.log'); 