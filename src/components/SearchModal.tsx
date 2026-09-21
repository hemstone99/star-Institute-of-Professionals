import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, BookOpen, Newspaper, CalendarDays, HelpCircle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

type Results = { courses: any[]; news: any[]; events: any[]; faqs: any[] };
const EMPTY: Results = { courses: [], news: [], events: [], faqs: [] };

const PAGES = [
  { title: 'About Us', href: '/about', keys: 'about history vision mission values founders' },
  { title: 'Courses', href: '/courses', keys: 'courses programs programmes study' },
  { title: 'Admissions', href: '/admissions', keys: 'admissions enroll enrol apply requirements intake' },
  { title: 'Apply Now', href: '/apply', keys: 'apply application form' },
  { title: 'Student Life', href: '/student-life', keys: 'student life clubs societies' },
  { title: 'Facilities', href: '/facilities', keys: 'facilities campus library lab' },
  { title: 'Downloads & Fees', href: '/downloads', keys: 'downloads fees brochure pdf' },
  { title: 'Graduation Request', href: '/graduation', keys: 'graduation request graduands' },
  { title: 'Contact Us', href: '/contact', keys: 'contact phone email location map' },
  { title: 'FAQs', href: '/faq', keys: 'faq questions help' },
];

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [res, setRes] = useState<Results>(EMPTY);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setRes(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = (await api('/api/search?q=' + encodeURIComponent(q.trim()))) as Results;
        setRes(data);
      } catch {
        setRes(EMPTY);
      } finally {
        setLoading(false);
      }
    }, 260);
    return () => clearTimeout(t);
  }, [q]);

  const pages = q.trim().length >= 2 ? PAGES.filter((p) => (p.title + ' ' + p.keys).toLowerCase().includes(q.trim().toLowerCase())).slice(0, 4) : [];
  const total = res.courses.length + res.news.length + res.events.length + res.faqs.length + pages.length;

  const Section = ({ icon, title, children }: any) => (
    <div className="px-5 py-3">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{icon}{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Site search">
      <div className="absolute inset-0 bg-navy-950/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
          <Search size={19} className="text-slate-400 shrink-0" aria-hidden />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses, news, events, FAQs…"
            className="flex-1 text-[15px] outline-none placeholder:text-slate-400"
            aria-label="Search the site"
          />
          {loading ? <Loader2 size={18} className="animate-spin text-gold-500" aria-hidden /> : (
            <button onClick={onClose} className="p-1.5 rounded hover:bg-slate-100" aria-label="Close search"><X size={18} /></button>
          )}
        </div>
        <div className="max-h-[55vh] overflow-y-auto divide-y divide-slate-100">
          {q.trim().length < 2 && (
            <p className="px-5 py-6 text-sm text-slate-500">Type at least 2 characters. Try “CPA”, “Cisco”, “fees”, or “intake”.</p>
          )}
          {q.trim().length >= 2 && !loading && total === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="font-semibold text-navy-900">No results for “{q.trim()}”</p>
              <p className="text-sm text-slate-500 mt-1">Try different keywords, or <Link to="/contact" onClick={onClose} className="text-gold-600 font-semibold underline">contact admissions</Link> for help.</p>
            </div>
          )}
          {res.courses.length > 0 && (
            <Section icon={<BookOpen size={14} />} title="Courses">
              {res.courses.map((c: any) => (
                <Link key={c.slug} to={'/courses/' + c.slug} onClick={onClose} className="block px-3 py-2 rounded hover:bg-gold-50">
                  <span className="block text-sm font-semibold text-navy-900">{c.name}</span>
                  <span className="block text-xs text-slate-500">{c.category}</span>
                </Link>
              ))}
            </Section>
          )}
          {res.news.length > 0 && (
            <Section icon={<Newspaper size={14} />} title="News">
              {res.news.map((n: any) => (
                <Link key={n.slug} to={'/news/' + n.slug} onClick={onClose} className="block px-3 py-2 rounded hover:bg-gold-50 text-sm font-semibold text-navy-900">{n.title}</Link>
              ))}
            </Section>
          )}
          {res.events.length > 0 && (
            <Section icon={<CalendarDays size={14} />} title="Events">
              {res.events.map((e: any) => (
                <Link key={e.slug} to={'/events/' + e.slug} onClick={onClose} className="block px-3 py-2 rounded hover:bg-gold-50 text-sm font-semibold text-navy-900">{e.title}</Link>
              ))}
            </Section>
          )}
          {res.faqs.length > 0 && (
            <Section icon={<HelpCircle size={14} />} title="FAQs">
              {res.faqs.map((f: any) => (
                <Link key={f.id} to="/faq" onClick={onClose} className="block px-3 py-2 rounded hover:bg-gold-50 text-sm font-semibold text-navy-900">{f.question}</Link>
              ))}
            </Section>
          )}
          {pages.length > 0 && (
            <Section icon={<Search size={14} />} title="Pages">
              {pages.map((p) => (
                <Link key={p.href} to={p.href} onClick={onClose} className="block px-3 py-2 rounded hover:bg-gold-50 text-sm font-semibold text-navy-900">{p.title}</Link>
              ))}
            </Section>
          )}
        </div>
        <div className="px-5 py-2.5 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">Press ESC to close · {total} result{total === 1 ? '' : 's'}</div>
      </div>
    </div>
  );
}
