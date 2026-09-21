import supabase from './db-client.js';
import { setCors, requireAdmin, sanitize } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const admin = req.headers['x-admin-token'] ? await requireAdmin(req) : false;
      let query = supabase.from('faqs').select('*').order('display_order', { ascending: true });
      if (!admin) query = query.eq('published', true);
      const { category, q } = req.query;
      if (category) query = query.eq('category', category);
      if (q) query = query.or('question.ilike.%' + q + '%,answer.ilike.%' + q + '%');
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (!(await requireAdmin(req))) return res.status(403).json({ error: 'Forbidden' });
    const body = sanitize(req.body || {});
    if (req.method === 'POST') {
      if (!body.question || !body.answer) return res.status(400).json({ error: 'Question and answer are required.' });
      const { data, error } = await supabase.from('faqs').insert(body).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...rest } = body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase.from('faqs').update(rest).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id || body.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
