const http = require('http');
const { Client } = require('pg');

const port = process.env.PORT || 3000;

http.createServer(async (req, res) => {
if (req.url === '/db-check') {
try {
const client = new Client({
connectionString: process.env.DATABASE_URL,
ssl: { rejectUnauthorized: false }
});
await client.connect();
const q = await client.query('select now() as time');
await client.end();

res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: true, dbTime: q.rows[0].time }));
} catch (e) {
res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: false, error: e.message }));
}
}

res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
res.end('OK: app is running');
}).listen(port);
