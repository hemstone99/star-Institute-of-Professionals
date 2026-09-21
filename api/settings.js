import supabase from './db-client.js';
import { setCors, requireAdmin, sanitize } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const obj = {};
      for (const row of data) obj[row.key] = row.value;
      return res.status(200).json(obj);
    }
    if (!(await requireAdmin(req))) return res.status(403).json({ error: 'Forbidden' });
    if (req.method === 'PUT') {
      const body = sanitize(req.body || {});
      if (!body.key) return res.status(400).json({ error: 'key is required' });
      const { data, error } = await supabase.from('site_settings').upsert({ key: body.key, value: body.value || '' }, { onConflict: 'key' }).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
