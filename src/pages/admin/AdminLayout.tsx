import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, CalendarDays, ExternalLink, FileText, GraduationCap, Images, Inbox, LayoutDashboard, LogOut, Megaphone, Menu, MessagesSquare, Newspaper, Quote, Settings, Users, X, HelpCircle } from 'lucide-react';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/applications', label: 'Applications', icon: Inbox },
  { to: '/admin/messages', label: 'Messages', icon: MessagesSquare },
  { to: '/admin/graduation', label: 'Graduation', icon: GraduationCap },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/news', label: 'News', icon: Newspaper },
  { to: '/admin/events', label: 'Events', icon: CalendarDays },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/staff', label: 'Staff', icon: Users },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { to: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [user, setUser] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sip_admin_token');
    if (!token) { nav('/admin/login', { replace: true }); return; }
    fetch('/api/admin-login', { headers: { 'X-Admin-Token': token } }).then((r) => {
      if (!r.ok) throw new Error();
      return r.json();
    }).then((d) => { setUser(d.username || ''); setReady(true); }).catch(() => {
      localStorage.removeItem('sip_admin_token');
      nav('/admin/login', { replace: true });
    });
  }, [nav]);

  const logout = async () => {
    const token = localStorage.getItem('sip_admin_token');
    try { await fetch('/api/admin-login', { method: 'DELETE', headers: { 'X-Admin-Token': token || '' } }); } catch {}
    localStorage.removeItem('sip_admin_token');
    nav('/admin/login', { replace: true });
  };

  if (!ready) return (<main className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-sm text-slate-500">Verifying session…</p></main>);

  const side = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-display font-extrabold text-white leading-tight">Star Institute<br /><span className="text-gold-400 text-sm font-bold">Management System</span></p>
        <p className="text-xs text-navy-200 mt-1.5 flex items-center gap-1.5"><Bell size={12} aria-hidden /> Signed in as <strong className="text-white">{user}</strong></p>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5" aria-label="Admin">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setDrawer(false)}
            className={({ isActive }) => 'flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-colors ' + (isActive ? 'bg-gold-500 text-white' : 'text-navy-100 hover:bg-white/10 hover:text-white')}>
            <l.icon size={17} aria-hidden />{l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold text-navy-100 hover:bg-white/10 hover:text-white"><ExternalLink size={17} aria-hidden /> View Website</Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold text-navy-100 hover:bg-white/10 hover:text-white"><LogOut size={17} aria-hidden /> Sign Out</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <a href="#admin-content" className="skip-link">Skip to content</a>
      <aside className="hidden lg:flex w-64 shrink-0 bg-navy-900 min-h-screen sticky top-0 h-screen">{side}</aside>
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Admin menu">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setDrawer(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-navy-900">{side}</aside>
          <button onClick={() => setDrawer(false)} className="absolute top-4 right-4 p-2 rounded bg-white" aria-label="Close menu"><X size={20} /></button>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="lg:hidden sticky top-0 z-40 bg-navy-900 text-white px-4 py-3 flex items-center justify-between">
          <p className="font-display font-bold text-sm">Star Institute <span className="text-gold-400">· Admin</span></p>
          <button onClick={() => setDrawer(true)} className="p-2 rounded hover:bg-white/10" aria-label="Open admin menu"><Menu size={20} /></button>
        </div>
        <main id="admin-content" className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full"><Outlet /></main>
      </div>
    </div>
  );
}
