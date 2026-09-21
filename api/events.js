import supabase from './db-client.js';
import { setCors, requireAdmin, sanitize } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { slug, q, limit, upcoming } = req.query;
      const admin = req.headers['x-admin-token'] ? await requireAdmin(req) : false;
      let query = supabase.from('events').select('*').order('event_date', { ascending: true });
      if (!admin) query = query.eq('published', true);
      if (upcoming === 'true') query = query.gte('event_date', new Date().toISOString());
      if (slug) query = query.eq('slug', slug);
      if (q) query = query.or('title.ilike.%' + q + '%,description.ilike.%' + q + '%');
      if (limit) query = query.limit(parseInt(String(limit), 10) || 50);
      const { data, error } = await query;
      if (error) throw error;
      if (slug) return res.status(200).json(data[0] || null);
      return res.status(200).json(data);
    }
    if (!(await requireAdmin(req))) return res.status(403).json({ error: 'Forbidden' });
    const body = sanitize(req.body || {});
    if (req.method === 'POST') {
      if (!body.title) return res.status(400).json({ error: 'Title is required.' });
      if (!body.slug) body.slug = String(body.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { data, error } = await supabase.from('events').insert(body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...rest } = body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase.from('events').update(rest).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id || body.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
