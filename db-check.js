const { Client } = require('pg');

(async () => {
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
const res = await client.query('select now() as time');
console.log('DB OK:', res.rows[0].time);
await client.end();
})();
