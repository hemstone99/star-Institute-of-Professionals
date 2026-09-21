import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, BriefcaseBusiness, CalendarClock, CheckCircle2, Clock, FileText, MonitorSmartphone, Wallet } from 'lucide-react';
import { api } from '../lib/api';
import { categoryImage, SITE } from '../lib/constants';
import { useSEO, useJsonLd } from '../lib/seo';
import { ErrorState } from '../components/ui';
import { CourseCard, type Course } from '../components/cards';

type Full = Course & { overview: string; modules: string; careers: string; fees_note: string; intake: string; examining_body: string };

const splitLines = (s?: string) => (s || '').split(/\n|\|/).map((x) => x.trim()).filter(Boolean);

export default function CourseDetail() {
  const { slug } = useParams();
  const [c, setC] = useState<Full | null>(null);
  const [related, setRelated] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');

  useSEO({
    title: c ? c.name : 'Course Details',
    description: c ? (c.description || '').slice(0, 155) : 'Course details at Star Institute of Professionals.',
    path: '/courses/' + slug,
  });
  useJsonLd('ld-course', c ? {
    '@context': 'https://schema.org', '@type': 'Course', name: c.name, description: c.description,
    url: 'https://starinstitute.ac.ke/courses/' + c.slug,
    provider: { '@type': 'EducationalOrganization', name: 'Star Institute of Professionals', url: 'https://starinstitute.ac.ke' },
  } : {});

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true); setError('');
      try {
        const data = await api('/api/courses?slug=' + encodeURIComponent(slug || ''));
        if (!live) return;
        if (!data) { setError('notfound'); return; }
        setC(data);
        const all = await api('/api/courses?category=' + encodeURIComponent(data.category));
        if (live && Array.isArray(all)) setRelated(all.filter((x: Course) => x.slug !== data.slug).slice(0, 3));
      } catch (e: any) { if (live) setError(e.message); } finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, [slug]);

  if (loading) {
    return (
      <main id="main-content" className="container-x py-14">
        <div className="skeleton h-72 w-full" />
        <div className="skeleton h-8 w-1/2 mt-6" />
        <div className="skeleton h-4 w-full mt-3" />
        <div className="skeleton h-4 w-full mt-2" />
      </main>
    );
  }
  if (error === 'notfound' || !c) {
    return (
      <main id="main-content" className="container-x py-16">
        <ErrorState text="This programme could not be found. It may have been renamed or unpublished." />
        <div className="text-center mt-6"><Link to="/courses" className="btn btn-navy">Back to All Courses</Link></div>
      </main>
    );
  }
  if (error) {
    return (<main id="main-content" className="container-x py-16"><ErrorState text={error} /></main>);
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'modules', label: 'Modules & Objectives', icon: CheckCircle2 },
    { id: 'requirements', label: 'Requirements', icon: BadgeCheck },
    { id: 'careers', label: 'Careers', icon: BriefcaseBusiness },
  ];

  return (
    <main id="main-content">
      <nav className="container-x pt-6 text-sm text-slate-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link to="/" className="hover:text-gold-600">Home</Link></li><li aria-hidden>/</li>
          <li><Link to="/courses" className="hover:text-gold-600">Courses</Link></li><li aria-hidden>/</li>
          <li aria-current="page" className="text-navy-900 font-semibold truncate max-w-64">{c.name}</li>
        </ol>
      </nav>

      <section className="container-x py-8 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <p className="eyebrow">{c.category}</p>
          <h1 className="font-display font-extrabold text-navy-900 text-3xl md:text-4xl leading-tight mt-3">{c.name}</h1>
          <p className="mt-3 text-slate-600 leading-relaxed text-[17px]">{c.description}</p>
          <img src={categoryImage(c.category, c.image)} alt={c.name + ' — programme image'} className="mt-6 rounded-lg w-full aspect-[16/8] object-cover" />

          <div className="mt-8 border-b border-slate-200 flex gap-1 overflow-x-auto" role="tablist" aria-label="Programme details">
            {tabs.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                className={'flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ' + (tab === t.id ? 'border-gold-500 text-navy-900' : 'border-transparent text-slate-500 hover:text-navy-900')}>
                <t.icon size={15} aria-hidden />{t.label}
              </button>
            ))}
          </div>

          <div className="py-6 prose-sip" role="tabpanel">
            {tab === 'overview' && (<><p>{c.overview || c.description}</p>{c.examining_body && <p><strong>Examining / certifying body:</strong> {c.examining_body}</p>}</>)}
            {tab === 'modules' && (splitLines(c.modules).length ? <ul>{splitLines(c.modules).map((m, i) => <li key={i}>{m}</li>)}</ul> : <p>Module details are available from the admissions office. Please contact us for the full course outline.</p>)}
            {tab === 'requirements' && (splitLines(c.requirements).length ? <ul>{splitLines(c.requirements).map((m, i) => <li key={i}>{m}</li>)}</ul> : <p>Entry requirements vary by level. Please contact admissions for guidance on your qualifications.</p>)}
            {tab === 'careers' && (splitLines(c.careers).length ? <ul>{splitLines(c.careers).map((m, i) => <li key={i}>{m}</li>)}</ul> : <p>Career guidance for this programme is available from the Student Affairs office.</p>)}
          </div>
        </div>

        <aside className="space-y-5" aria-label="Programme facts">
          <div className="card p-6 lg:sticky lg:top-24">
            <h2 className="font-display font-bold text-navy-900">Programme Facts</h2>
            <dl className="mt-4 space-y-3.5 text-sm">
              {c.duration && <div className="flex gap-3"><Clock size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden /><div><dt className="text-slate-500 text-xs uppercase font-semibold">Duration</dt><dd className="font-semibold text-navy-900">{c.duration}</dd></div></div>}
              {c.study_mode && <div className="flex gap-3"><MonitorSmartphone size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden /><div><dt className="text-slate-500 text-xs uppercase font-semibold">Study Mode</dt><dd className="font-semibold text-navy-900">{c.study_mode}</dd></div></div>}
              {c.level && <div className="flex gap-3"><FileText size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden /><div><dt className="text-slate-500 text-xs uppercase font-semibold">Level</dt><dd className="font-semibold text-navy-900">{c.level}</dd></div></div>}
              {c.intake && <div className="flex gap-3"><CalendarClock size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden /><div><dt className="text-slate-500 text-xs uppercase font-semibold">Intake</dt><dd className="font-semibold text-navy-900">{c.intake}</dd></div></div>}
              {c.fees_note && <div className="flex gap-3"><Wallet size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden /><div><dt className="text-slate-500 text-xs uppercase font-semibold">Fees</dt><dd className="font-semibold text-navy-900">{c.fees_note}</dd></div></div>}
            </dl>
            <Link to={'/apply?course=' + encodeURIComponent(c.slug)} className="btn btn-gold w-full mt-6">Apply for This Course <ArrowRight size={17} aria-hidden /></Link>
            <Link to="/downloads" className="btn btn-outline w-full mt-2.5">Fee Structures</Link>
            <p className="mt-4 text-xs text-slate-500 text-center">Questions? Call <a href={SITE.phoneHref} className="font-bold text-navy-900">{SITE.phone}</a></p>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-200" aria-label="Related programmes">
          <div className="container-x py-14">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display font-extrabold text-navy-900 text-xl md:text-2xl">Related Programmes</h2>
              <Link to="/courses" className="btn btn-outline btn-sm"><ArrowLeft size={15} aria-hidden /> All Courses</Link>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => <CourseCard key={r.id} c={r} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
