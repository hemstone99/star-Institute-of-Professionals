import supabase from './db-client.js';
import { setCors } from './_auth.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.status(200).json({ courses: [], news: [], events: [], faqs: [] });
    const like = '%' + q + '%';
    const [courses, news, events, faqs] = await Promise.all([
      supabase.from('courses').select('slug,name,category,description').eq('published', true).or('name.ilike.' + like + ',description.ilike.' + like + ',category.ilike.' + like).limit(6),
      supabase.from('news').select('slug,title,excerpt').eq('published', true).or('title.ilike.' + like + ',excerpt.ilike.' + like).limit(4),
      supabase.from('events').select('slug,title,description').eq('published', true).or('title.ilike.' + like + ',description.ilike.' + like).limit(4),
      supabase.from('faqs').select('id,question,answer').eq('published', true).or('question.ilike.' + like + ',answer.ilike.' + like).limit(4),
    ]);
    return res.status(200).json({
      courses: courses.data || [],
      news: news.data || [],
      events: events.data || [],
      faqs: faqs.data || [],
    });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
