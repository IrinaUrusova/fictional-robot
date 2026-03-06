const http = require('http');
const port = process.env.PORT || 4000;
http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/health') return res.end(JSON.stringify({ ok: true, service: 'api' }));
  return res.end(JSON.stringify({ ok: true, message: 'API is running' }));
}).listen(port, () => console.log(`API on :${port}`));
