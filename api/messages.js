import supabase from './db-client.js';
import { setCors, requireAdmin, rateLimit, clientIp, sanitize, isEmail } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'POST') {
      if (!rateLimit('msg:' + clientIp(req), 10, 60000)) {
        return res.status(429).json({ error: 'Too many submissions. Please wait a moment and try again.' });
      }
      const b = sanitize(req.body || {});
      if (!b.name || !b.message) return res.status(400).json({ error: 'Name and message are required.' });
      if (!isEmail(b.email || '')) return res.status(400).json({ error: 'A valid email address is required.' });
      const { data, error } = await supabase.from('messages').insert({
        name: b.name, email: b.email, phone: b.phone || '', subject: b.subject || '', message: b.message, status: 'New',
      }).select().single();
      if (error) throw error;
      return res.status(201).json({ ok: true, id: data.id });
    }
    if (!(await requireAdmin(req))) return res.status(403).json({ error: 'Forbidden' });
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(300);
      if (error) throw error;
      return res.status(200).json(data);
    }
    const body = sanitize(req.body || {});
    if (req.method === 'PUT') {
      const { id, ...rest } = body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase.from('messages').update(rest).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id || body.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
