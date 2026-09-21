import { useState } from 'react';
import { CheckCircle2, Clock, Facebook, GraduationCap, Instagram, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { api } from '../lib/api';
import { SITE } from '../lib/constants';
import { useSEO } from '../lib/seo';
import { PageHero } from '../components/ui';

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useSEO({ title: 'Contact Us', description: 'Contact Star Institute of Professionals: Maganjo House, Nyerere Avenue, Mombasa. Phone +254 704 978 271, email starinstitute.msa@gmail.com. Office hours and map.', path: '/contact' });

  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: '' })); };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!isEmail(form.email)) e.email = 'Enter a valid email address.';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Please write a message of at least 10 characters.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSending(true); setError('');
    try {
      await api('/api/messages', { method: 'POST', body: JSON.stringify(form) });
      setDone(true);
    } catch (err: any) { setError(err.message || 'Could not send your message. Please try again.'); }
    finally { setSending(false); }
  };

  return (
    <main id="main-content">
      <PageHero eyebrow="Get In Touch" title="Contact Us" text="Questions about courses, admissions or fees? Our team is ready to help." />
      <section className="container-x py-12 md:py-16 grid lg:grid-cols-5 gap-10" aria-label="Contact details and form">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <h2 className="font-display font-bold text-navy-900">Visit Us</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed flex gap-2.5"><MapPin size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden /><span>{SITE.address}<br />{SITE.postal}</span></p>
            <p className="mt-3 text-sm text-slate-600 flex gap-2.5"><Clock size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden />{SITE.hours}</p>
          </div>
          <div className="card p-6">
            <h2 className="font-display font-bold text-navy-900">Call or Email</h2>
            <p className="mt-2 text-sm"><a href={SITE.phoneHref} className="flex gap-2.5 font-semibold text-navy-900 hover:text-gold-600"><Phone size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden />{SITE.phone}</a></p>
            <p className="mt-2 text-sm"><a href={SITE.phoneAltHref} className="flex gap-2.5 text-slate-600 hover:text-gold-600"><Phone size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden />{SITE.phoneAlt}</a></p>
            <p className="mt-2 text-sm break-all"><a href={'mailto:' + SITE.email} className="flex gap-2.5 text-slate-600 hover:text-gold-600"><Mail size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden />{SITE.email}</a></p>
            <p className="mt-2 text-sm break-all"><a href={'mailto:' + SITE.email2} className="flex gap-2.5 text-slate-600 hover:text-gold-600"><Mail size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden />{SITE.email2}</a></p>
          </div>
          <div className="card p-6">
            <h2 className="font-display font-bold text-navy-900">Connect</h2>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <a href={SITE.facebook} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Facebook size={15} aria-hidden /> Facebook</a>
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><Instagram size={15} aria-hidden /> Instagram</a>
              <a href={SITE.elearning} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><GraduationCap size={15} aria-hidden /> eLearning</a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {done ? (
            <div className="card p-10 text-center">
              <CheckCircle2 size={52} className="mx-auto text-green-600" aria-hidden />
              <h2 className="font-display font-extrabold text-navy-900 text-2xl mt-4">Message Sent</h2>
              <p className="mt-2 text-slate-600">Thank you, {form.name.split(' ')[0]}. We will get back to you shortly — usually within one working day.</p>
              <button onClick={() => { setDone(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="btn btn-outline btn-sm mt-6">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={submit} className="card p-6 md:p-8" noValidate aria-label="Contact form">
              <h2 className="font-display font-extrabold text-navy-900 text-xl">Send Us a Message</h2>
              <p className="text-sm text-slate-500 mt-1">We respond within one working day.</p>
              {error && <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
              <div className="mt-5 grid sm:grid-cols-2 gap-5">
                <div><label className="label" htmlFor="c-name">Full Name</label><input id="c-name" value={form.name} onChange={(e) => set('name', e.target.value)} className="field" autoComplete="name" aria-invalid={errors.name ? 'true' : undefined} />{errors.name && <p className="ferr" role="alert">{errors.name}</p>}</div>
                <div><label className="label" htmlFor="c-email">Email Address</label><input id="c-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className="field" autoComplete="email" aria-invalid={errors.email ? 'true' : undefined} />{errors.email && <p className="ferr" role="alert">{errors.email}</p>}</div>
                <div><label className="label" htmlFor="c-phone">Phone <span className="font-normal text-slate-400">(optional)</span></label><input id="c-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="field" autoComplete="tel" /></div>
                <div><label className="label" htmlFor="c-subject">Subject <span className="font-normal text-slate-400">(optional)</span></label>
                  <select id="c-subject" value={form.subject} onChange={(e) => set('subject', e.target.value)} className="field">
                    <option value="">Select a subject…</option>
                    <option>Admissions Enquiry</option><option>Course Information</option><option>Fees & Payment</option><option>eLearning Support</option><option>Graduation</option><option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2"><label className="label" htmlFor="c-msg">Message</label><textarea id="c-msg" value={form.message} onChange={(e) => set('message', e.target.value)} className="field" rows={5} aria-invalid={errors.message ? 'true' : undefined} />{errors.message && <p className="ferr" role="alert">{errors.message}</p>}</div>
              </div>
              <button type="submit" disabled={sending} className="btn btn-gold mt-6 w-full sm:w-auto">
                {sending ? <><Loader2 size={17} className="animate-spin" aria-hidden /> Sending…</> : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
      <section className="container-x pb-14" aria-label="Map">
        <div className="rounded-lg overflow-hidden border border-slate-200">
          <iframe title="Map — Maganjo House, Nyerere Avenue, Mombasa" src={SITE.mapEmbed} className="w-full h-72 md:h-96" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </main>
  );
}
