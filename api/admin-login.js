import supabase from './db-client.js';
import { setCors, sha256, rateLimit, clientIp, sanitize } from './_auth.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'POST') {
      if (!rateLimit('login:' + clientIp(req), 10, 60000)) {
        return res.status(429).json({ error: 'Too many attempts. Please try again shortly.' });
      }
      const { username, password } = sanitize(req.body || {});
      if (!username || !password) return res.status(400).json({ error: 'Username and password are required.' });
      const { data: user } = await supabase.from('admin_users').select('*').eq('username', String(username)).maybeSingle();
      if (!user || sha256(password) !== user.password_hash) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }
      const token = crypto.randomBytes(32).toString('hex');
      const expires_at = new Date(Date.now() + 12 * 3600 * 1000).toISOString();
      const { error } = await supabase.from('admin_tokens').insert({ token, username: user.username, expires_at });
      if (error) throw error;
      return res.status(200).json({ token, username: user.username, expires_at });
    }
    if (req.method === 'DELETE') {
      const token = req.headers['x-admin-token'];
      if (token) await supabase.from('admin_tokens').delete().eq('token', token);
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'GET') {
      const token = req.headers['x-admin-token'];
      if (!token) return res.status(401).json({ error: 'No token' });
      const { data } = await supabase.from('admin_tokens').select('*').eq('token', token).maybeSingle();
      if (!data || new Date(data.expires_at) < new Date()) return res.status(401).json({ error: 'Expired' });
      return res.status(200).json({ ok: true, username: data.username });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
