const { Client } = require('pg');
const fs = require('fs');

(async () => {
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const sql = fs.readFileSync('./schema.sql', 'utf8');
await client.query(sql);
await client.end();
console.log('migration done');
})();
