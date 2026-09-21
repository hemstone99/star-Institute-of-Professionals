import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useSEO } from '../../lib/seo';

const FIELDS: [string, string, string][] = [
  ['phone', 'Phone (primary)', 'tel'],
  ['phone_alt', 'Phone (alternative)', 'tel'],
  ['email', 'Email (primary)', 'email'],
  ['email2', 'Email (secondary)', 'email'],
  ['address', 'Street Address', 'text'],
  ['postal', 'Postal Address', 'text'],
  ['hours', 'Office Hours', 'text'],
  ['facebook', 'Facebook URL', 'url'],
  ['instagram', 'Instagram URL', 'url'],
  ['elearning', 'eLearning Portal URL', 'url'],
  ['tagline', 'Tagline', 'text'],
];

export default function Settings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [msg, setMsg] = useState('');

  useSEO({ title: 'Admin — Site Settings', description: 'Manage contact information.' });

  useEffect(() => {
    api('/api/settings').then((d) => setValues(d || {})).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async (key: string) => {
    setSaving(key); setMsg('');
    try {
      await api('/api/settings', { method: 'PUT', body: JSON.stringify({ key, value: values[key] || '' }) });
      setMsg('Saved “' + key + '”.');
    } catch (e: any) { setMsg('Error: ' + e.message); }
    finally { setSaving(''); }
  };

  if (loading) return (<div className="card p-6 text-sm text-slate-500">Loading settings…</div>);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-extrabold text-navy-900 text-2xl">Site Settings</h1>
      <p className="text-sm text-slate-500 mt-1">Contact information displayed across the website. Changes apply immediately.</p>
      {msg && <p className="mt-4 rounded bg-gold-50 border border-gold-200 px-4 py-2.5 text-sm text-gold-800" role="status">{msg}</p>}
      <div className="card mt-5 p-6 space-y-4">
        {FIELDS.map(([key, label, type]) => (
          <div key={key}>
            <label className="label" htmlFor={'s-' + key}>{label}</label>
            <div className="flex gap-2">
              <input id={'s-' + key} type={type} value={values[key] || ''} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} className="field" />
              <button onClick={() => save(key)} disabled={saving === key} className="btn btn-navy btn-sm shrink-0">
                {saving === key ? <Loader2 size={15} className="animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
