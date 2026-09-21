import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { useSEO } from '../lib/seo';

export default function NotFound() {
  useSEO({ title: 'Page Not Found (404)', description: 'The page you requested could not be found on the Star Institute of Professionals website.' });
  return (
    <main id="main-content" className="container-x py-20 md:py-28 text-center max-w-xl">
      <p className="font-display font-extrabold text-7xl md:text-8xl text-navy-900">404</p>
      <p className="eyebrow justify-center mt-4">Page Not Found</p>
      <h1 className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl mt-3">This page has moved or no longer exists</h1>
      <p className="mt-3 text-slate-600 leading-relaxed">The link may be outdated, or the address typed incorrectly. Try searching, or return to the homepage.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn btn-navy"><Home size={17} aria-hidden /> Back to Home</Link>
        <Link to="/courses" className="btn btn-outline"><Search size={17} aria-hidden /> Browse Courses</Link>
      </div>
    </main>
  );
}
