import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, Church, Drama, HeartHandshake, Medal, Mountain, Palette, Users } from 'lucide-react';
import { useSEO } from '../lib/seo';
import Reveal from '../components/Reveal';
import { PageHero, SectionHead, CTABand } from '../components/ui';

const CLUBS = [
  { icon: Drama, t: 'Creative Talents Clubs', d: 'Music, drama and creative expression — including dancing and stage performances.' },
  { icon: Medal, t: 'Sports', d: 'Indoor games and outdoor games that build teamwork, fitness and discipline.' },
  { icon: Church, t: 'Religious Societies', d: 'Christian Union (CU), Muslim Union, Young Christian Students (YCS), SDA and Hindu Society.' },
  { icon: Mountain, t: 'Adventurers Club', d: 'Deep-sea activities, environmental activities and hiking around the Coast region.' },
];

const SUPPORT = [
  { icon: BookOpenCheck, t: 'Academic Advising', d: 'Guidance on programme choices, study planning and examination preparation.' },
  { icon: BriefcaseBusiness, t: 'Career Counselling', d: 'Support for internships, job readiness and professional growth.' },
  { icon: HeartHandshake, t: 'Personal Development', d: 'Workshops, seminars and guest lectures that complement the curriculum.' },
  { icon: Users, t: 'Community & Belonging', d: 'Clubs, societies and events that build leadership and lasting friendships.' },
];

export default function StudentLife() {
  useSEO({
    title: 'Student Life & Student Affairs',
    description: 'Student affairs at Star Institute of Professionals: academic advising, career counselling, clubs and societies, sports, religious groups and the Adventurers Club.',
    path: '/student-life',
  });
  return (
    <main id="main-content">
      <PageHero eyebrow="Student Affairs" title="Life at Star Institute" text="A vibrant, supportive campus community — academic guidance, personal growth and friendships that last." image="/images/campus.jpg">
        <Link to="/apply" className="btn btn-gold">Join Us <ArrowRight size={17} aria-hidden /></Link>
      </PageHero>

      <section className="container-x py-16 md:py-20" aria-labelledby="support">
        <SectionHead eyebrow="Student Affairs" title="Support for the Whole Student" text="From the moment you arrive on campus, the Student Affairs team helps you navigate the challenges and opportunities of your academic journey." />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SUPPORT.map((s, i) => (
            <Reveal key={s.t} delay={i * 60}>
              <div className="card card-hover p-6 h-full">
                <span className="p-2.5 rounded bg-navy-900 text-gold-400 inline-block" aria-hidden><s.icon size={20} /></span>
                <h3 className="font-display font-bold text-navy-900 mt-4">{s.t}</h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200" aria-labelledby="clubs">
        <div className="container-x py-16 md:py-20">
          <SectionHead eyebrow="Societies & Clubs" title="Find Your Community" text="Extracurricular activities that shape well-rounded individuals — leadership, teamwork and personal growth beyond the classroom." />
          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {CLUBS.map((c, i) => (
              <Reveal key={c.t} delay={i * 60}>
                <div className="card card-hover p-6 md:p-7 flex gap-5 h-full">
                  <span className="p-3 rounded bg-gold-50 text-gold-600 h-fit shrink-0" aria-hidden><c.icon size={22} /></span>
                  <div><h3 className="font-display font-bold text-navy-900 text-lg">{c.t}</h3><p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{c.d}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 card p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="p-3 rounded bg-navy-900 text-gold-400 h-fit w-fit shrink-0" aria-hidden><Palette size={22} /></span>
            <div className="flex-1">
              <h3 className="font-display font-bold text-navy-900">Workshops, Seminars & Guest Lectures</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">Student Affairs organises workshops, seminars and guest lectures that provide valuable insights and networking opportunities within your chosen field.</p>
            </div>
            <Link to="/events" className="btn btn-outline btn-sm shrink-0">View Events</Link>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-16 md:py-20 grid lg:grid-cols-2 gap-10 items-center" aria-label="Campus gallery preview">
        <Reveal>
          <p className="eyebrow">Campus Moments</p>
          <h2 className="font-display font-extrabold text-navy-900 text-3xl mt-3">Inside & Outside the Classroom</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">Meaningful experiences, lasting connections and a true sense of belonging — that is the Star Institute way. Browse the gallery and picture yourself here.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/gallery" className="btn btn-navy">View Gallery <ArrowRight size={17} aria-hidden /></Link>
            <Link to="/graduation" className="btn btn-outline">Graduation Request</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4">
          {['/images/campus.jpg', '/images/training.jpg', '/images/graduation.jpg', '/images/lab.jpg'].map((src, i) => (
            <Reveal key={src} delay={i * 70}><img src={src} alt="Student life at Star Institute" loading="lazy" className="rounded aspect-[4/3] object-cover w-full" /></Reveal>
          ))}
        </div>
      </section>

      <CTABand title="Begin Your Journey With Us" text="Applications are received throughout the year. Our admissions team will guide you from enquiry to enrollment." primary={['Apply Now', '/apply']} secondary={['Explore Courses', '/courses']} />
    </main>
  );
}
