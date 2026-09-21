import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import { useSEO } from '../../lib/seo';
import { RESOURCES, STOCK_IMAGES, type Field } from './config';

function toInputDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
}

export default function ResourceManager() {
  const { resource = '' } = useParams();
  const cfg = RESOURCES[resource];
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useSEO({ title: 'Manage ' + (cfg?.title || ''), description: 'Manage content.' });

  const fetchAll = useCallback(async () => {
    if (!cfg) return;
    setLoading(true); setError('');
    try {
      const d = await api(cfg.endpoint);
      setItems(Array.isArray(d) ? d : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, [cfg?.endpoint]);

  useEffect(() => { fetchAll(); setQ(''); setEditing(null); setFormOpen(false); }, [fetchAll]);

  if (!cfg) return (<div className="card p-8 text-center text-sm text-slate-500">Unknown resource.</div>);

  const blank = () => {
    const o: any = {};
    cfg.fields.forEach((f) => { o[f.key] = f.type === 'checkbox' ? (f.key === 'published' ? true : false) : f.type === 'number' ? 0 : ''; });
    return o;
  };

  const openCreate = () => { setEditing(null); setForm(blank()); setFormError(''); setFormOpen(true); };
  const openEdit = (it: any) => {
    const o: any = {};
    cfg.fields.forEach((f) => {
      let v = it[f.key];
      if (f.type === 'datetime' && v) v = toInputDate(v);
      if (f.type === 'checkbox') v = !!v;
      o[f.key] = v ?? (f.type === 'number' ? 0 : '');
    });
    setEditing(it); setForm(o); setFormError(''); setFormOpen(true);
  };

  const save = async () => {
    setFormError('');
    for (const f of cfg.fields) {
      if (f.required && !String(form[f.key] ?? '').trim()) { setFormError(f.label + ' is required.'); return; }
    }
    setSaving(true);
    try {
      const payload: any = { ...form };
      cfg.fields.forEach((f) => {
        if (f.type === 'datetime' && payload[f.key]) payload[f.key] = new Date(payload[f.key]).toISOString();
        if (f.type === 'number') payload[f.key] = Number(payload[f.key]) || 0;
      });
      if (editing) await api(cfg.endpoint, { method: 'PUT', body: JSON.stringify({ ...payload, id: editing.id }) });
      else await api(cfg.endpoint, { method: 'POST', body: JSON.stringify(payload) });
      setFormOpen(false);
      fetchAll();
    } catch (e: any) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const remove = async (it: any) => {
    const label = it.name || it.title || it.question || 'this item';
    if (!confirm('Delete "' + label + '"? This cannot be undone.')) return;
    try {
      await api(cfg.endpoint + '?id=' + it.id, { method: 'DELETE' });
      fetchAll();
    } catch (e: any) { alert(e.message); }
  };

  const togglePublish = async (it: any) => {
    try {
      await api(cfg.endpoint, { method: 'PUT', body: JSON.stringify({ id: it.id, published: !it.published }) });
      fetchAll();
    } catch (e: any) { alert(e.message); }
  };

  const filtered = items.filter((it) => {
    if (!q.trim()) return true;
    const hay = cfg.columns.map((c) => String(it[c.key] ?? '')).join(' ').toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  const renderInput = (f: Field) => {
    const v = form[f.key] ?? '';
    const set = (val: any) => setForm((s: any) => ({ ...s, [f.key]: val }));
    if (f.type === 'textarea') return <textarea value={v} onChange={(e) => set(e.target.value)} className="field" rows={3} placeholder={f.placeholder} />;
    if (f.type === 'tall') return <textarea value={v} onChange={(e) => set(e.target.value)} className="field" rows={6} placeholder={f.placeholder} />;
    if (f.type === 'select') return (
      <select value={v} onChange={(e) => set(e.target.value)} className="field">
        <option value="">Select…</option>{(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
    if (f.type === 'checkbox') return (
      <label className="inline-flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer">
        <input type="checkbox" checked={!!v} onChange={(e) => set(e.target.checked)} className="w-4 h-4 accent-[#c8922a]" /> Enable
      </label>
    );
    if (f.type === 'number') return <input type="number" value={v} onChange={(e) => set(e.target.value)} className="field" />;
    if (f.type === 'date') return <input type="date" value={v} onChange={(e) => set(e.target.value)} className="field" />;
    if (f.type === 'datetime') return <input type="datetime-local" value={v} onChange={(e) => set(e.target.value)} className="field" />;
    if (f.type === 'image') return (
      <div>
        <input value={v} onChange={(e) => set(e.target.value)} className="field" placeholder="/images/example.jpg or https://…" />
        <div className="flex flex-wrap gap-2 mt-2">
          {STOCK_IMAGES.map((s) => (
            <button key={s} type="button" onClick={() => set(s)} className={'rounded overflow-hidden border-2 ' + (v === s ? 'border-gold-500' : 'border-transparent')} aria-label={'Use ' + s}>
              <img src={s} alt="" className="w-16 h-12 object-cover" loading="lazy" />
            </button>
          ))}
        </div>
        {v && <img src={v} alt="Preview" className="mt-2 h-20 rounded border border-slate-200 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
      </div>
    );
    return <input value={v} onChange={(e) => set(e.target.value)} className="field" placeholder={f.placeholder} />;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display font-extrabold text-navy-900 text-2xl">{cfg.title}</h1><p className="text-sm text-slate-500 mt-0.5">{items.length} record{items.length === 1 ? '' : 's'}</p></div>
        <button onClick={openCreate} className="btn btn-gold btn-sm"><Plus size={16} aria-hidden /> New {cfg.singular}</button>
      </div>

      <div className="relative mt-5 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={'Search ' + cfg.title.toLowerCase() + '…'} className="field !pl-10 bg-white" aria-label="Search" />
      </div>

      <div className="card mt-4 overflow-hidden">
        {loading ? <p className="p-6 text-sm text-slate-500">Loading…</p>
          : error ? <p className="p-6 text-sm text-red-600">{error} <button onClick={fetchAll} className="underline font-semibold">Retry</button></p>
          : filtered.length === 0 ? <p className="p-6 text-sm text-slate-500">No records found.</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead><tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  {cfg.columns.map((c) => <th key={c.key} className="px-4 py-3 font-bold">{c.label}</th>)}
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((it) => (
                    <tr key={it.id} className="hover:bg-slate-50/60">
                      {cfg.columns.map((c) => (
                        <td key={c.key} className="px-4 py-3 max-w-72 truncate">
                          {c.key === 'published' ? (
                            <button onClick={() => togglePublish(it)} title="Toggle publish" className={'px-2.5 py-0.5 rounded-full text-[11px] font-bold ' + (it.published ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600')}>
                              {it.published ? 'Published' : 'Draft'}
                            </button>
                          ) : c.badge ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-navy-50 text-navy-700">{String(it[c.key] ?? '—').slice(0, 40)}</span>
                          ) : (
                            <span className={c.key === 'name' || c.key === 'title' || c.key === 'question' ? 'font-semibold text-navy-900' : 'text-slate-600'}>{String(it[c.key] ?? '—').slice(0, 80)}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button onClick={() => openEdit(it)} className="p-2 rounded hover:bg-slate-200 text-navy-900" aria-label="Edit"><Pencil size={16} /></button>
                        <button onClick={() => remove(it)} className="p-2 rounded hover:bg-red-100 text-red-600" aria-label="Delete"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={(editing ? 'Edit ' : 'New ') + cfg.singular}>
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setFormOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="font-display font-bold text-navy-900">{editing ? 'Edit' : 'New'} {cfg.singular}</h2>
              <button onClick={() => setFormOpen(false)} className="p-2 rounded hover:bg-slate-100" aria-label="Close"><X size={19} /></button>
            </div>
            <div className="overflow-y-auto px-6 py-5 space-y-4">
              {formError && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</div>}
              {cfg.fields.map((f) => (
                <div key={f.key}>
                  <label className="label">{f.label} {f.required && <span className="text-red-500">*</span>}</label>
                  {renderInput(f)}
                  {f.hint && <p className="hint">{f.hint}</p>}
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-lg">
              <button onClick={() => setFormOpen(false)} className="btn btn-outline btn-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn btn-gold btn-sm">{saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save ' + cfg.singular}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
