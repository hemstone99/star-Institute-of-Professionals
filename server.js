import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3001);
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'star-institute.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

function runSql(file) {
  const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
  db.exec(sql.replace(/COMMIT;\s*$/i, ''));
}
runSql('db/schema.sql');
runSql('db/seed.sql');
const adminHash = crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD || 'admin123').digest('hex');
db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(adminHash, 'admin');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const tableMap = {
  courses: 'courses', news: 'news', events: 'events', faqs: 'faqs', staff: 'staff', gallery: 'gallery',
  documents: 'documents', announcements: 'announcements', testimonials: 'testimonials',
};
const publicWhere = {
  courses: 'published = 1', news: 'published = 1', events: 'published = 1', faqs: 'published = 1', staff: 'published = 1',
  gallery: 'published = 1', documents: 'published = 1', announcements: 'published = 1', testimonials: 'published = 1',
};
const adminOnly = new Set(['applications', 'messages', 'graduation']);
const toBool = (v) => v === true || v === 1 || v === '1' || v === 'true' ? 1 : 0;
const now = () => new Date().toISOString();
function cleanBody(body) {
  const out = { ...(body || {}) };
  for (const key of ['published', 'featured']) if (key in out) out[key] = toBool(out[key]);
  for (const key of ['display_order']) if (key in out && out[key] !== '') out[key] = Number(out[key]) || 0;
  return out;
}
function slugify(s) { return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function adminUser(req) {
  const token = req.get('X-Admin-Token');
  if (!token) return null;
  const row = db.prepare('SELECT username FROM admin_tokens WHERE token = ? AND expires_at > ?').get(token, now());
  return row?.username || null;
}
function requireAdmin(req, res) { if (!adminUser(req)) { res.status(403).json({ error: 'Forbidden' }); return false; } return true; }
function listRows(table, req) {
  let where = adminUser(req) ? '1=1' : publicWhere[table];
  const params = {};
  const q = req.query;
  if (q.slug) { where += ' AND slug = @slug'; params.slug = String(q.slug); }
  if (q.category) { where += ' AND category = @category'; params.category = String(q.category); }
  if (q.featured === 'true') where += ' AND featured = 1';
  if (q.upcoming === 'true') { where += ' AND datetime(event_date) >= datetime(\'now\')'; }
  if (q.q) { const like = `%${String(q.q).toLowerCase()}%`; where += ' AND (lower(title) LIKE @like OR lower(excerpt) LIKE @like OR lower(description) LIKE @like OR lower(question) LIKE @like OR lower(answer) LIKE @like)'; params.like = like; }
  const order = table === 'courses' || table === 'faqs' || table === 'staff' || table === 'gallery' || table === 'documents' || table === 'testimonials'
    ? 'display_order ASC, id ASC' : table === 'events' ? 'datetime(event_date) ASC' : table === 'news' ? 'datetime(published_at) DESC' : 'datetime(created_at) DESC';
  const limit = Math.min(Math.max(Number(q.limit || 100), 1), 300);
  return db.prepare(`SELECT * FROM ${table} WHERE ${where} ORDER BY ${order} LIMIT ${limit}`).all(params);
}

app.get('/api/health', (_req, res) => res.json({ ok: true, database: DB_PATH }));
app.all('/api/admin-login', (req, res) => {
  try {
    if (req.method === 'POST') {
      const { username, password } = req.body || {};
      const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(String(username || ''));
      const hash = crypto.createHash('sha256').update(String(password || '')).digest('hex');
      if (!user || hash !== user.password_hash) return res.status(401).json({ error: 'Invalid username or password.' });
      const token = crypto.randomBytes(32).toString('hex');
      const expires_at = new Date(Date.now() + 12 * 3600 * 1000).toISOString();
      db.prepare('INSERT INTO admin_tokens (token, username, expires_at) VALUES (?, ?, ?)').run(token, user.username, expires_at);
      return res.json({ token, username: user.username, expires_at });
    }
    if (req.method === 'GET') return adminUser(req) ? res.json({ ok: true, username: adminUser(req) }) : res.status(401).json({ error: 'Expired' });
    if (req.method === 'DELETE') { db.prepare('DELETE FROM admin_tokens WHERE token = ?').run(req.get('X-Admin-Token') || ''); return res.json({ ok: true }); }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) { console.error(e); return res.status(500).json({ error: 'Something went wrong.' }); }
});

for (const [resource, table] of Object.entries(tableMap)) {
  app.all(`/api/${resource}`, (req, res) => {
    try {
      if (req.method === 'GET') return res.json(listRows(table, req));
      if (!requireAdmin(req, res)) return;
      const body = cleanBody(req.body);
      if (req.method === 'POST') {
        if (resource === 'courses' && !body.slug) body.slug = slugify(body.name);
        if ((resource === 'news' || resource === 'events') && !body.slug) body.slug = slugify(body.title);
        const keys = Object.keys(body).filter((k) => /^[a-z_]+$/.test(k) && k !== 'id');
        if (!keys.length) return res.status(400).json({ error: 'No fields supplied.' });
        const stmt = db.prepare(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((k) => '@' + k).join(',')})`);
        const result = stmt.run(Object.fromEntries(keys.map((k) => [k, body[k] ?? ''])));
        return res.status(201).json(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(result.lastInsertRowid));
      }
      const id = Number(req.query.id || body.id);
      if (!id) return res.status(400).json({ error: 'id is required' });
      if (req.method === 'PUT') {
        const keys = Object.keys(body).filter((k) => /^[a-z_]+$/.test(k) && k !== 'id');
        const result = db.prepare(`UPDATE ${table} SET ${keys.map((k) => `${k} = @${k}`).join(',')} WHERE id = @id`).run({ ...body, id });
        if (!result.changes) return res.status(404).json({ error: 'Record not found.' });
        return res.json(db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id));
      }
      if (req.method === 'DELETE') { db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id); return res.json({ ok: true }); }
      return res.status(405).json({ error: 'Method not allowed' });
    } catch (e) { console.error(`${resource} API`, e); return res.status(500).json({ error: 'Unable to process request.' }); }
  });
}

const submissions = {
  applications: { table: 'applications', required: ['first_name', 'last_name', 'email', 'phone'] },
  messages: { table: 'messages', required: ['name', 'email', 'message'] },
  graduation: { table: 'graduation_requests', required: ['name', 'email', 'phone'] },
};
for (const [resource, config] of Object.entries(submissions)) {
  app.all(`/api/${resource}`, (req, res) => {
    try {
      if (req.method === 'POST') {
        const body = cleanBody(req.body); const missing = config.required.find((k) => !String(body[k] || '').trim());
        if (missing) return res.status(400).json({ error: `${missing} is required.` });
        const keys = Object.keys(body).filter((k) => /^[a-z_]+$/.test(k) && k !== 'id');
        const result = db.prepare(`INSERT INTO ${config.table} (${keys.join(',')}) VALUES (${keys.map((k) => '@' + k).join(',')})`).run(Object.fromEntries(keys.map((k) => [k, body[k] ?? ''])));
        return res.status(201).json(db.prepare(`SELECT * FROM ${config.table} WHERE id = ?`).get(result.lastInsertRowid));
      }
      if (!requireAdmin(req, res)) return;
      if (req.method === 'GET') return res.json(db.prepare(`SELECT * FROM ${config.table} ORDER BY datetime(created_at) DESC LIMIT 300`).all());
      const body = cleanBody(req.body); const id = Number(req.query.id || body.id);
      if (req.method === 'PUT') { const keys = Object.keys(body).filter((k) => /^[a-z_]+$/.test(k) && k !== 'id'); db.prepare(`UPDATE ${config.table} SET ${keys.map((k) => `${k} = @${k}`).join(',')} WHERE id = @id`).run({ ...body, id }); return res.json(db.prepare(`SELECT * FROM ${config.table} WHERE id = ?`).get(id)); }
      if (req.method === 'DELETE') { db.prepare(`DELETE FROM ${config.table} WHERE id = ?`).run(id); return res.json({ ok: true }); }
      return res.status(405).json({ error: 'Method not allowed' });
    } catch (e) { console.error(e); return res.status(500).json({ error: 'Unable to process request.' }); }
  });
}

app.get('/api/settings', (_req, res) => { const rows = db.prepare('SELECT key,value FROM site_settings').all(); res.json(Object.fromEntries(rows.map((r) => [r.key, r.value]))); });
app.put('/api/settings', (req, res) => { if (!requireAdmin(req, res)) return; const { key, value = '' } = req.body || {}; if (!key) return res.status(400).json({ error: 'key is required' }); db.prepare('INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at').run(key, String(value), now()); res.json({ key, value: String(value) }); });
app.get('/api/search', (req, res) => { const q = `%${String(req.query.q || '').trim().toLowerCase()}%`; if (q === '%%') return res.json([]); const result = []; for (const table of ['courses','news','events','faqs']) { const rows = db.prepare(`SELECT * FROM ${table} WHERE ${publicWhere[table]} AND lower(COALESCE(name,title,question,description,answer,'')) LIKE ? LIMIT 6`).all(q); result.push(...rows.map((r) => ({ type: table.slice(0, -1), ...r }))); } res.json(result.slice(0, 18)); });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    if (req.method !== 'GET') return next();
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'Internal server error' }); });
app.listen(PORT, '0.0.0.0', () => console.log(`Local API server running at http://localhost:${PORT}`));
