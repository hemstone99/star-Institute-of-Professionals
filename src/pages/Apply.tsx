import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useSEO } from '../lib/seo';
import { PageHero } from '../components/ui';

type Course = { id: number; slug: string; name: string; category: string };

const STEPS = ['Personal Details', 'Academic Information', 'Programme Selection', 'Documents & Review'];

type Form = {
  first_name: string; last_name: string; email: string; phone: string; id_number: string;
  dob: string; gender: string; address: string; academic_level: string; school: string;
  grade: string; course_slug: string; study_mode: string; guardian_name: string;
  guardian_phone: string; documents_note: string;
};
const BLANK: Form = {
  first_name: '', last_name: '', email: '', phone: '', id_number: '', dob: '', gender: '',
  address: '', academic_level: '', school: '', grade: '', course_slug: '', study_mode: '',
  guardian_name: '', guardian_phone: '', documents_note: '',
};

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

function Field({ label, error, hint, children, optional }: { label: string; error?: string; hint?: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div>
      <label className="label">{label} {optional && <span className="font-normal text-slate-400">(optional)</span>}</label>
      {children}
      {error ? <p className="ferr" role="alert">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

export default function Apply() {
  const [params] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Form>({ ...BLANK, course_slug: params.get('course') || '' });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useSEO({
    title: 'Apply Now — Online Application',
    description: 'Submit your online application to Star Institute of Professionals. Personal details, academic information, programme selection and review — it takes just a few minutes.',
    path: '/apply',
  });

  useEffect(() => {
    api('/api/courses').then((d) => Array.isArray(d) && setCourses(d)).catch(() => {});
  }, []);

  const set = (k: keyof Form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.first_name.trim()) e.first_name = 'First name is required.';
      if (!form.last_name.trim()) e.last_name = 'Last name is required.';
      if (!isEmail(form.email)) e.email = 'Enter a valid email address.';
      if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number.';
    }
    if (s === 1) {
      if (!form.academic_level) e.academic_level = 'Select your highest academic level.';
      if (!form.school.trim()) e.school = 'School / institution name is required.';
    }
    if (s === 2) {
      if (!form.course_slug) e.course_slug = 'Select a programme.';
      if (!form.study_mode) e.study_mode = 'Select a study mode.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => Math.min(s + 1, STEPS.length - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const back = () => { setStep((s) => Math.max(s - 1, 0)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async () => {
    if (!validate(0) || !validate(1) || !validate(2)) { setStep(0); return; }
    setSubmitting(true); setSubmitError('');
    try {
      const course = courses.find((c) => c.slug === form.course_slug);
      await api('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ ...form, course_id: course?.id || null, course_name: course?.name || form.course_slug }),
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      setSubmitError(e.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <main id="main-content">
        <PageHero eyebrow="Application Received" title="Thank You — Application Submitted" text="Our admissions team will contact you with fee details, reporting dates and next steps." />
        <section className="container-x py-14 max-w-2xl text-center">
          <CheckCircle2 size={56} className="mx-auto text-green-600" aria-hidden />
          <h2 className="font-display font-extrabold text-navy-900 text-2xl mt-5">We have received your application</h2>
          <p className="mt-3 text-slate-600 leading-relaxed">A confirmation has been recorded under <strong>{form.email}</strong>. If you need to make changes or have questions, call <a className="font-bold text-navy-900" href="tel:+254704978271">+254 704 978 271</a>.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/courses" className="btn btn-navy">Browse More Courses</Link>
            <Link to="/" className="btn btn-outline">Back to Home</Link>
          </div>
        </section>
      </main>
    );
  }

  const input = (k: keyof Form, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input {...props} value={form[k]} onChange={(e) => set(k, e.target.value)} className="field" aria-invalid={errors[k] ? 'true' : undefined} />
  );

  return (
    <main id="main-content">
      <PageHero eyebrow="Online Application" title="Apply to Star Institute" text="Complete the four steps below. Fields marked optional may be skipped — everything else helps us process your admission faster." />
      <section className="container-x py-12 max-w-3xl" aria-label="Application form">
        <ol className="flex items-center gap-1 sm:gap-2 mb-10" aria-label="Application progress">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1 text-center">
              <div className={'h-1.5 rounded-full ' + (i <= step ? 'bg-gold-500' : 'bg-slate-200')} aria-hidden />
              <p className={'mt-2 text-[11px] sm:text-xs font-semibold ' + (i === step ? 'text-navy-900' : i < step ? 'text-gold-600' : 'text-slate-400')} aria-current={i === step ? 'step' : undefined}>
                <span className="hidden sm:inline">{i + 1}. </span>{s}
              </p>
            </li>
          ))}
        </ol>

        {submitError && <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{submitError}</div>}

        {step === 0 && (
          <div className="card p-6 md:p-8 grid sm:grid-cols-2 gap-5">
            <Field label="First Name" error={errors.first_name}>{input('first_name', { placeholder: 'e.g. Amina', autoComplete: 'given-name' })}</Field>
            <Field label="Last Name" error={errors.last_name}>{input('last_name', { placeholder: 'e.g. Yusuf', autoComplete: 'family-name' })}</Field>
            <Field label="Email Address" error={errors.email}>{input('email', { type: 'email', placeholder: 'you@example.com', autoComplete: 'email' })}</Field>
            <Field label="Phone Number" error={errors.phone} hint="e.g. 0704 978 271">{input('phone', { type: 'tel', placeholder: '07XX XXX XXX', autoComplete: 'tel' })}</Field>
            <Field label="National ID Number" optional>{input('id_number', { placeholder: 'ID number' })}</Field>
            <Field label="Date of Birth" optional>{input('dob', { type: 'date' })}</Field>
            <Field label="Gender" optional>
              <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className="field">
                <option value="">Select…</option><option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option>
              </select>
            </Field>
            <Field label="Home Address / Town" optional>{input('address', { placeholder: 'e.g. Tudor, Mombasa' })}</Field>
          </div>
        )}

        {step === 1 && (
          <div className="card p-6 md:p-8 grid sm:grid-cols-2 gap-5">
            <Field label="Highest Academic Level" error={errors.academic_level}>
              <select value={form.academic_level} onChange={(e) => set('academic_level', e.target.value)} className="field" aria-invalid={errors.academic_level ? 'true' : undefined}>
                <option value="">Select…</option>
                <option>KCSE</option><option>KCPE</option><option>Certificate</option><option>Diploma</option><option>Degree</option><option>Other</option>
              </select>
            </Field>
            <Field label="Mean Grade" optional hint="e.g. C+, B-">{input('grade', { placeholder: 'e.g. C+' })}</Field>
            <div className="sm:col-span-2"><Field label="Last School / Institution Attended" error={errors.school}>{input('school', { placeholder: 'School name' })}</Field></div>
            <Field label="Parent / Guardian Name" optional>{input('guardian_name', { placeholder: 'Guardian full name' })}</Field>
            <Field label="Guardian Phone" optional>{input('guardian_phone', { type: 'tel', placeholder: '07XX XXX XXX' })}</Field>
          </div>
        )}

        {step === 2 && (
          <div className="card p-6 md:p-8 grid gap-5">
            <Field label="Select Programme" error={errors.course_slug} hint="Can't decide? Choose the closest match — admissions will advise you.">
              <select value={form.course_slug} onChange={(e) => set('course_slug', e.target.value)} className="field" aria-invalid={errors.course_slug ? 'true' : undefined}>
                <option value="">Select a programme…</option>
                {courses.map((c) => <option key={c.slug} value={c.slug}>{c.name} — {c.category}</option>)}
              </select>
            </Field>
            <Field label="Preferred Study Mode" error={errors.study_mode}>
              <select value={form.study_mode} onChange={(e) => set('study_mode', e.target.value)} className="field" aria-invalid={errors.study_mode ? 'true' : undefined}>
                <option value="">Select…</option>
                <option>Full-Time</option><option>Part-Time</option><option>Evening</option><option>Weekend</option><option>eLearning / Online</option>
              </select>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="card p-6 md:p-8">
              <Field label="Documents Checklist Note" optional hint="List the documents you have ready (certificates, ID copy, photos). Originals are verified at admission.">
                <textarea value={form.documents_note} onChange={(e) => set('documents_note', e.target.value)} className="field" placeholder="e.g. KCSE result slip, ID copy, 2 passport photos" rows={3} />
              </Field>
            </div>
            <div className="card p-6 md:p-8">
              <h2 className="font-display font-bold text-navy-900">Review Your Application</h2>
              <dl className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[['Name', form.first_name + ' ' + form.last_name], ['Email', form.email], ['Phone', form.phone], ['Academic Level', form.academic_level + (form.grade ? ' (' + form.grade + ')' : '')], ['School', form.school], ['Programme', courses.find((c) => c.slug === form.course_slug)?.name || form.course_slug], ['Study Mode', form.study_mode]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-2"><dt className="text-slate-500">{k}</dt><dd className="font-semibold text-navy-900 text-right">{v || '—'}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button onClick={back} disabled={step === 0} className="btn btn-outline"><ArrowLeft size={17} aria-hidden /> Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="btn btn-navy">Continue <ArrowRight size={17} aria-hidden /></button>
          ) : (
            <button onClick={submit} disabled={submitting} className="btn btn-gold">
              {submitting ? <><Loader2 size={17} className="animate-spin" aria-hidden /> Submitting…</> : <>Review & Submit <ArrowRight size={17} aria-hidden /></>}
            </button>
          )}
        </div>
        <p className="mt-6 text-xs text-slate-500 text-center">By submitting, you agree to be contacted about your application. See our <Link to="/privacy" className="underline">Privacy Policy</Link>.</p>
      </section>
    </main>
  );
}
