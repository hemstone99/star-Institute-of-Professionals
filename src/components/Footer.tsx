import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Clock, GraduationCap } from 'lucide-react';
import { SITE } from '../lib/constants';

const BODIES = [
  { src: '/images/bodies/knec.png', alt: 'Kenya National Examinations Council (KNEC)' },
  { src: '/images/bodies/kasneb.png', alt: 'Kenya Accountants and Secretaries National Examinations Board (KASNEB)' },
  { src: '/images/bodies/tvet.png', alt: 'Technical and Vocational Education and Training Authority (TVETA)' },
  { src: '/images/bodies/cisco.png', alt: 'Cisco Networking Academy' },
];

export default function Footer() {
  return (
    <>
    <section className="bg-white border-t border-slate-200 overflow-hidden" aria-label="Examination and accreditation bodies">
      <div className="container-x pt-8 pb-2 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Examinations & Professional Bodies</p>
      </div>
      <div className="marquee pb-8" aria-hidden={false}>
        <div className="marquee-track">
          {[...BODIES, ...BODIES].map((b, i) => (
            <div key={i} className="marquee-item">
              <img src={b.src} alt={i < BODIES.length ? b.alt : ''} aria-hidden={i >= BODIES.length} loading="lazy" className="h-14 md:h-16 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
    <footer className="bg-navy-950 text-slate-300">
      <div className="container-x py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src="/images/logo.png" alt="Star Institute of Professionals" className="h-11 w-auto bg-white rounded px-2 py-1" />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            An approved training institution in Mombasa, managed professionally by experienced lecturers. Founded in 2013 — {SITE.tagline}.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a href={SITE.facebook} target="_blank" rel="noreferrer" aria-label="Star Institute on Facebook" className="p-2.5 rounded bg-white/10 hover:bg-gold-500 hover:text-white transition-colors">
              <Facebook size={17} />
            </a>
            <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Star Institute on Instagram" className="p-2.5 rounded bg-white/10 hover:bg-gold-500 hover:text-white transition-colors">
              <Instagram size={17} />
            </a>
            <a href={SITE.elearning} target="_blank" rel="noreferrer" aria-label="eLearning Portal" className="p-2.5 rounded bg-white/10 hover:bg-gold-500 hover:text-white transition-colors">
              <GraduationCap size={17} />
            </a>
          </div>
        </div>
        <nav aria-label="Footer quick links">
          <h3 className="font-display font-bold text-white text-sm tracking-wide uppercase">Quick Links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[['About Us', '/about'], ['Courses', '/courses'], ['Admissions', '/admissions'], ['Apply Now', '/apply'], ['Student Life', '/student-life'], ['News & Events', '/news'], ['Facilities', '/facilities'], ['FAQs', '/faq'], ['Downloads', '/downloads']].map(([l, h]) => (
              <li key={h + l}><Link to={h} className="hover:text-gold-300 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer programmes">
          <h3 className="font-display font-bold text-white text-sm tracking-wide uppercase">Programmes</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {['Accounting & Finance', 'Management', 'ICT & Computing', 'Cisco Network Academy', 'Beauty & Cosmetology', 'Engineering', 'Consultancy & Training'].map((c) => (
              <li key={c}><Link to={'/courses?category=' + encodeURIComponent(c)} className="hover:text-gold-300 transition-colors">{c}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h3 className="font-display font-bold text-white text-sm tracking-wide uppercase">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5"><MapPin size={16} className="shrink-0 mt-0.5 text-gold-400" aria-hidden /><span>{SITE.address}<br />{SITE.postal}</span></li>
            <li><a href={SITE.phoneHref} className="flex gap-2.5 hover:text-gold-300"><Phone size={16} className="shrink-0 mt-0.5 text-gold-400" aria-hidden />{SITE.phone}</a></li>
            <li><a href={'mailto:' + SITE.email} className="flex gap-2.5 hover:text-gold-300 break-all"><Mail size={16} className="shrink-0 mt-0.5 text-gold-400" aria-hidden />{SITE.email}</a></li>
            <li className="flex gap-2.5"><Clock size={16} className="shrink-0 mt-0.5 text-gold-400" aria-hidden /><span>{SITE.hours}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 Star Institute of Professionals. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-gold-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold-300">Terms of Use</Link>
            <Link to="/accessibility" className="hover:text-gold-300">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
