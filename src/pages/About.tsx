import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, GraduationCap, HeartHandshake, Scale, Star, Target, Users } from 'lucide-react';
import { api } from '../lib/api';
import { SITE } from '../lib/constants';
import { useSEO } from '../lib/seo';
import Reveal from '../components/Reveal';
import { PageHero, SectionHead, CardSkeleton, CTABand } from '../components/ui';

type Staff = { id: number; name: string; title: string; qualifications: string; subjects: string; experience: string; photo: string };

const VALUES = [
  { icon: Star, t: 'Professionalism', d: 'We model professional conduct in teaching, service and character.' },
  { icon: Scale, t: 'Equality', d: 'Every student receives fair treatment and equal opportunity to succeed.' },
  { icon: Users, t: 'Team Spirit', d: 'Staff and students work together as one close-knit community.' },
  { icon: Target, t: 'Excellence', d: 'We pursue high standards in training, assessment and results.' },
  { icon: HeartHandshake, t: 'Integrity', d: 'Honest, dedicated service in all we do — in and beyond the classroom.' },
];

export default function About() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffError, setStaffError] = useState('');

  useSEO({
    title: 'About Us',
    description: 'Star Institute of Professionals is an approved training institution in Mombasa, founded in 2013. Read our vision, mission, core values and meet our experienced trainers.',
    path: '/about',
  });

  useEffect(() => {
    api('/api/staff')
      .then((d) => Array.isArray(d) && setStaff(d))
      .catch((e: Error) => setStaffError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main id="main-content">
      <PageHero eyebrow="About Star Institute" title="Inspired by Excellence … Driven by Professionalism" text="A leading college in the heart of Mombasa, shaping skilled professionals since 2013." image="/images/campus.jpg" />

      <section className="container-x py-16 md:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center" aria-labelledby="story">
        <Reveal>
          <img src="/images/about.jpg" alt="Students studying together at Star Institute" className="rounded-lg w-full aspect-[4/3] object-cover" loading="lazy" />
        </Reveal>
        <Reveal delay={100}>
          <p className="eyebrow">Our Story</p>
          <h2 id="story" className="font-display font-extrabold text-navy-900 text-3xl mt-3">A Mombasa Institution Since 2013</h2>
          <div className="mt-4 space-y-4 text-slate-600 leading-relaxed">
            <p>Star Institute is an approved training institution managed professionally by experienced lecturers. It was founded in the year 2013 and commenced operations on 1st July 2013.</p>
            <p>Nestled in the heart of Mombasa at Maganjo House, Nyerere Avenue, the institute offers programmes in Accounting & Finance, Management, ICT, Supply Chain Management, Beauty & Cosmetology and technical courses — combining theoretical knowledge with practical skills.</p>
            <p>With industry-expert faculty and a conducive learning environment, Star Institute prepares graduates to serve competently and honestly in government and private entities.</p>
          </div>
        </Reveal>
      </section>

      <section className="bg-slate-50 border-y border-slate-200" aria-label="Vision and mission">
        <div className="container-x py-16 md:py-20 grid md:grid-cols-2 gap-6">
          <Reveal>
            <div className="card p-8 h-full">
              <span className="p-3 rounded bg-navy-900 text-gold-400 inline-block" aria-hidden><Eye size={22} /></span>
              <h2 className="font-display font-extrabold text-navy-900 text-2xl mt-4">Our Vision</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">We envision our graduates in accountancy, management and information technology as leaders and active agents in nation building by competent and by honest dedicated service in Government and private entities, contributing to the improvement of the quality of life, and responsive to the demands of the county, country and global business.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="card p-8 h-full">
              <span className="p-3 rounded bg-gold-500 text-white inline-block" aria-hidden><Target size={22} /></span>
              <h2 className="font-display font-extrabold text-navy-900 text-2xl mt-4">Our Mission</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">Our mission is to deliver professional and educational excellence, thereby enabling you, our student, achieve your career desires, fulfill your potential and succeed at the highest possible level in accountancy, management and information technology.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-16 md:py-20" aria-labelledby="values">
        <SectionHead eyebrow="What We Stand For" title="Our Core Values" />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 60}>
              <div className="card card-hover p-6 text-center h-full">
                <span className="p-2.5 rounded-full bg-gold-50 text-gold-600 inline-block" aria-hidden><v.icon size={20} /></span>
                <h3 className="font-display font-bold text-navy-900 mt-3">{v.t}</h3>
                <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">{v.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="staff" className="bg-navy-900 text-white scroll-mt-20" aria-labelledby="staff-h">
        <div className="container-x py-16 md:py-20">
          <Reveal className="max-w-2xl">
            <p className="eyebrow !text-gold-300">Faculty</p>
            <h2 id="staff-h" className="font-display font-extrabold text-3xl mt-3">Meet Our Trainers</h2>
            <p className="mt-3 text-navy-100 leading-relaxed">A dedicated faculty of industry professionals and seasoned educators who bring real-world insight into every classroom.</p>
          </Reveal>
          {loading ? (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{[0, 1, 2].map((i) => <CardSkeleton key={i} lines={2} />)}</div>
          ) : staffError ? (
            <div className="mt-8 text-navy-100">
              <p>{staffError}</p>
              <button onClick={() => window.location.reload()} className="btn btn-outline-light btn-sm mt-4">Try Again</button>
            </div>
          ) : staff.length === 0 ? (
            <p className="mt-8 text-navy-100">Staff profiles are being updated. Visit us at {SITE.address} to meet the team.</p>
          ) : (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {staff.map((s) => (
                <article key={s.id} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-gold-500/60 transition-colors">
                  {s.photo ? (
                    <img src={s.photo} alt={'Portrait of ' + s.name} loading="lazy" className="w-24 h-24 rounded-full object-cover object-top border-2 border-gold-500/70 bg-white" />
                  ) : (
                    <span className="p-2.5 rounded-full bg-gold-500/15 text-gold-300 inline-block" aria-hidden><GraduationCap size={20} /></span>
                  )}
                  <h3 className="font-display font-bold text-lg mt-3">{s.name}</h3>
                  {s.title && <p className="text-sm text-gold-300 font-semibold">{s.title}</p>}
                  {s.qualifications && <p className="text-[13px] text-navy-100 mt-2 leading-relaxed"><strong className="text-white">Qualifications:</strong> {s.qualifications}</p>}
                  {s.subjects && <p className="text-[13px] text-navy-100 mt-1 leading-relaxed"><strong className="text-white">Subjects:</strong> {s.subjects}</p>}
                  {s.experience && <p className="text-xs text-navy-200 mt-2 font-semibold">{s.experience} experience</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container-x py-14 text-center" aria-label="Accreditation note">
        <Reveal>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Star Institute of Professionals prepares students for examinations and certifications including KASNEB, KNEC, KISM and Cisco Networking Academy programmes. For current accreditation details, please contact the admissions office.
          </p>
          <Link to="/contact" className="btn btn-outline mt-5">Contact Admissions <ArrowRight size={16} aria-hidden /></Link>
        </Reveal>
      </section>

      <CTABand title="Study With Experienced Professionals" text="Choose from verified programmes across accounting, management, ICT, Cisco, beauty and engineering." primary={['Explore Courses', '/courses']} secondary={['Apply Now', '/apply']} />
    </main>
  );
}
