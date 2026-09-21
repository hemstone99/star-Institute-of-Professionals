import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../lib/api';
import { useSEO } from '../lib/seo';
import { PageHero, EmptyState, ErrorState } from '../components/ui';

type G = { id: number; title: string; image: string; category: string; caption: string };

export default function Gallery() {
  const [items, setItems] = useState<G[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cat, setCat] = useState('');
  const [lightbox, setLightbox] = useState<G | null>(null);

  useSEO({ title: 'Photo Gallery', description: 'Photo gallery of Star Institute of Professionals: campus, classrooms, laboratories, library, events and student life.', path: '/gallery' });

  const fetchAll = async () => {
    setLoading(true); setError('');
    try {
      const d = await api('/api/gallery');
      setItems(Array.isArray(d) ? d : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const cats = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const list = cat ? items.filter((i) => i.category === cat) : items;

  return (
    <main id="main-content">
      <PageHero eyebrow="Media" title="Photo Gallery" text="Campus, classrooms, laboratories and student moments at Star Institute." image="/images/campus.jpg" />
      <section className="container-x py-12 md:py-16" aria-label="Photos">
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
            <button onClick={() => setCat('')} className={'px-4 py-2 rounded-full text-sm font-semibold border ' + (!cat ? 'bg-navy-900 text-white border-navy-900' : 'border-slate-300 text-slate-600')}>All</button>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={'px-4 py-2 rounded-full text-sm font-semibold border ' + (cat === c ? 'bg-navy-900 text-white border-navy-900' : 'border-slate-300 text-slate-600')}>{c}</button>
            ))}
          </div>
        )}
        {loading && <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton aspect-[4/3]" />)}</div>}
        {error && <ErrorState text={error} onRetry={fetchAll} />}
        {!loading && !error && list.length === 0 && <EmptyState title="No photos yet" text="Campus photos are being added. Please check back soon." />}
        {!loading && !error && list.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((g) => (
              <button key={g.id} onClick={() => setLightbox(g)} className="group rounded overflow-hidden bg-white border border-slate-200 text-left focus:outline-none" aria-label={'View ' + g.title}>
                <img src={g.image} alt={g.title} loading="lazy" className="aspect-[4/3] w-full object-cover group-hover:scale-[1.02] transition-transform" />
                <span className="block px-3 py-2.5 text-xs font-semibold text-navy-900">{g.title}</span>
              </button>
            ))}
          </div>
        )}
      </section>
      {lightbox && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={lightbox.title}>
          <div className="absolute inset-0 bg-navy-950/85" onClick={() => setLightbox(null)} />
          <figure className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
            <img src={lightbox.image} alt={lightbox.title} className="w-full max-h-[75vh] object-contain bg-navy-950" />
            <figcaption className="px-5 py-3 flex items-center justify-between gap-4">
              <span><span className="block font-bold text-navy-900 text-sm">{lightbox.title}</span>{lightbox.caption && <span className="block text-xs text-slate-500">{lightbox.caption}</span>}</span>
              <button onClick={() => setLightbox(null)} className="p-2 rounded hover:bg-slate-100" aria-label="Close preview"><X size={20} /></button>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
