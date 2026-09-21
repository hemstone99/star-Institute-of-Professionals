import { Link } from 'react-router-dom';
import { ArrowRight, Inbox } from 'lucide-react';
import Reveal from './Reveal';

export function PageHero({ eyebrow, title, text, image, children }: { eyebrow: string; title: string; text?: string; image?: string; children?: React.ReactNode }) {
  return (
    <section className="relative bg-navy-900 text-white overflow-hidden">
      {image && <img src={image} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-20" loading="eager" />}
      <div className="absolute inset-0 bg-navy-950/40" aria-hidden />
      <div className="relative container-x py-14 md:py-20 max-w-4xl">
        <p className="eyebrow !text-gold-300">{eyebrow}</p>
        <h1 className="font-display font-extrabold text-3xl md:text-5xl leading-tight mt-3">{title}</h1>
        {text && <p className="mt-4 text-base md:text-lg text-navy-100 max-w-2xl leading-relaxed">{text}</p>}
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, align = 'center' }: { eyebrow: string; title: string; text?: string; align?: 'center' | 'left' }) {
  const c = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <Reveal className={'max-w-2xl ' + c}>
      <p className={'eyebrow ' + (align === 'center' ? 'justify-center' : '')}>{eyebrow}</p>
      <h2 className="font-display font-extrabold text-navy-900 text-2xl md:text-[2rem] leading-tight mt-3">{title}</h2>
      {text && <p className="mt-3 text-slate-600 leading-relaxed">{text}</p>}
    </Reveal>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="card p-10 text-center">
      <Inbox size={36} className="mx-auto text-slate-300" aria-hidden />
      <h3 className="font-display font-bold text-navy-900 text-lg mt-4">{title}</h3>
      {text && <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ text, onRetry }: { text?: string; onRetry?: () => void }) {
  return (
    <div className="card p-10 text-center border-red-200 bg-red-50/50">
      <h3 className="font-display font-bold text-navy-900 text-lg">Something went wrong</h3>
      <p className="text-sm text-slate-500 mt-1">{text || 'We could not load this content. Please check your connection and try again.'}</p>
      {onRetry && <button onClick={onRetry} className="btn btn-outline btn-sm mt-5">Try Again</button>}
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card p-5" aria-hidden>
      <div className="skeleton h-36 w-full" />
      <div className="skeleton h-5 w-3/4 mt-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3.5 w-full mt-2" />
      ))}
    </div>
  );
}

export function CTABand({ title, text, primary, secondary }: { title: string; text?: string; primary: [string, string]; secondary?: [string, string] }) {
  const [pl, ph] = primary;
  return (
    <section className="container-x pb-16 md:pb-24" aria-label="Call to action">
      <Reveal className="relative overflow-hidden rounded-lg bg-navy-900 text-white px-6 py-12 md:p-14 text-center">
        <img src="/images/graduation.jpg" alt="" aria-hidden loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-display font-extrabold text-2xl md:text-4xl leading-tight">{title}</h2>
          {text && <p className="mt-3 text-navy-100 leading-relaxed">{text}</p>}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to={ph} className="btn btn-gold">{pl} <ArrowRight size={17} aria-hidden /></Link>
            {secondary && <Link to={secondary[1]} className="btn btn-outline-light">{secondary[0]}</Link>}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
