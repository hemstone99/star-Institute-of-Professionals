import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { api } from '../lib/api';
import { useSEO } from '../lib/seo';
import { PageHero, EmptyState, ErrorState, CardSkeleton } from '../components/ui';

type Doc = { id: number; title: string; file_url: string; category: string; description: string; file_size: string };

export default function Downloads() {
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cat, setCat] = useState('');

  useSEO({ title: 'Downloads — Brochure & Fee Structures', description: 'Download official Star Institute of Professionals documents: institute brochure and fee structures for accounts, management and beauty programmes.', path: '/downloads' });

  const fetchAll = async () => {
    setLoading(true); setError('');
    try {
      const d = await api('/api/documents');
      setItems(Array.isArray(d) ? d : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const cats = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const list = cat ? items.filter((i) => i.category === cat) : items;

  return (
    <main id="main-content">
      <PageHero eyebrow="Resources" title="Downloads" text="Official institute brochure and fee structures. Always confirm current fees with the accounts office before payment." />
      <section className="container-x py-12 md:py-16" aria-label="Downloadable documents">
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by type">
            <button onClick={() => setCat('')} className={'px-4 py-2 rounded-full text-sm font-semibold border ' + (!cat ? 'bg-navy-900 text-white border-navy-900' : 'border-slate-300 text-slate-600')}>All</button>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={'px-4 py-2 rounded-full text-sm font-semibold border ' + (cat === c ? 'bg-navy-900 text-white border-navy-900' : 'border-slate-300 text-slate-600')}>{c}</button>
            ))}
          </div>
        )}
        {loading && <div className="grid sm:grid-cols-2 gap-5">{[0, 1].map((i) => <CardSkeleton key={i} lines={1} />)}</div>}
        {error && <ErrorState text={error} onRetry={fetchAll} />}
        {!loading && !error && list.length === 0 && <EmptyState title="No documents available" text="Documents are being updated. Please contact the admissions office for fee structures." />}
        {!loading && !error && list.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-5">
            {list.map((d) => (
              <article key={d.id} className="card card-hover p-6 flex gap-4">
                <span className="p-3 rounded bg-red-50 text-red-600 h-fit shrink-0" aria-hidden><FileText size={22} /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-gold-600">{d.category}</p>
                  <h2 className="font-display font-bold text-navy-900 mt-1 leading-snug">{d.title}</h2>
                  {d.description && <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{d.description}</p>}
                  <div className="mt-3 flex items-center gap-3">
                    <a href={d.file_url} target="_blank" rel="noreferrer" className="btn btn-navy btn-sm"><Download size={15} aria-hidden /> Download PDF</a>
                    {d.file_size && <span className="text-xs text-slate-400">{d.file_size}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="mt-8 text-xs text-slate-500 max-w-2xl leading-relaxed">Fee structures apply to the stated semester/year and may change. The accounts office will confirm the exact amount payable for your programme and intake before you pay.</p>
      </section>
    </main>
  );
}
