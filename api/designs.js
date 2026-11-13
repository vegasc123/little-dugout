// POST /api/designs        saves a design, answers { id }
// GET  /api/designs?id=…   reads one back
// The database address (DATABASE_URL) is added to the project by Vercel when the database is connected.
import { neon } from '@neondatabase/serverless';
import { randomBytes } from 'node:crypto';
import { cleanDesign } from '../lib/design.js';

let ready = null;
function db() {
  const sql = neon(process.env.DATABASE_URL);
  if (!ready) {
    ready = sql`create table if not exists designs (
      id text primary key,
      created_at timestamptz not null default now(),
      data jsonb not null
    )`.catch((e) => { ready = null; throw e; });
  }
  return ready.then(() => sql);
}

export default async function handler(req, res) {
  if (!process.env.DATABASE_URL) return res.status(503).json({ error: 'database-not-configured' });
  try {
    if (req.method === 'POST') {
      let design;
      try { design = cleanDesign(req.body); } catch (e) { return res.status(400).json({ error: e.message }); }
      const id = randomBytes(9).toString('base64url');
      const sql = await db();
      await sql`insert into designs (id, data) values (${id}, ${JSON.stringify(design)}::jsonb)`;
      return res.status(201).json({ id });
    }
    if (req.method === 'GET') {
      const id = String(req.query.id || '');
      if (!/^[A-Za-z0-9_-]{12}$/.test(id)) return res.status(400).json({ error: 'bad id' });
      const sql = await db();
      const rows = await sql`select id, created_at, data from designs where id = ${id}`;
      if (!rows.length) return res.status(404).json({ error: 'not found' });
      return res.status(200).json(rows[0]);
    }
    return res.status(405).json({ error: 'method' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server' });
  }
}
