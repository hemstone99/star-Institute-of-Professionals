import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarDays, GraduationCap, Inbox, MessagesSquare, Newspaper, Users, AlertCircle } from 'lucide-react';
import { api, fmtDateTime } from '../../lib/api';
import { useSEO } from '../../lib/seo';

type Counts = Record<string, number>;

const CARDS = [
  { key: 'applications', label: 'Applications', icon: Inbox, to: '/admin/applications', accent: true },
  { key: 'messages', label: 'Messages', icon: MessagesSquare, to: '/admin/messages', accent: true },
  { key: 'graduation', label: 'Graduation Requests', icon: GraduationCap, to: '/admin/graduation' },
  { key: 'courses', label: 'Courses', icon: BookOpen, to: '/admin/courses' },
  { key: 'news', label: 'News Articles', icon: Newspaper, to: '/admin/news' },
  { key: 'events', label: 'Events', icon: CalendarDays, to: '/admin/events' },
  { key: 'staff', label: 'Staff', icon: Users, to: '/admin/staff' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts>({});
  const [recent, setRecent] = useState<any[]>([]);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO({ title: 'Admin Dashboard', description: 'Institution management dashboard.' });

  useEffect(() => {
    (async () => {
      try {
        const [apps, msgs, grads, courses, news, events, staff] = await Promise.all([
          api('/api/applications?limit=200'), api('/api/messages'), api('/api/graduation'),
          api('/api/courses'), api('/api/news'), api('/api/events'), api('/api/staff'),
        ]);
        const len = (x: any) => (Array.isArray(x) ? x.length : 0);
        setCounts({
          applications: len(apps), messages: len(msgs), graduation: len(grads),
          courses: len(courses), news: len(news), events: len(events), staff: len(staff),
        });
        const pend = Array.isArray(apps) ? apps.filter((a: any) => a.status === 'Pending').length : 0;
        setPending(pend);
        setRecent(Array.isArray(apps) ? apps.slice(0, 5) : []);
      } catch (e: any) { setError(e.message); } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-28" />)}</div>);
  if (error) return (<div className="card p-8 text-center"><p className="text-sm text-red-600">{error}</p></div>);

  return (
    <div>
      <h1 className="font-display font-extrabold text-navy-900 text-2xl">Dashboard</h1>
      <p className="text-sm text-slate-500 mt-1">Institution overview — content, enquiries and admissions at a glance.</p>

      {pending > 0 && (
        <Link to="/admin/applications?status=Pending" className="mt-5 flex items-center gap-3 rounded border border-gold-300 bg-gold-50 px-4 py-3 text-sm font-semibold text-gold-800 hover:border-gold-500">
          <AlertCircle size={18} aria-hidden /> {pending} application{pending === 1 ? '' : 's'} awaiting review — open Applications
        </Link>
      )}

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((c) => (
          <Link key={c.key} to={c.to} className={'card card-hover p-5 flex items-center gap-4 ' + (c.accent ? '!border-gold-300' : '')}>
            <span className={'p-3 rounded ' + (c.accent ? 'bg-gold-500 text-white' : 'bg-navy-900 text-gold-400')} aria-hidden><c.icon size={20} /></span>
            <span><span className="block font-display font-extrabold text-2xl text-navy-900">{counts[c.key] ?? 0}</span><span className="block text-xs font-semibold text-slate-500">{c.label}</span></span>
          </Link>
        ))}
      </div>

      <div className="mt-8 card">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-display font-bold text-navy-900">Recent Applications</h2>
          <Link to="/admin/applications" className="text-sm font-semibold text-gold-600 hover:text-gold-700">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-500">No applications yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((a: any) => (
              <li key={a.id} className="px-5 py-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-semibold text-navy-900">{a.first_name} {a.last_name}</span>
                <span className="text-slate-500">{a.course_name}</span>
                <span className="ml-auto text-xs text-slate-400">{fmtDateTime(a.created_at)}</span>
                <StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-800', New: 'bg-blue-100 text-blue-800',
    Reviewed: 'bg-slate-200 text-slate-700', Contacted: 'bg-violet-100 text-violet-800',
    Admitted: 'bg-green-100 text-green-800', Rejected: 'bg-red-100 text-red-800', Resolved: 'bg-green-100 text-green-800',
  };
  return <span className={'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ' + (map[status] || 'bg-slate-200 text-slate-700')}>{status}</span>;
}
