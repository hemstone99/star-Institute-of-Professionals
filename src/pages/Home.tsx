import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BadgeCheck, BookOpenCheck, BriefcaseBusiness, CalendarClock, ChevronDown, ChevronLeft, ChevronRight, Clock, GraduationCap, Library, Megaphone, MonitorSmartphone, Quote, Users, X } from 'lucide-react';
import { api } from '../lib/api';
import { SITE } from '../lib/constants';
import { useSEO, useJsonLd } from '../lib/seo';
import Reveal from '../components/Reveal';
import { SectionHead, CardSkeleton, CTABand } from '../components/ui';
import { CourseCard, NewsCard, EventCard, type Course, type NewsItem, type EventItem } from '../components/cards';

type Faq = { id: number; question: string; answer: string };
type T = { id: number; name: string; role: string; quote: string };
type Ann = { id: number; title: string; message: string; link: string };

const SLIDES = [
  { src: '/images/hero.jpg', alt: 'Students learning together in a lecture hall' },
  { src: '/images/campus.jpg', alt: 'Students walking together on campus' },
  { src: '/images/graduation.jpg', alt: 'Graduates celebrating their achievement' },
];

const STRENGTHS = [
  { icon: BookOpenCheck, title: 'Professional Programmes', text: 'Accounting, management, ICT, Cisco, beauty and engineering tracks.' },
  { icon: Users, title: 'Experienced Trainers', text: 'Industry professionals and seasoned educators in every classroom.' },
  { icon: BriefcaseBusiness, title: 'Industry-Relevant Training', text: 'Curricula aligned to the demands of the job market.' },
  { icon: MonitorSmartphone, title: 'Flexible Learning', text: 'Full-time, part-time, evening and eLearning study options.' },
  { icon: GraduationCap, title: 'Career-Focused Education', text: 'Practical skills, exam preparation and career guidance.' },
];

const STEPS = [
  { n: '01', t: 'Choose Your Programme', d: 'Browse verified courses across accounting, management, ICT, Cisco, beauty and engineering.' },
  { n: '02', t: 'Review Requirements', d: 'Check entry requirements, study modes and intake information for your programme.' },
  { n: '03', t: 'Submit Application', d: 'Complete the online application form or visit our Mombasa campus for assistance.' },
  { n: '04', t: 'Receive Admission Information', d: 'Our admissions team will contact you with the next steps toward enrollment.' },
];

const WHY = [
  { icon: Award, t: 'Approved Training Institution', d: 'Managed professionally by experienced lecturers since operations began on 1st July 2013.' },
  { icon: BadgeCheck, t: 'Exam-Focused Preparation', d: 'Structured preparation for KASNEB, KNEC, KISM and Cisco programmes.' },
  { icon: Users, t: 'Personal Attention', d: 'A close-knit learning community where trainers know their students.' },
  { icon: CalendarClock, t: 'Flexible Study Modes', d: 'Full-time, part-time, evening and eLearning options for working students.' },
  { icon: Library, t: 'Library & Resource Centre', d: 'A stocked library and resource centre that makes research easy.' },
  { icon: Clock, t: 'Mombasa City Campus', d: 'Maganjo House on Nyerere Avenue — accessible in the heart of Mombasa.' },
];

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [testimonials, setTestimonials] = useState<T[]>([]);
  const [ann, setAnn] = useState<Ann | null>(null);
  const [showAnn, setShowAnn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [slide, setSlide] = useState(0);

  useSEO({
    title: 'Star Institute of Professionals — Shape Your Skills. Build Your Future.',
    description: 'Star Institute of Professionals in Mombasa offers accounting, management, ICT, Cisco, beauty and engineering programmes with flexible learning and career-focused education.',
    path: '/',
    image: 'https://starinstitute.ac.ke/images/hero.jpg',
  });
  useJsonLd('ld-org', {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Star Institute of Professionals',
    url: 'https://starinstitute.ac.ke',
    slogan: SITE.tagline,
    foundingDate: '2013',
    address: { '@type': 'PostalAddress', streetAddress: 'Maganjo House, Nyerere Avenue', addressLocality: 'Mombasa', postalCode: '80100', addressCountry: 'KE' },
    contactPoint: { '@type': 'ContactPoint', telephone: '+254704978271', contactType: 'admissions', email: SITE.email },
    sameAs: [SITE.facebook, SITE.instagram],
  });

  useEffect(() => {
    let live = true;
    (async () => {
      const results = await Promise.allSettled([
        api('/api/courses'),
        api('/api/news?limit=3'),
        api('/api/events?upcoming=true&limit=3'),
        api('/api/faqs'),
        api('/api/testimonials'),
        api('/api/announcements'),
      ]);
      if (!live) return;
      const value = <T,>(index: number, fallback: T) => {
        const result = results[index];
        return result.status === 'fulfilled' ? result.value : fallback;
      };
      const coursesData = value(0, []);
      const newsData = value(1, []);
      const eventsData = value(2, []);
      const faqsData = value(3, []);
      const testimonialsData = value(4, []);
      const announcementsData = value(5, []);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setNews(Array.isArray(newsData) ? newsData : []);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setFaqs(Array.isArray(faqsData) ? faqsData.slice(0, 6) : []);
      setTestimonials(Array.isArray(testimonialsData) ? testimonialsData.slice(0, 3) : []);
      setAnn(Array.isArray(announcementsData) && announcementsData.length ? announcementsData[0] : null);
      setLoading(false);
    })();
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const homepageCourseSlugs = [
    'certified-public-accountant-cpa',
    'accounting-technicians-diploma-atd',
    'certified-investment-financial-analysts-cifa',
  ];
  const homepageCourses = homepageCourseSlugs
    .map((slug) => courses.find((course) => course.slug === slug))
    .filter((course): course is Course => Boolean(course));

  return (
    <main id="main-content">
      {ann && showAnn && (
        <div className="bg-gold-500 text-white" role="status">
          <div className="container-x flex items-center gap-3 py-2 text-sm">
            <Megaphone size={16} className="shrink-0" aria-hidden />
            <p className="flex-1 truncate font-medium">{ann.title} — {ann.message}</p>
            {ann.link && <Link to={ann.link} className="hidden sm:inline font-bold underline underline-offset-2 shrink-0">Learn more</Link>}
            <button onClick={() => setShowAnn(false)} aria-label="Dismiss announcement" className="p-1 rounded hover:bg-white/20 shrink-0"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative bg-navy-950 text-white overflow-hidden" aria-label="Introduction" aria-roledescription="carousel">
        {SLIDES.map((s, i) => (
          <img key={s.src} src={s.src} alt={s.alt} aria-hidden={i !== slide} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : undefined} className={'absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ' + (i === slide ? 'opacity-30' : 'opacity-0')} />
        ))}
        <div className="absolute inset-0 bg-navy-950/45" aria-hidden />
        <div className="relative container-x py-20 md:py-32 max-w-4xl">
          <p className="eyebrow !text-gold-300">Star Institute of Professionals</p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.08] mt-4">
            Shape Your Skills.<br />Build Your Future.
          </h1>
          <p className="mt-5 text-base md:text-xl text-navy-100 max-w-2xl leading-relaxed">
            Career-focused professional programmes in accounting, management, ICT, Cisco networking, beauty and engineering — in the heart of Mombasa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/courses" className="btn btn-gold">Explore Courses <ArrowRight size={17} aria-hidden /></Link>
            <Link to="/apply" className="btn btn-outline-light">Apply Now</Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <div><dt className="text-navy-200 text-xs uppercase tracking-wide font-semibold">Founded</dt><dd className="font-display font-bold text-lg">2013 · Mombasa</dd></div>
            <div><dt className="text-navy-200 text-xs uppercase tracking-wide font-semibold">Study Modes</dt><dd className="font-display font-bold text-lg">Full-time · Part-time · eLearning</dd></div>
            <div><dt className="text-navy-200 text-xs uppercase tracking-wide font-semibold">Examinations</dt><dd className="font-display font-bold text-lg">KASNEB · KNEC · KISM · Cisco</dd></div>
          </dl>
        </div>
        <div className="absolute bottom-5 right-4 sm:right-8 flex items-center gap-2" role="group" aria-label="Hero slides">
          <button onClick={() => setSlide((slide + SLIDES.length - 1) % SLIDES.length)} className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition-colors" aria-label="Previous slide"><ChevronLeft size={18} /></button>
          {SLIDES.map((s, i) => (
            <button key={s.src} onClick={() => setSlide(i)} aria-label={'Show slide ' + (i + 1)} aria-current={i === slide} className={'h-2 rounded-full transition-all ' + (i === slide ? 'w-7 bg-gold-400' : 'w-2 bg-white/40 hover:bg-white/70')} />
          ))}
          <button onClick={() => setSlide((slide + 1) % SLIDES.length)} className="p-2 rounded-full bg-white/10 hover:bg-white/25 transition-colors" aria-label="Next slide"><ChevronRight size={18} /></button>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-b border-slate-200 bg-white" aria-label="Our strengths">
        <div className="container-x py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STRENGTHS.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <div className="flex lg:flex-col gap-3.5">
                <span className="p-2.5 rounded bg-gold-50 text-gold-600 w-fit shrink-0" aria-hidden><s.icon size={20} /></span>
                <div><h2 className="font-display font-bold text-navy-900 text-[15px]">{s.title}</h2><p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{s.text}</p></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="container-x py-16 md:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center" aria-labelledby="home-about">
        <Reveal>
          <div className="relative">
            <img src="/images/about.jpg" alt="Students reading together at Star Institute" className="rounded-lg w-full aspect-[4/3] object-cover" loading="lazy" />
            <div className="absolute -bottom-5 -right-2 sm:right-6 bg-navy-900 text-white rounded px-5 py-4 shadow-xl">
              <p className="font-display font-extrabold text-2xl text-gold-400">2013</p>
              <p className="text-xs text-navy-100">Serving Mombasa since</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="eyebrow">About Star Institute</p>
          <h2 id="home-about" className="font-display font-extrabold text-navy-900 text-3xl md:text-4xl leading-tight mt-3">Preparing Professionals for a Changing World</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Star Institute of Professionals is an approved training institution in Mombasa, managed professionally by experienced lecturers. Since commencing operations on 1st July 2013, the institute has prepared students for careers in accountancy, management and information technology.
          </p>
          <ul className="mt-5 space-y-2.5 text-[15px] text-slate-700">
            {['Professionalism, Equality, Team Spirit, Excellence and Integrity', 'Theory combined with practical, hands-on skills', 'Guidance from application through to graduation'].map((li) => (
              <li key={li} className="flex gap-2.5"><BadgeCheck size={18} className="text-gold-500 shrink-0 mt-0.5" aria-hidden />{li}</li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/about" className="btn btn-navy">Learn More <ArrowRight size={17} aria-hidden /></Link>
            <Link to="/about#staff" className="btn btn-outline">Meet Our Trainers</Link>
          </div>
        </Reveal>
      </section>

      {/* FEATURED COURSES */}
      <section className="bg-slate-50 border-y border-slate-200" aria-labelledby="home-courses">
        <div className="container-x py-16 md:py-24">
          <SectionHead eyebrow="Our Programmes" title="Explore Our Programmes" text="Verified programmes across seven schools of study. Select any programme for full details on duration, requirements and study modes." />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? [0, 1, 2].map((i) => <CardSkeleton key={i} />) : homepageCourses.map((c) => <CourseCard key={c.id} c={c} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/courses" className="btn btn-navy">View All Courses <ArrowRight size={17} aria-hidden /></Link>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="container-x py-16 md:py-24" aria-labelledby="home-why">
        <SectionHead eyebrow="Why Choose Us" title="Why Students Choose Star Institute" />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY.map((w, i) => (
            <Reveal key={w.t} delay={(i % 3) * 70}>
              <div className="card card-hover p-6 h-full">
                <span className="p-2.5 rounded bg-navy-900 text-gold-400 inline-block" aria-hidden><w.icon size={20} /></span>
                <h3 className="font-display font-bold text-navy-900 mt-4">{w.t}</h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{w.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* JOURNEY */}
      <section className="bg-navy-900 text-white" aria-labelledby="home-journey">
        <div className="container-x py-16 md:py-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow !text-gold-300">Admissions</p>
            <h2 id="home-journey" className="font-display font-extrabold text-3xl md:text-4xl mt-3">Your Path to Enrollment in Four Steps</h2>
          </Reveal>
          <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <li className="border-t-2 border-gold-500 pt-5">
                  <span className="font-display font-extrabold text-gold-400 text-sm tracking-widest">{s.n}</span>
                  <h3 className="font-display font-bold text-lg mt-2">{s.t}</h3>
                  <p className="text-sm text-navy-100 mt-1.5 leading-relaxed">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/apply" className="btn btn-gold">Start Application <ArrowRight size={17} aria-hidden /></Link>
            <Link to="/admissions" className="btn btn-outline-light">Admissions Guide</Link>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="container-x py-16 md:py-24" aria-labelledby="home-fac">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <p className="eyebrow">Campus & Facilities</p>
            <h2 id="home-fac" className="font-display font-extrabold text-navy-900 text-3xl md:text-4xl mt-3">A Learning Environment Built for Focus</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">From computer laboratories to the library and resource centre, training rooms and student support offices — every space at Maganjo House supports serious study.</p>
            <Link to="/facilities" className="btn btn-outline mt-6">Tour Our Facilities <ArrowRight size={17} aria-hidden /></Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {['/images/lab.jpg', '/images/library.jpg', '/images/classroom.jpg', '/images/campus.jpg'].map((src, i) => (
              <Reveal key={src} delay={i * 70}>
                <img src={src} alt="Star Institute campus facility" loading="lazy" className="rounded aspect-[4/3] object-cover w-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS & EVENTS */}
      <section className="bg-slate-50 border-y border-slate-200" aria-labelledby="home-news">
        <div className="container-x py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead align="left" eyebrow="News & Events" title="Latest From the Institute" />
            <div className="flex gap-3">
              <Link to="/news" className="btn btn-outline btn-sm">All News</Link>
              <Link to="/events" className="btn btn-outline btn-sm">All Events</Link>
            </div>
          </div>
          <div className="mt-10 grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {loading ? [0, 1].map((i) => <CardSkeleton key={i} />) : news.slice(0, 2).map((n) => <NewsCard key={n.slug} n={n} />)}
              {!loading && news.length === 0 && <p className="text-sm text-slate-500 col-span-2">News updates will appear here. Please check back soon.</p>}
            </div>
            <div className="lg:col-span-2 space-y-4">
              {loading ? <CardSkeleton lines={2} /> : events.map((e) => <EventCard key={e.slug} e={e} />)}
              {!loading && events.length === 0 && <p className="text-sm text-slate-500">No upcoming events are listed at the moment.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-x py-16 md:py-24" aria-labelledby="home-test">
        <SectionHead eyebrow="Student Voices" title="What Our Students Say" />
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {loading ? [0, 1, 2].map((i) => <CardSkeleton key={i} lines={2} />) : testimonials.map((t) => (
            <Reveal key={t.id}>
              <figure className="card p-6 h-full flex flex-col">
                <Quote size={26} className="text-gold-400" aria-hidden />
                <blockquote className="mt-3 text-[15px] text-slate-700 leading-relaxed flex-1">“{t.quote}”</blockquote>
                <figcaption className="mt-4 pt-4 border-t border-slate-100">
                  <p className="font-bold text-navy-900 text-sm">{t.name}</p>
                  {t.role && <p className="text-xs text-slate-500">{t.role}</p>}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 border-y border-slate-200" aria-labelledby="home-faq">
        <div className="container-x py-16 md:py-24 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <SectionHead align="left" eyebrow="FAQs" title="Frequently Asked Questions" text="Answers about courses, applications, requirements, intakes, fees and study modes." />
            <Link to="/faq" className="btn btn-navy mt-6">View All FAQs <ArrowRight size={17} aria-hidden /></Link>
          </div>
          <div className="lg:col-span-3 space-y-3">
            {faqs.map((f, i) => (
              <div key={f.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy-900 text-[15px]"
                >
                  {f.question}
                  <ChevronDown size={18} aria-hidden className={'shrink-0 transition-transform ' + (openFaq === i ? 'rotate-180' : '')} />
                </button>
                {openFaq === i && <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{f.answer}</p>}
              </div>
            ))}
            {!loading && faqs.length === 0 && <p className="text-sm text-slate-500">FAQs are being updated. Please contact us directly.</p>}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-x py-16 md:py-24" aria-label="Final call to action">
        <Reveal className="grid lg:grid-cols-2 gap-0 rounded-lg overflow-hidden border border-slate-200">
          <img src="/images/graduation.jpg" alt="Graduates celebrating their achievement" loading="lazy" className="w-full h-64 lg:h-full object-cover" />
          <div className="bg-navy-900 text-white p-8 md:p-12 flex flex-col justify-center">
            <h2 className="font-display font-extrabold text-2xl md:text-3xl leading-tight">Ready to Invest in Your Future?</h2>
            <p className="mt-3 text-navy-100 leading-relaxed">Join a community of professionals trained in Mombasa since 2013. Applications are received throughout the year — our admissions team will guide you.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/apply" className="btn btn-gold">Apply Now <ArrowRight size={17} aria-hidden /></Link>
              <Link to="/contact" className="btn btn-outline-light">Talk to Admissions</Link>
            </div>
            <p className="mt-5 text-sm text-navy-200">Or call us directly: <a href={SITE.phoneHref} className="font-bold text-white hover:text-gold-300">{SITE.phone}</a></p>
          </div>
        </Reveal>
      </section>

      <CTABand title="Download the Institute Prospectus & Fee Structures" text="Official fee structures for Accounts & Finance, Management and Beauty programmes, plus the institute brochure." primary={['Browse Downloads', '/downloads']} secondary={['View Fees Guide', '/admissions#fees']} />
    </main>
  );
}
