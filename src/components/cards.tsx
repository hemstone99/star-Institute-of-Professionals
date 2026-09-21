import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock, MapPin, MonitorSmartphone } from 'lucide-react';
import { categoryImage } from '../lib/constants';
import { fmtDate } from '../lib/api';

export type Course = {
  id: number; slug: string; name: string; category: string; description: string;
  duration: string; study_mode: string; requirements: string; image: string;
  featured: boolean; level: string;
};

export function CourseCard({ c }: { c: Course }) {
  return (
    <article className="card card-hover overflow-hidden flex flex-col">
      <div className="relative h-44 overflow-hidden bg-navy-50">
        <img src={categoryImage(c.category, c.image)} alt="" loading="lazy" className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wide bg-navy-900/90 text-white px-2.5 py-1 rounded">{c.category}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-navy-900 text-lg leading-snug">
          <Link to={'/courses/' + c.slug} className="hover:text-gold-600 transition-colors">{c.name}</Link>
        </h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">{c.description}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
          {c.duration && <span className="inline-flex items-center gap-1.5"><Clock size={13} aria-hidden />{c.duration}</span>}
          {c.study_mode && <span className="inline-flex items-center gap-1.5"><MonitorSmartphone size={13} aria-hidden />{c.study_mode}</span>}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 mt-auto">
          <Link to={'/courses/' + c.slug} className="btn btn-outline btn-sm flex-1">View Details</Link>
          <Link to={'/apply?course=' + encodeURIComponent(c.slug)} className="btn btn-gold btn-sm flex-1">Apply</Link>
        </div>
      </div>
    </article>
  );
}

export type NewsItem = { slug: string; title: string; excerpt: string; image: string; category: string; published_at: string; featured: boolean };

export function NewsCard({ n, large }: { n: NewsItem; large?: boolean }) {
  return (
    <article className={'card card-hover overflow-hidden flex flex-col ' + (large ? 'md:col-span-2 md:flex-row' : '')}>
      <Link to={'/news/' + n.slug} className={'block overflow-hidden bg-navy-50 ' + (large ? 'md:w-1/2 h-56 md:h-auto' : 'h-48')} aria-label={n.title}>
        {n.image && <img src={n.image} alt="" loading="lazy" className="w-full h-full object-cover" />}
      </Link>
      <div className={'p-5 flex flex-col flex-1 ' + (large ? 'md:justify-center md:p-8' : '')}>
        <div className="flex items-center gap-2 text-xs">
          {n.category && <span className="font-bold uppercase tracking-wide text-gold-600">{n.category}</span>}
          <span className="text-slate-400">·</span>
          <time className="text-slate-500" dateTime={n.published_at}>{fmtDate(n.published_at)}</time>
        </div>
        <h3 className={'font-display font-bold text-navy-900 leading-snug mt-2 ' + (large ? 'text-xl md:text-2xl' : 'text-base')}>
          <Link to={'/news/' + n.slug} className="hover:text-gold-600 transition-colors">{n.title}</Link>
        </h3>
        {n.excerpt && <p className="text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">{n.excerpt}</p>}
        <Link to={'/news/' + n.slug} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-700">
          Read More <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export type EventItem = { slug: string; title: string; description: string; image: string; event_date: string; end_date: string; location: string };

export function EventCard({ e }: { e: EventItem }) {
  const d = e.event_date ? new Date(e.event_date) : null;
  return (
    <article className="card card-hover p-5 flex gap-4">
      <div className="shrink-0 w-16 text-center rounded bg-navy-900 text-white py-2.5 h-fit" aria-hidden>
        <span className="block text-xl font-extrabold font-display leading-none">{d ? d.getDate() : '—'}</span>
        <span className="block text-[11px] font-bold uppercase tracking-wide text-gold-300 mt-1">{d ? d.toLocaleString('en', { month: 'short' }) : ''}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-display font-bold text-navy-900 leading-snug">
          <Link to={'/events/' + e.slug} className="hover:text-gold-600 transition-colors">{e.title}</Link>
        </h3>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          {e.event_date && <span className="inline-flex items-center gap-1"><CalendarDays size={12} aria-hidden />{fmtDate(e.event_date)}</span>}
          {e.location && <span className="inline-flex items-center gap-1"><MapPin size={12} aria-hidden />{e.location}</span>}
        </div>
        {e.description && <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{e.description}</p>}
      </div>
    </article>
  );
}
