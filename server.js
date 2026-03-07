const http = require('http');
const { Client } = require('pg');

const port = process.env.PORT || 3000;

function readBody(req) {
return new Promise((resolve, reject) => {
let data = '';
req.on('data', chunk => (data += chunk));
req.on('end', () => resolve(data));
req.on('error', reject);
});
}
http.createServer(async (req, res) => {
if (req.url === '/health') {
res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: true, service: 'api' }));
}

if (req.url === '/db-check') {
try {
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const q = await client.query('select now() as time');
await client.end();

res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: true, dbTime: q.rows[0].time }));
} catch (e) {
res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: false, error: String(e), message: e?.message || null }));
}
}

if (req.url === '/tasks' && req.method === 'GET') {
try {
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const q = await client.query(`
select id, company_id, title, status, priority, due_at, created_at
from tasks
order by created_at desc
limit 100
`);

await client.end();

res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: true, items: q.rows }));
} catch (e) {
res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: false, error: String(e), message: e?.message || null }));
}
}

if (req.url === '/tasks' && req.method === 'POST') {
try {
const raw = await readBody(req);
const body = raw ? JSON.parse(raw) : {};

const company_id = body.company_id;
const title = body.title;
const status = body.status || 'new';
const priority = body.priority || 'medium';
const due_at = body.due_at || null;

if (!company_id || !title) {
res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({
ok: false,
error: 'company_id and title are required'
}));
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const q = await client.query(
`
insert into tasks (id, company_id, title, status, priority, due_at, created_at)
values (gen_random_uuid(), $1, $2, $3, $4, $5, now())
returning id, company_id, title, status, priority, due_at, created_at
`,
[company_id, title, status, priority, due_at]
);

await client.end();

res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: true, item: q.rows[0] }));
} catch (e) {
res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: false, error: String(e), message: e?.message || null }));
}
}

if (req.url === '/companies' && req.method === 'POST') {
try {
const raw = await readBody(req);
const body = raw ? JSON.parse(raw) : {};

const name = body.name;
if (!name) {
res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: false, error: 'name is required' }));
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const q = await client.query(
`
insert into companies (id, name, created_at)
values (gen_random_uuid(), $1, now())
returning id, name, created_at
`,
[name]
);

await client.end();

res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: true, item: q.rows[0] }));
} catch (e) {
res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: false, error: String(e), message: e?.message || null }));
}
}

if (req.url === '/messages' && req.method === 'GET') {
try {
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const q = await client.query(`
select id, company_id, user_id, role, content, created_at
from messages
order by created_at desc
limit 100
`);

await client.end();

res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: true, items: q.rows }));
} catch (e) {
res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: false, error: String(e), message: e?.message || null }));
}
}
if (req.url === '/messages' && req.method === 'POST') {
try {
const raw = await readBody(req);
const body = raw ? JSON.parse(raw) : {};

const company_id = String(body.company_id || '').replace(/^"+|"+$/g, '');
const user_id = body.user_id ? String(body.user_id).replace(/^"+|"+$/g, '') : null;
const role = body.role || 'user';
const content = body.content;

if (!company_id || !content) {
res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: false, error: 'company_id and content are required' }));
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const q = await client.query(
`
insert into messages (id, company_id, user_id, role, content, created_at)
values (gen_random_uuid(), $1, $2, $3, $4, now())
returning id, company_id, user_id, role, content, created_at
`,
[
String(company_id).replace(/"/g, ''),
user_id ? String(user_id).replace(/"/g, '') : null,
role,
content
]
);

await client.end();

res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: true, item: q.rows[0] }));
} catch (e) {
res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
return res.end(JSON.stringify({ ok: false, error: String(e), message: e?.message || null }));
}
}

res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
return res.end('OK: app is running');
}).listen(port);

