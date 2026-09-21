import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useSEO } from '../lib/seo';
import { PageHero } from '../components/ui';

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
const YEARS = Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() - i));

export default function Graduation() {
  const [form, setForm] = useState({ student_names: '', email: '', admission_number: '', national_id: '', phone: '', year_completed: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useSEO({ title: 'Graduation Request', description: 'Submit your graduation request to Star Institute of Professionals. Provide your names, admission number and year completed.', path: '/graduation' });

  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.student_names.trim()) e.student_names = 'Student names are required.';
    if (!isEmail(form.email)) e.email = 'Enter a valid email address.';
    if (!form.admission_number.trim()) e.admission_number = 'Admission number is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!form.year_completed) e.year_completed = 'Select the year completed.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true); setError('');
    try {
      await api('/api/graduation', { method: 'POST', body: JSON.stringify(form) });
      setDone(true);
    } catch (err: any) { setError(err.message || 'Could not submit. Please try again.'); }
    finally { setSending(false); }
  };

  return (
    <main id="main-content">
      <PageHero eyebrow="Student Affairs" title="Graduation Request" text="Approaching the culmination of your journey? Submit your graduation request — our administrative staff will guide you through the steps." image="/images/graduation.jpg" />
      <section className="container-x py-12 md:py-16 max-w-2xl" aria-label="Graduation request form">
        {done ? (
          <div className="card p-10 text-center">
            <CheckCircle2 size={52} className="mx-auto text-green-600" aria-hidden />
            <h2 className="font-display font-extrabold text-navy-900 text-2xl mt-4">Request Received — Congratulations!</h2>
            <p className="mt-2 text-slate-600">Your graduation request has been recorded. The administration will contact you about clearance and ceremony arrangements.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="card p-6 md:p-8" noValidate>
            {error && <div className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2"><label className="label" htmlFor="g-names">Student Names (as on certificates)</label><input id="g-names" value={form.student_names} onChange={(e) => set('student_names', e.target.value)} className="field" aria-invalid={errors.student_names ? 'true' : undefined} />{errors.student_names && <p className="ferr" role="alert">{errors.student_names}</p>}</div>
              <div><label className="label" htmlFor="g-email">Email Address</label><input id="g-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="field" aria-invalid={errors.email ? 'true' : undefined} />{errors.email && <p className="ferr" role="alert">{errors.email}</p>}</div>
              <div><label className="label" htmlFor="g-phone">Phone Number</label><input id="g-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="field" aria-invalid={errors.phone ? 'true' : undefined} />{errors.phone && <p className="ferr" role="alert">{errors.phone}</p>}</div>
              <div><label className="label" htmlFor="g-adm">Admission Number</label><input id="g-adm" value={form.admission_number} onChange={(e) => set('admission_number', e.target.value)} className="field" aria-invalid={errors.admission_number ? 'true' : undefined} />{errors.admission_number && <p className="ferr" role="alert">{errors.admission_number}</p>}</div>
              <div><label className="label" htmlFor="g-id">National ID <span className="font-normal text-slate-400">(optional)</span></label><input id="g-id" value={form.national_id} onChange={(e) => set('national_id', e.target.value)} className="field" /></div>
              <div className="sm:col-span-2"><label className="label" htmlFor="g-year">Year Completed</label>
                <select id="g-year" value={form.year_completed} onChange={(e) => set('year_completed', e.target.value)} className="field" aria-invalid={errors.year_completed ? 'true' : undefined}>
                  <option value="">Select year…</option>{YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>{errors.year_completed && <p className="ferr" role="alert">{errors.year_completed}</p>}
              </div>
            </div>
            <button type="submit" disabled={sending} className="btn btn-gold mt-6 w-full sm:w-auto">
              {sending ? <><Loader2 size={17} className="animate-spin" aria-hidden /> Submitting…</> : 'Submit Graduation Request'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
