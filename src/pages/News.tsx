import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useSEO } from '../lib/seo';
import { PageHero, EmptyState, ErrorState, CardSkeleton } from '../components/ui';
import { NewsCard, type NewsItem } from '../components/cards';

export default function News() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cat, setCat] = useState('');

  useSEO({ title: 'News', description: 'Latest news and announcements from Star Institute of Professionals in Mombasa.', path: '/news' });

  const fetchAll = async () => {
    setLoading(true); setError('');
    try {
      const d = await api('/api/news');
      setItems(Array.isArray(d) ? d : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const cats = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const list = cat ? items.filter((i) => i.category === cat) : items;
  const [first, ...rest] = list;

  return (
    <main id="main-content">
      <PageHero eyebrow="Newsroom" title="News & Announcements" text="Official updates from the institute — intakes, events, results and campus stories." image="/images/campus.jpg" />
      <section className="container-x py-12 md:py-16" aria-label="News articles">
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
            <button onClick={() => setCat('')} className={'px-4 py-2 rounded-full text-sm font-semibold border transition-colors ' + (!cat ? 'bg-navy-900 text-white border-navy-900' : 'border-slate-300 text-slate-600 hover:border-navy-900')}>All</button>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={'px-4 py-2 rounded-full text-sm font-semibold border transition-colors ' + (cat === c ? 'bg-navy-900 text-white border-navy-900' : 'border-slate-300 text-slate-600 hover:border-navy-900')}>{c}</button>
            ))}
          </div>
        )}
        {loading && <div className="grid md:grid-cols-2 gap-6">{[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>}
        {error && <ErrorState text={error} onRetry={fetchAll} />}
        {!loading && !error && list.length === 0 && <EmptyState title="No news articles yet" text="News updates will appear here. Please check back soon or contact us directly." />}
        {!loading && !error && list.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {first && <NewsCard n={first} large />}
            {rest.map((n) => <NewsCard key={n.slug} n={n} />)}
          </div>
        )}
      </section>
    </main>
  );
}
