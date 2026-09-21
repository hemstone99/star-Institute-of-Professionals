import supabase from './db-client.js';
import crypto from 'crypto';

export function sha256(s) {
  return crypto.createHash('sha256').update(String(s)).digest('hex');
}

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
}

export async function requireAdmin(req) {
  try {
    const token = req.headers['x-admin-token'];
    if (!token) return false;
    const { data } = await supabase.from('admin_tokens').select('*').eq('token', token).maybeSingle();
    if (!data) return false;
    if (new Date(data.expires_at) < new Date()) return false;
    return true;
  } catch {
    return false;
  }
}

const hits = new Map();
export function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length <= max;
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'anon';
}

function cleanVal(v) {
  if (typeof v !== 'string') return v;
  let s = v.trim().split('<').join('').split('>').join('');
  if (s.length > 20000) s = s.slice(0, 20000);
  return s;
}
export function sanitize(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = Array.isArray(obj) ? [] : {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    out[k] = v && typeof v === 'object' ? sanitize(v) : cleanVal(v);
  }
  return out;
}

export function isEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}
