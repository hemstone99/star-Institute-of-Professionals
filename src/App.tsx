import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Admissions = lazy(() => import('./pages/Admissions'));
const Apply = lazy(() => import('./pages/Apply'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const StudentLife = lazy(() => import('./pages/StudentLife'));
const Facilities = lazy(() => import('./pages/Facilities'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Faq = lazy(() => import('./pages/Faq'));
const Contact = lazy(() => import('./pages/Contact'));
const Downloads = lazy(() => import('./pages/Downloads'));
const Graduation = lazy(() => import('./pages/Graduation'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ResourceManager = lazy(() => import('./pages/admin/ResourceManager'));
const Settings = lazy(() => import('./pages/admin/Settings'));
import { Applications, Messages, GraduationRequests } from './pages/admin/Inbox';
import { Privacy, Terms, Accessibility } from './pages/Legal';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Loader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-label="Loading page">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto rounded-full border-[3px] border-slate-200 border-t-gold-500 animate-spin" aria-hidden />
        <p className="mt-3 text-sm text-slate-500">Loading…</p>
      </div>
    </div>
  );
}

function PublicShell({ children }: { children: React.ReactNode }) {
  return (<><Header />{children}<Footer /></>);
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/admin/login" element={<PublicShell><AdminLogin /></PublicShell>} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="applications" element={<Applications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="graduation" element={<GraduationRequests />} />
            <Route path="settings" element={<Settings />} />
            <Route path=":resource" element={<ResourceManager />} />
          </Route>
          {[
            ['/', Home], ['/about', About], ['/courses', Courses], ['/courses/:slug', CourseDetail],
            ['/admissions', Admissions], ['/apply', Apply], ['/news', News], ['/news/:slug', NewsDetail],
            ['/events', Events], ['/events/:slug', EventDetail], ['/student-life', StudentLife],
            ['/facilities', Facilities], ['/gallery', Gallery], ['/faq', Faq], ['/contact', Contact],
            ['/downloads', Downloads], ['/graduation', Graduation], ['/privacy', Privacy],
            ['/terms', Terms], ['/accessibility', Accessibility],
          ].map(([p, C]: any) => (
            <Route key={p} path={p} element={<PublicShell><C /></PublicShell>} />
          ))}
          <Route path="*" element={<PublicShell><NotFound /></PublicShell>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
