import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookMarked, FlaskConical, MonitorSmartphone, Presentation, Users } from 'lucide-react';
import { api } from '../lib/api';
import { useSEO } from '../lib/seo';
import Reveal from '../components/Reveal';
import { PageHero, SectionHead, CTABand, CardSkeleton } from '../components/ui';

type G = { id: number; title: string; image: string; category: string; caption: string };

const SPACES = [
  { icon: Presentation, img: '/images/classroom.jpg', t: 'Modern Classrooms', d: 'Conducive lecture rooms designed for focused learning and trainer–student interaction.' },
  { icon: MonitorSmartphone, img: '/images/lab.jpg', t: 'Computer Laboratories', d: 'Hands-on ICT training with equipment for software, networking and design practice.' },
  { icon: BookMarked, img: '/images/library.jpg', t: 'Library & Resource Centre', d: 'A stocked library and resource centre that makes research easy for every student.' },
  { icon: FlaskConical, img: '/images/engineering.jpg', t: 'Practical Training Spaces', d: 'Hands-on areas for technical, beauty and professional skills training.' },
  { icon: Users, img: '/images/training.jpg', t: 'Student & Admin Support', d: 'Student affairs guidance, accounts support and administrative services under one roof.' },
  { icon: BookMarked, img: '/images/campus.jpg', t: 'Study & Community Areas', d: 'Spaces to revise, collaborate and connect with fellow students between classes.' },
];

export default function Facilities() {
  const [gallery, setGallery] = useState<G[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({ title: 'Campus & Facilities', description: 'Tour the Star Institute of Professionals campus at Maganjo House, Mombasa: classrooms, computer labs, library, training spaces and student support.', path: '/facilities' });

  useEffect(() => {
    api('/api/gallery').then((d) => Array.isArray(d) && setGallery(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <main id="main-content">
      <PageHero eyebrow="Campus" title="Facilities That Support Serious Study" text="Maganjo House, 3rd & 4th Floors, Nyerere Avenue — a city campus built for focus, practice and community." image="/images/lab.jpg" />
      <section className="container-x py-16 md:py-20" aria-labelledby="spaces">
        <SectionHead eyebrow="Our Spaces" title="Designed for Learning" />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPACES.map((s, i) => (
            <Reveal key={s.t} delay={(i % 3) * 70}>
              <article className="card card-hover overflow-hidden h-full">
                <img src={s.img} alt={s.t} loading="lazy" className="h-48 w-full object-cover" />
                <div className="p-5">
                  <span className="p-2 rounded bg-gold-50 text-gold-600 inline-block" aria-hidden><s.icon size={18} /></span>
                  <h3 id={i === 0 ? 'spaces' : undefined} className="font-display font-bold text-navy-900 mt-3">{s.t}</h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{s.d}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="bg-slate-50 border-y border-slate-200" aria-label="Photo gallery">
        <div className="container-x py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="eyebrow">Gallery</p><h2 className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl mt-3">Campus in Pictures</h2></div>
            <Link to="/gallery" className="btn btn-outline btn-sm">Full Gallery <ArrowRight size={15} aria-hidden /></Link>
          </div>
          {loading ? (
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton aspect-[4/3]" />)}</div>
          ) : gallery.length === 0 ? (
            <p className="mt-8 text-sm text-slate-500">Campus photos are being added. Visit us in person for a tour.</p>
          ) : (
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {gallery.slice(0, 4).map((g) => (
                <figure key={g.id} className="rounded overflow-hidden bg-white border border-slate-200">
                  <img src={g.image} alt={g.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <figcaption className="px-3 py-2 text-xs font-semibold text-navy-900">{g.title}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
      <div className="pt-16 md:pt-20">
        <CTABand title="Come and See for Yourself" text="Visit Maganjo House on Nyerere Avenue, Mombasa — or start your application online today." primary={['Apply Now', '/apply']} secondary={['Contact Us', '/contact']} />
      </div>
    </main>
  );
}
