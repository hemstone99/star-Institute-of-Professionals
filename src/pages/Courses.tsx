import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { api } from '../lib/api';
import { COURSE_CATEGORIES } from '../lib/constants';
import { useSEO, useJsonLd } from '../lib/seo';
import { PageHero, EmptyState, ErrorState, CardSkeleton } from '../components/ui';
import { CourseCard, type Course } from '../components/cards';

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState(params.get('q') || '');
  const category = params.get('category') || '';
  const [level, setLevel] = useState('');
  const [mode, setMode] = useState('');

  useSEO({
    title: 'Courses & Programmes',
    description: 'Browse verified programmes at Star Institute of Professionals: accounting & finance, management, ICT, Cisco networking, beauty, engineering and consultancy training.',
    path: '/courses',
  });
  useJsonLd('ld-courses', {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Star Institute of Professionals — Courses',
    itemListElement: courses.slice(0, 20).map((c, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Course', name: c.name, description: c.description, url: 'https://starinstitute.ac.ke/courses/' + c.slug },
    })),
  });

  const fetchCourses = async () => {
    setLoading(true); setError('');
    try {
      const data = await api('/api/courses');
      setCourses(Array.isArray(data) ? data : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchCourses(); }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (q) next.set('q', q); else next.delete('q');
      setParams(next, { replace: true });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const setCategory = (c: string) => {
    const next = new URLSearchParams(params);
    if (c) next.set('category', c); else next.delete('category');
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const needle = (params.get('q') || '').toLowerCase();
    return courses.filter((c) => {
      if (category && c.category !== category) return false;
      if (level && (c.level || '') !== level) return false;
      if (mode && !(c.study_mode || '').toLowerCase().includes(mode.toLowerCase())) return false;
      if (needle && !(c.name + ' ' + c.description + ' ' + c.category).toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [courses, category, level, mode, params]);

  const modes = useMemo(() => {
    const s = new Set<string>();
    courses.forEach((c) => (c.study_mode || '').split(',').forEach((m) => m.trim() && s.add(m.trim())));
    return [...s];
  }, [courses]);
  const levels = useMemo(() => [...new Set(courses.map((c) => c.level).filter(Boolean))], [courses]);

  return (
    <main id="main-content">
      <PageHero eyebrow="Academics" title="Courses & Programmes" text="Search and filter verified programmes across seven schools of study. Every listing includes duration, study mode and entry requirements." image="/images/lab.jpg" />
      <section className="container-x py-12 md:py-16" aria-label="Course catalogue">
        <div className="card p-4 md:p-5 flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search programmes — try CPA, Cisco, Beauty…" className="field !pl-10" aria-label="Search programmes" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="field sm:w-56" aria-label="Filter by school">
              <option value="">All Schools</option>
              {COURSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="field sm:w-44" aria-label="Filter by level">
              <option value="">All Levels</option>
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className="field sm:w-44" aria-label="Filter by study mode">
              <option value="">All Modes</option>
              {modes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-500" role="status">
          <SlidersHorizontal size={14} className="inline mr-1.5 -mt-0.5" aria-hidden />
          Showing {filtered.length} of {courses.length} programmes{category ? ' in ' + category : ''}
        </p>

        {loading && <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{[0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)}</div>}
        {error && <div className="mt-6"><ErrorState text={error} onRetry={fetchCourses} /></div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="mt-6">
            <EmptyState title="No programmes match your filters" text="Try removing a filter or searching with different keywords." action={<button className="btn btn-outline btn-sm" onClick={() => { setQ(''); setLevel(''); setMode(''); setCategory(''); }}>Clear All Filters</button>} />
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => <CourseCard key={c.id} c={c} />)}
          </div>
        )}
      </section>
    </main>
  );
}
