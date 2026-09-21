import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, MapPin } from 'lucide-react';
import { api, fmtDate } from '../lib/api';
import { SITE } from '../lib/constants';
import { useSEO, useJsonLd } from '../lib/seo';
import { ErrorState } from '../components/ui';

type Full = { slug: string; title: string; description: string; body: string; image: string; event_date: string; end_date: string; location: string; registration_info: string };

export default function EventDetail() {
  const { slug } = useParams();
  const [e, setE] = useState<Full | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO({ title: e ? e.title : 'Event Details', description: e ? (e.description || '').slice(0, 155) : 'Event at Star Institute of Professionals.', path: '/events/' + slug });
  useJsonLd('ld-event', e ? {
    '@context': 'https://schema.org', '@type': 'Event', name: e.title, description: e.description,
    startDate: e.event_date, endDate: e.end_date || undefined, url: 'https://starinstitute.ac.ke/events/' + e.slug,
    location: { '@type': 'Place', name: e.location || SITE.address },
    organizer: { '@type': 'EducationalOrganization', name: 'Star Institute of Professionals' },
  } : {});

  useEffect(() => {
    (async () => {
      setLoading(true); setError('');
      try {
        const d = await api('/api/events?slug=' + encodeURIComponent(slug || ''));
        if (!d) { setError('notfound'); return; }
        setE(d);
      } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return (<main id="main-content" className="container-x py-14 max-w-3xl"><div className="skeleton h-64 w-full" /><div className="skeleton h-8 w-3/4 mt-6" /></main>);
  if (error === 'notfound' || !e) return (<main id="main-content" className="container-x py-16 max-w-3xl"><ErrorState text="This event could not be found." /><div className="text-center mt-6"><Link to="/events" className="btn btn-navy">Back to Events</Link></div></main>);
  if (error) return (<main id="main-content" className="container-x py-16 max-w-3xl"><ErrorState text={error} /></main>);

  return (
    <main id="main-content">
      <article className="container-x py-10 max-w-3xl">
        <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-700"><ArrowLeft size={15} aria-hidden /> All Events</Link>
        <h1 className="font-display font-extrabold text-navy-900 text-3xl md:text-4xl leading-tight mt-3">{e.title}</h1>
        {e.image && <img src={e.image} alt="" className="mt-6 rounded-lg w-full aspect-[16/7] object-cover" />}
        <div className="mt-6 card p-5 grid sm:grid-cols-3 gap-4 text-sm">
          {e.event_date && <div className="flex gap-2.5"><CalendarDays size={17} className="text-gold-500 shrink-0" aria-hidden /><div><p className="text-xs uppercase font-bold text-slate-500">Date</p><p className="font-semibold text-navy-900">{fmtDate(e.event_date)}</p></div></div>}
          {e.event_date && <div className="flex gap-2.5"><Clock size={17} className="text-gold-500 shrink-0" aria-hidden /><div><p className="text-xs uppercase font-bold text-slate-500">Time</p><p className="font-semibold text-navy-900">{new Date(e.event_date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</p></div></div>}
          <div className="flex gap-2.5"><MapPin size={17} className="text-gold-500 shrink-0" aria-hidden /><div><p className="text-xs uppercase font-bold text-slate-500">Venue</p><p className="font-semibold text-navy-900">{e.location || SITE.address}</p></div></div>
        </div>
        {e.description && <p className="mt-6 text-lg text-slate-600 leading-relaxed">{e.description}</p>}
        {e.body && <div className="mt-4 prose-sip">{e.body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}</div>}
        <div className="mt-8 card p-6 bg-gold-50 !border-gold-200">
          <h2 className="font-display font-bold text-navy-900">Registration</h2>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{e.registration_info || 'To register or confirm attendance, contact us on ' + SITE.phone + ' or email ' + SITE.email + '.'}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/contact" className="btn btn-navy btn-sm">Contact Us</Link>
            <a href={SITE.phoneHref} className="btn btn-outline btn-sm">Call {SITE.phone}</a>
          </div>
        </div>
      </article>
    </main>
  );
}
