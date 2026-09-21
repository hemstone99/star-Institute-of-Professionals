import supabase from './db-client.js';
import { setCors, requireAdmin, rateLimit, clientIp, sanitize, isEmail } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'POST') {
      if (!rateLimit('apply:' + clientIp(req), 10, 60000)) {
        return res.status(429).json({ error: 'Too many submissions. Please wait a moment and try again.' });
      }
      const b = sanitize(req.body || {});
      if (!b.first_name || !b.last_name || !b.phone || !b.course_name) {
        return res.status(400).json({ error: 'First name, last name, phone and programme are required.' });
      }
      if (!isEmail(b.email || '')) return res.status(400).json({ error: 'A valid email address is required.' });
      const { data, error } = await supabase.from('applications').insert({
        first_name: b.first_name, last_name: b.last_name, email: b.email, phone: b.phone,
        id_number: b.id_number || '', dob: b.dob || '', gender: b.gender || '', address: b.address || '',
        course_id: b.course_id || null, course_name: b.course_name, study_mode: b.study_mode || '',
        academic_level: b.academic_level || '', school: b.school || '', grade: b.grade || '',
        guardian_name: b.guardian_name || '', guardian_phone: b.guardian_phone || '',
        documents_note: b.documents_note || '', status: 'Pending',
      }).select().single();
      if (error) throw error;
      return res.status(201).json({ ok: true, id: data.id });
    }
    if (!(await requireAdmin(req))) return res.status(403).json({ error: 'Forbidden' });
    if (req.method === 'GET') {
      const { status, q, limit } = req.query;
      let query = supabase.from('applications').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      if (q) query = query.or('first_name.ilike.%' + q + '%,last_name.ilike.%' + q + '%,email.ilike.%' + q + '%,course_name.ilike.%' + q + '%');
      if (limit) query = query.limit(parseInt(String(limit), 10) || 200);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    const body = sanitize(req.body || {});
    if (req.method === 'PUT') {
      const { id, ...rest } = body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { data, error } = await supabase.from('applications').update(rest).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const id = req.query.id || body.id;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
