import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Search, Trash2, X } from 'lucide-react';
import { api, fmtDateTime } from '../../lib/api';
import { useSEO } from '../../lib/seo';
import { StatusBadge } from './Dashboard';

export function Applications() {
  return <InboxPage
    title="Applications" endpoint="/api/applications" singular="Application"
    statuses={['Pending', 'Reviewed', 'Contacted', 'Admitted', 'Rejected']}
    searchKeys={['first_name', 'last_name', 'email', 'phone', 'course_name']}
    columns={[['first_name', 'last_name', 'Applicant'], ['course_name', '', 'Programme'], ['phone', '', 'Phone'], ['created_at', '', 'Submitted']]}
  />;
}

export function Messages() {
  return <InboxPage
    title="Messages" endpoint="/api/messages" singular="Message"
    statuses={['New', 'Reviewed', 'Resolved']}
    searchKeys={['name', 'email', 'subject', 'message']}
    columns={[['name', '', 'From'], ['subject', '', 'Subject'], ['email', '', 'Email'], ['created_at', '', 'Received']]}
  />;
}

export function GraduationRequests() {
  return <InboxPage
    title="Graduation Requests" endpoint="/api/graduation" singular="Request"
    statuses={['Pending', 'Reviewed', 'Contacted', 'Admitted', 'Rejected']}
    searchKeys={['student_names', 'email', 'admission_number']}
    columns={[['student_names', '', 'Student'], ['admission_number', '', 'Admission No.'], ['year_completed', '', 'Completed'], ['created_at', '', 'Submitted']]}
  />;
}

function InboxPage({ title, endpoint, singular, statuses, searchKeys, columns }: {
  title: string; endpoint: string; singular: string; statuses: string[]; searchKeys: string[]; columns: [string, string, string][];
}) {
  const [params] = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState(params.get('status') || '');
  const [view, setView] = useState<any | null>(null);

  useSEO({ title: 'Admin — ' + title, description: 'Manage ' + title.toLowerCase() + '.' });

  const fetchAll = async () => {
    setLoading(true); setError('');
    try {
      const d = await api(endpoint);
      setItems(Array.isArray(d) ? d : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, [endpoint]);

  const setRowStatus = async (it: any, s: string) => {
    try {
      await api(endpoint, { method: 'PUT', body: JSON.stringify({ id: it.id, status: s }) });
      setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, status: s } : x)));
      if (view?.id === it.id) setView({ ...view, status: s });
    } catch (e: any) { alert(e.message); }
  };

  const remove = async (it: any) => {
    if (!confirm('Delete this ' + singular.toLowerCase() + '? This cannot be undone.')) return;
    try {
      await api(endpoint + '?id=' + it.id, { method: 'DELETE' });
      setItems((prev) => prev.filter((x) => x.id !== it.id));
      setView(null);
    } catch (e: any) { alert(e.message); }
  };

  const filtered = items.filter((it) => {
    if (status && it.status !== status) return false;
    if (q.trim() && !searchKeys.map((k) => String(it[k] ?? '')).join(' ').toLowerCase().includes(q.trim().toLowerCase())) return false;
    return true;
  });

  const cell = (it: any, k1: string, k2: string) => {
    if (k1 === 'created_at') return fmtDateTime(it[k1]);
    if (k2) return (it[k1] || '') + ' ' + (it[k2] || '');
    return String(it[k1] || '—').slice(0, 60);
  };

  const detailRows = (it: any): [string, string][] => {
    if (endpoint.includes('applications')) return [
      ['Name', (it.first_name || '') + ' ' + (it.last_name || '')], ['Email', it.email], ['Phone', it.phone],
      ['ID Number', it.id_number], ['Date of Birth', it.dob], ['Gender', it.gender], ['Address', it.address],
      ['Programme', it.course_name], ['Study Mode', it.study_mode], ['Academic Level', it.academic_level],
      ['School', it.school], ['Grade', it.grade], ['Guardian', (it.guardian_name || '') + (it.guardian_phone ? ' (' + it.guardian_phone + ')' : '')],
      ['Documents Note', it.documents_note], ['Submitted', fmtDateTime(it.created_at)],
    ];
    if (endpoint.includes('messages')) return [
      ['From', it.name], ['Email', it.email], ['Phone', it.phone], ['Subject', it.subject || '—'],
      ['Message', it.message], ['Received', fmtDateTime(it.created_at)],
    ];
    return [
      ['Student Names', it.student_names], ['Email', it.email], ['Phone', it.phone],
      ['Admission Number', it.admission_number], ['National ID', it.national_id],
      ['Year Completed', it.year_completed], ['Submitted', fmtDateTime(it.created_at)],
    ];
  };

  return (
    <div>
      <h1 className="font-display font-extrabold text-navy-900 text-2xl">{title}</h1>
      <p className="text-sm text-slate-500 mt-0.5">{items.length} total · {items.filter((i) => i.status === 'Pending' || i.status === 'New').length} awaiting action</p>
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="field !pl-10 bg-white" aria-label="Search" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="field sm:w-48 bg-white" aria-label="Filter by status">
          <option value="">All Statuses</option>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="card mt-4 overflow-hidden">
        {loading ? <p className="p-6 text-sm text-slate-500">Loading…</p>
          : error ? <p className="p-6 text-sm text-red-600">{error} <button onClick={fetchAll} className="underline font-semibold">Retry</button></p>
          : filtered.length === 0 ? <p className="p-6 text-sm text-slate-500">No records found.</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead><tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  {columns.map(([k1, k2, label]) => <th key={label} className="px-4 py-3 font-bold">{label}</th>)}
                  <th className="px-4 py-3 font-bold">Status</th><th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((it) => (
                    <tr key={it.id} className="hover:bg-slate-50/60">
                      {columns.map(([k1, k2, label]) => (
                        <td key={label} className="px-4 py-3 max-w-56 truncate text-slate-600 first:font-semibold first:text-navy-900">{cell(it, k1, k2)}</td>
                      ))}
                      <td className="px-4 py-3">
                        <select value={it.status} onChange={(e) => setRowStatus(it, e.target.value)} className="text-xs font-bold rounded-full border border-slate-200 bg-white px-2.5 py-1" aria-label="Set status">
                          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button onClick={() => setView(it)} className="p-2 rounded hover:bg-slate-200 text-navy-900" aria-label="View details"><Eye size={16} /></button>
                        <button onClick={() => remove(it)} className="p-2 rounded hover:bg-red-100 text-red-600" aria-label="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
      {view && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={singular + ' details'}>
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setView(null)} />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-display font-bold text-navy-900">{singular} Details</h2>
              <button onClick={() => setView(null)} className="p-2 rounded hover:bg-slate-100" aria-label="Close"><X size={19} /></button>
            </div>
            <div className="overflow-y-auto px-6 py-5">
              <div className="flex items-center gap-3 mb-4"><StatusBadge status={view.status} />
                <select value={view.status} onChange={(e) => setRowStatus(view, e.target.value)} className="field !w-auto !py-1.5 text-sm" aria-label="Set status">
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <dl className="space-y-2.5 text-sm">
                {detailRows(view).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-2">
                    <dt className="text-slate-500 font-medium">{k}</dt><dd className="col-span-2 text-navy-900 whitespace-pre-wrap">{v || '—'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
