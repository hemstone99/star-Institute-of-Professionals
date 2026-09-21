import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Mail, Menu, Phone, Search, X, GraduationCap } from 'lucide-react';
import { NAV, SITE } from '../lib/constants';
import SearchModal from './SearchModal';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setOpenSub(null);
  }, [loc.pathname, loc.search]);

  useEffect(() => {
    document.body.style.overflow = drawer || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer, searchOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="bg-navy-900 text-white text-xs hidden md:block">
        <div className="container-x flex items-center justify-between py-1.5">
          <p className="text-navy-100 truncate">{SITE.tagline}</p>
          <div className="flex items-center gap-5 shrink-0">
            <a href={SITE.phoneHref} className="inline-flex items-center gap-1.5 hover:text-gold-300 transition-colors">
              <Phone size={12} aria-hidden /> {SITE.phone}
            </a>
            <a href={'mailto:' + SITE.email} className="inline-flex items-center gap-1.5 hover:text-gold-300 transition-colors">
              <Mail size={12} aria-hidden /> {SITE.email}
            </a>
            <a href={SITE.elearning} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-gold-300 hover:text-gold-200 transition-colors">
              <GraduationCap size={13} aria-hidden /> eLearning Portal
            </a>
          </div>
        </div>
      </div>

      <header className={'sticky top-0 z-50 bg-white/95 backdrop-blur border-b transition-all ' + (scrolled ? 'border-slate-200 shadow-[0_4px_20px_-8px_rgba(16,42,67,0.15)]' : 'border-transparent')}>
        <div className={'container-x flex items-center justify-between gap-4 transition-all ' + (scrolled ? 'py-2.5' : 'py-4')}>
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Star Institute of Professionals — Home">
            <img src="/images/logo.png" alt="Star Institute of Professionals logo" className={'w-auto transition-all ' + (scrolled ? 'h-9' : 'h-12')} />
          </Link>
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="relative group">
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      'inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded transition-colors ' +
                      (isActive ? 'text-gold-600' : 'text-navy-900 hover:text-gold-600')
                    }
                  >
                    {item.label} <ChevronDown size={14} aria-hidden />
                  </NavLink>
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-150 min-w-56">
                    <div className="bg-white border border-slate-200 rounded-md shadow-lg py-1.5">
                      {item.children.map((c) => (
                        <Link key={c.href + c.label} to={c.href} className="block px-4 py-2 text-sm text-slate-700 hover:bg-gold-50 hover:text-navy-900">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    'px-3 py-2 text-sm font-semibold rounded transition-colors ' +
                    (isActive ? 'text-gold-600' : 'text-navy-900 hover:text-gold-600')
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setSearchOpen(true)} className="p-2.5 rounded text-navy-900 hover:bg-slate-100 transition-colors" aria-label="Search (Ctrl+K)">
              <Search size={19} />
            </button>
            <Link to="/apply" className="btn btn-gold btn-sm hidden sm:inline-flex">Apply Now</Link>
            <button onClick={() => setDrawer(true)} className="lg:hidden p-2.5 rounded text-navy-900 hover:bg-slate-100 transition-colors" aria-label="Open menu" aria-expanded={drawer}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-navy-950/60" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <img src="/images/logo.png" alt="Star Institute of Professionals" className="h-9 w-auto" />
              <button onClick={() => setDrawer(false)} className="p-2 rounded text-navy-900 hover:bg-slate-100" aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Mobile">
              {NAV.map((item) =>
                item.children ? (
                  <div key={item.label} className="border-b border-slate-100">
                    <button
                      onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                      className="w-full flex items-center justify-between px-3 py-3.5 text-[15px] font-semibold text-navy-900"
                      aria-expanded={openSub === item.label}
                    >
                      {item.label}
                      <ChevronDown size={18} className={'transition-transform ' + (openSub === item.label ? 'rotate-180' : '')} aria-hidden />
                    </button>
                    {openSub === item.label && (
                      <div className="pb-2">
                        <Link to={item.href} className="block px-6 py-2.5 text-sm font-semibold text-gold-600">All {item.label}</Link>
                        {item.children.map((c) => (
                          <Link key={c.href + c.label} to={c.href} className="block px-6 py-2.5 text-sm text-slate-600">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      'block px-3 py-3.5 text-[15px] font-semibold border-b border-slate-100 ' +
                      (isActive ? 'text-gold-600' : 'text-navy-900')
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              )}
            </nav>
            <div className="p-5 border-t border-slate-200 space-y-3 bg-slate-50">
              <Link to="/apply" className="btn btn-gold w-full">Apply Now</Link>
              <a href={SITE.elearning} target="_blank" rel="noreferrer" className="btn btn-outline w-full">eLearning Portal</a>
            </div>
          </div>
        </div>
      )}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
