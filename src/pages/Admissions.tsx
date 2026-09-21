import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CalendarClock, Download, FileCheck2, FileText, HandCoins, ListChecks, MonitorSmartphone } from 'lucide-react';
import { api } from '../lib/api';
import { SITE } from '../lib/constants';
import { useSEO } from '../lib/seo';
import Reveal from '../components/Reveal';
import { PageHero, SectionHead, CTABand } from '../components/ui';

type Doc = { id: number; title: string; file_url: string; category: string; description: string };

const STEPS = [
  { icon: ListChecks, t: 'Choose Your Programme', d: 'Browse the course catalogue and select the programme that matches your career goals and qualifications.' },
  { icon: BadgeCheck, t: 'Review Requirements', d: 'Check the entry requirements, duration, study modes and intake dates on the programme page.' },
  { icon: FileCheck2, t: 'Submit Your Application', d: 'Complete the online application form with your personal, academic and programme details.' },
  { icon: FileText, t: 'Receive Admission Information', d: 'Our admissions team will contact you with fee details, reporting dates and next steps.' },
];

export default function Admissions() {
  const [docs, setDocs] = useState<Doc[]>([]);

  useSEO({
    title: 'Admissions',
    description: 'How to apply to Star Institute of Professionals: choose a programme, review requirements, submit your application and receive admission information. Fee structures available for download.',
    path: '/admissions',
  });

  useEffect(() => {
    api('/api/documents').then((d) => Array.isArray(d) && setDocs(d.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <main id="main-content">
      <PageHero eyebrow="Admissions" title="Your Journey Starts Here" text="A simple four-step path from enquiry to enrollment — with guidance at every stage." image="/images/training.jpg">
        <Link to="/apply" className="btn btn-gold">Start Application <ArrowRight size={17} aria-hidden /></Link>
        <Link to="/contact" className="btn btn-outline-light">Talk to Admissions</Link>
      </PageHero>

      <section className="container-x py-16 md:py-20" aria-labelledby="steps">
        <SectionHead eyebrow="How It Works" title="Four Steps to Enrollment" />
        <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none">
          {STEPS.map((s, i) => (
            <Reveal key={s.t} delay={i * 70}>
              <li className="card card-hover p-6 h-full relative">
                <span className="absolute top-5 right-5 font-display font-extrabold text-3xl text-slate-100" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <span className="p-2.5 rounded bg-navy-900 text-gold-400 inline-block" aria-hidden><s.icon size={20} /></span>
                <h3 className="font-display font-bold text-navy-900 mt-4">{s.t}</h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{s.d}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="bg-slate-50 border-y border-slate-200" aria-labelledby="req">
        <div className="container-x py-16 md:py-20 grid lg:grid-cols-2 gap-10">
          <Reveal>
            <p className="eyebrow">Entry Requirements</p>
            <h2 id="req" className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl mt-3">What You Need to Apply</h2>
            <ul className="mt-5 space-y-3 text-[15px] text-slate-700">
              {[
                'Completed application form (online or at the campus)',
                'Copies of academic certificates / result slips',
                'Copy of National ID or Birth Certificate',
                'Passport-size photographs',
                'Any programme-specific requirements listed on the course page',
              ].map((li) => (
                <li key={li} className="flex gap-2.5"><BadgeCheck size={18} className="text-gold-500 shrink-0 mt-0.5" aria-hidden />{li}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-slate-500 leading-relaxed">Requirements vary by programme and examining body (KASNEB, KNEC, KISM, Cisco). Contact admissions on {SITE.phone} for guidance on your qualifications.</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid gap-4">
              <div className="card p-6 flex gap-4">
                <span className="p-2.5 rounded bg-gold-50 text-gold-600 h-fit" aria-hidden><CalendarClock size={20} /></span>
                <div><h3 className="font-display font-bold text-navy-900">Intakes</h3><p className="text-sm text-slate-600 mt-1 leading-relaxed">Intakes run through the year across January, May and September periods depending on the programme and examining body calendar. Confirm current intake dates with admissions.</p></div>
              </div>
              <div className="card p-6 flex gap-4">
                <span className="p-2.5 rounded bg-gold-50 text-gold-600 h-fit" aria-hidden><MonitorSmartphone size={20} /></span>
                <div><h3 className="font-display font-bold text-navy-900">Study Modes</h3><p className="text-sm text-slate-600 mt-1 leading-relaxed">Full-time, part-time, evening and eLearning options are available so working students can study flexibly. Availability varies by programme.</p></div>
              </div>
              <div id="fees" className="card p-6 flex gap-4 scroll-mt-24">
                <span className="p-2.5 rounded bg-gold-50 text-gold-600 h-fit" aria-hidden><HandCoins size={20} /></span>
                <div><h3 className="font-display font-bold text-navy-900">Fees & Payment</h3><p className="text-sm text-slate-600 mt-1 leading-relaxed">Official fee structures are published as downloadable documents. Fees vary by programme and semester — always confirm current fees with the accounts office before payment.</p>
                <Link to="/downloads" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-700 mt-2">Download fee structures <ArrowRight size={15} aria-hidden /></Link></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {docs.length > 0 && (
        <section className="container-x py-16 md:py-20" aria-labelledby="docs">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="eyebrow">Documents</p><h2 id="docs" className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl mt-3">Brochure & Fee Structures</h2></div>
            <Link to="/downloads" className="btn btn-outline btn-sm">All Downloads</Link>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {docs.map((d) => (
              <a key={d.id} href={d.file_url} target="_blank" rel="noreferrer" className="card card-hover p-5 flex gap-3.5 group">
                <span className="p-2.5 rounded bg-red-50 text-red-600 h-fit shrink-0" aria-hidden><Download size={19} /></span>
                <span><span className="block font-semibold text-navy-900 text-sm leading-snug group-hover:text-gold-600">{d.title}</span><span className="block text-xs text-slate-500 mt-1">{d.category}</span></span>
              </a>
            ))}
          </div>
        </section>
      )}

      <CTABand title="Ready When You Are" text="Submit your application online in minutes, or visit Maganjo House, Nyerere Avenue for in-person assistance." primary={['Start Application', '/apply']} secondary={['Contact Us', '/contact']} />
    </main>
  );
}
