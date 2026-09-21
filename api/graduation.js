import supabase from './db-client.js';
import { setCors, requireAdmin, rateLimit, clientIp, sanitize, isEmail } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'POST') {
      if (!rateLimit('grad:' + clientIp(req), 10, 60000)) {
        return res.status(429).json({ error: 'Too many submissions. Please wait a moment and try again.' });
      }
      const b = sanitize(req.body || {});
      if (!b.student_names || !b.admission_number || !b.phone || !b.year_completed) {
        return res.status(400).json({ error: 'Student names, admission number, phone and year completed are required.' });
      }
      if (!isEmail(b.email || '')) return res.status(400).json({ error: 'A valid email address is required.' });
      const { data, error } = await supabase.from('graduation_requests').insert({
        student_names: b.student_names, email: b.email, admission_number: b.admission_number,
        national_id: b.national_id || '', phone: b.phone, year_completed: b.year_completed, status: 'Pending',
      }).select().single();
      if (error) throw error;
      return res.status(201).json({ ok: true, id: data.id });
    }
    if (!(await requireAdmin(req))) return res.status(403).json({ error: 'Forbidden' });
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('graduation_requests').select('*').order('created_at', { ascending: false }).limit(300);
      if (error) throw error;
      return res.status(200).json(data);
    }
    const body = sanitize(req.body || {});
    if (req.method === 'PUT') {
      const { id, ...rest } = body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase.from('graduation_requests').update(rest).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id || body.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('graduation_requests').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
