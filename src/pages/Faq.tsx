import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import { api } from '../lib/api';
import { useSEO, useJsonLd } from '../lib/seo';
import { PageHero, EmptyState, ErrorState } from '../components/ui';

type F = { id: number; question: string; answer: string; category: string };

export default function Faq() {
  const [items, setItems] = useState<F[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [open, setOpen] = useState<number | null>(null);

  useSEO({ title: 'Frequently Asked Questions', description: 'FAQs about Star Institute of Professionals: courses, applications, requirements, intakes, fees, study modes, location and contact.', path: '/faq' });
  useJsonLd('ld-faq', {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  });

  const fetchAll = async () => {
    setLoading(true); setError('');
    try {
      const d = await api('/api/faqs');
      setItems(Array.isArray(d) ? d : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const cats = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const list = useMemo(() => items.filter((f) => {
    if (cat && f.category !== cat) return false;
    if (q.trim() && !(f.question + ' ' + f.answer).toLowerCase().includes(q.trim().toLowerCase())) return false;
    return true;
  }), [items, cat, q]);

  return (
    <main id="main-content">
      <PageHero eyebrow="Help Centre" title="Frequently Asked Questions" text="Answers about courses, applications, requirements, intakes, fees, study modes and how to reach us." />
      <section className="container-x py-12 md:py-16 max-w-4xl" aria-label="FAQs">
        <div className="relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" className="field !pl-10" aria-label="Search questions" />
        </div>
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4" role="group" aria-label="Filter by topic">
            <button onClick={() => setCat('')} className={'px-4 py-1.5 rounded-full text-[13px] font-semibold border ' + (!cat ? 'bg-navy-900 text-white border-navy-900' : 'border-slate-300 text-slate-600')}>All Topics</button>
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={'px-4 py-1.5 rounded-full text-[13px] font-semibold border ' + (cat === c ? 'bg-navy-900 text-white border-navy-900' : 'border-slate-300 text-slate-600')}>{c}</button>
            ))}
          </div>
        )}
        <div className="mt-6 space-y-3">
          {loading && [0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-16 w-full" />)}
          {error && <ErrorState text={error} onRetry={fetchAll} />}
          {!loading && !error && list.length === 0 && <EmptyState title="No matching questions" text="Try different keywords, or contact us directly — we are happy to help." action={<Link to="/contact" className="btn btn-navy btn-sm">Contact Us</Link>} />}
          {!loading && !error && list.map((f) => (
            <div key={f.id} className="card overflow-hidden">
              <button onClick={() => setOpen(open === f.id ? null : f.id)} aria-expanded={open === f.id} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                <span><span className="block font-semibold text-navy-900 text-[15px]">{f.question}</span>{f.category && <span className="block text-xs text-gold-600 font-semibold mt-0.5">{f.category}</span>}</span>
                <ChevronDown size={18} aria-hidden className={'shrink-0 text-slate-400 transition-transform ' + (open === f.id ? 'rotate-180' : '')} />
              </button>
              {open === f.id && <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{f.answer}</p>}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">Still have questions? <Link to="/contact" className="font-semibold text-gold-600 underline">Contact our team</Link>.</p>
      </section>
    </main>
  );
}
