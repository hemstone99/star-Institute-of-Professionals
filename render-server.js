import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import courses from './api/courses.js';
import news from './api/news.js';
import events from './api/events.js';
import faqs from './api/faqs.js';
import staff from './api/staff.js';
import gallery from './api/gallery.js';
import documents from './api/documents.js';
import announcements from './api/announcements.js';
import testimonials from './api/testimonials.js';
import adminLogin from './api/admin-login.js';
import applications from './api/applications.js';
import messages from './api/messages.js';
import graduation from './api/graduation.js';
import settings from './api/settings.js';
import search from './api/search.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const handlers = {
  courses, news, events, faqs, staff, gallery, documents, announcements,
  testimonials, 'admin-login': adminLogin, applications, messages, graduation,
  settings, search,
};

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.');
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => res.json({ ok: true, database: 'supabase' }));
app.all('/api/:resource', async (req, res, next) => {
  const handler = handlers[req.params.resource];
  if (!handler) return next();
  try {
    await handler(req, res);
  } catch (error) {
    console.error('API adapter error:', error);
    if (!res.headersSent) res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
  next();
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => console.log(`Render server listening on port ${port}`));
