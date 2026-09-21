import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api, fmtDate } from '../lib/api';
import { useSEO, useJsonLd } from '../lib/seo';
import { ErrorState } from '../components/ui';
import { NewsCard, type NewsItem } from '../components/cards';

type Full = NewsItem & { body: string };

export default function NewsDetail() {
  const { slug } = useParams();
  const [n, setN] = useState<Full | null>(null);
  const [more, setMore] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO({ title: n ? n.title : 'News Article', description: n ? (n.excerpt || '').slice(0, 155) : 'News from Star Institute of Professionals.', path: '/news/' + slug });
  useJsonLd('ld-article', n ? {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: n.title, description: n.excerpt,
    datePublished: n.published_at, url: 'https://starinstitute.ac.ke/news/' + n.slug,
    author: { '@type': 'Organization', name: 'Star Institute of Professionals' },
  } : {});

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true); setError('');
      try {
        const d = await api('/api/news?slug=' + encodeURIComponent(slug || ''));
        if (!live) return;
        if (!d) { setError('notfound'); return; }
        setN(d);
        const all = await api('/api/news?limit=4');
        if (live && Array.isArray(all)) setMore(all.filter((x: NewsItem) => x.slug !== d.slug).slice(0, 2));
      } catch (e: any) { if (live) setError(e.message); } finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, [slug]);

  if (loading) return (<main id="main-content" className="container-x py-14 max-w-3xl"><div className="skeleton h-64 w-full" /><div className="skeleton h-8 w-3/4 mt-6" /><div className="skeleton h-4 w-full mt-3" /></main>);
  if (error === 'notfound' || !n) return (<main id="main-content" className="container-x py-16 max-w-3xl"><ErrorState text="This article could not be found." /><div className="text-center mt-6"><Link to="/news" className="btn btn-navy">Back to News</Link></div></main>);
  if (error) return (<main id="main-content" className="container-x py-16 max-w-3xl"><ErrorState text={error} /></main>);

  return (
    <main id="main-content">
      <article className="container-x py-10 max-w-3xl">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-700"><ArrowLeft size={15} aria-hidden /> All News</Link>
        <div className="flex items-center gap-2 text-xs mt-4">
          {n.category && <span className="font-bold uppercase tracking-wide text-gold-600">{n.category}</span>}
          <span className="text-slate-400">·</span>
          <time className="text-slate-500" dateTime={n.published_at}>{fmtDate(n.published_at)}</time>
        </div>
        <h1 className="font-display font-extrabold text-navy-900 text-3xl md:text-4xl leading-tight mt-2">{n.title}</h1>
        {n.excerpt && <p className="mt-3 text-lg text-slate-600 leading-relaxed">{n.excerpt}</p>}
        {n.image && <img src={n.image} alt="" className="mt-6 rounded-lg w-full aspect-[16/8] object-cover" />}
        <div className="mt-6 prose-sip">
          {(n.body || '').split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200" aria-label="More news">
          <div className="container-x py-12">
            <h2 className="font-display font-extrabold text-navy-900 text-xl">More News</h2>
            <div className="mt-5 grid md:grid-cols-2 gap-6">{more.map((m) => <NewsCard key={m.slug} n={m} />)}</div>
          </div>
        </section>
      )}
    </main>
  );
}
