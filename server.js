const express = require('express');
const path = require('node:path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
  );
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.get('/learning', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'learning.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'quiz.html'));
});

app.use(express.static(PUBLIC_DIR, { index: false, dotfiles: 'ignore' }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CyberShield запущен: http://0.0.0.0:${PORT}`);
});
