import supabase from './db-client.js';
import { setCors, requireAdmin, sanitize } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { slug, category, featured, q, limit } = req.query;
      const admin = req.headers['x-admin-token'] ? await requireAdmin(req) : false;
      let query = supabase.from('courses').select('*').order('display_order', { ascending: true }).order('name', { ascending: true });
      if (!admin) query = query.eq('published', true);
      if (slug) query = query.eq('slug', slug);
      if (category) query = query.eq('category', category);
      if (featured === 'true') query = query.eq('featured', true);
      if (q) query = query.or('name.ilike.%' + q + '%,description.ilike.%' + q + '%,category.ilike.%' + q + '%');
      if (limit) query = query.limit(parseInt(String(limit), 10) || 50);
      const { data, error } = await query;
      if (error) throw error;
      if (slug) return res.status(200).json(data[0] || null);
      return res.status(200).json(data);
    }
    if (!(await requireAdmin(req))) return res.status(403).json({ error: 'Forbidden' });
    const body = sanitize(req.body || {});
    if (req.method === 'POST') {
      if (!body.name || !body.category) return res.status(400).json({ error: 'Name and category are required.' });
      if (!body.slug) body.slug = String(body.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { data, error } = await supabase.from('courses').insert(body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...rest } = body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase.from('courses').update(rest).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id || body.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
