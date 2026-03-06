const { Client } = require('pg');

(async () => {
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const q = await client.query(`
select table_name
from information_schema.tables
where table_schema = 'public'
and table_name in ('companies','users','tasks','messages','reports')
order by table_name;
`);

await client.end();
console.log(JSON.stringify({ ok: true, tables: q.rows.map(r => r.table_name) }));
})();
