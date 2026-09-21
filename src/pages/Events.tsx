import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useSEO } from '../lib/seo';
import { PageHero, EmptyState, ErrorState, CardSkeleton } from '../components/ui';
import { EventCard, type EventItem } from '../components/cards';

export default function Events() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSEO({ title: 'Events', description: 'Upcoming and past events at Star Institute of Professionals — open days, graduations, workshops and seminars.', path: '/events' });

  const fetchAll = async () => {
    setLoading(true); setError('');
    try {
      const d = await api('/api/events');
      setItems(Array.isArray(d) ? d : []);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const now = new Date();
  const upcoming = items.filter((e) => !e.event_date || new Date(e.event_date) >= now);
  const past = items.filter((e) => e.event_date && new Date(e.event_date) < now).reverse();

  return (
    <main id="main-content">
      <PageHero eyebrow="Campus Life" title="Events" text="Open days, graduations, workshops and seminars at our Mombasa campus." image="/images/graduation.jpg" />
      <section className="container-x py-12 md:py-16" aria-label="Events list">
        {loading && <div className="grid md:grid-cols-2 gap-5">{[0, 1, 2].map((i) => <CardSkeleton key={i} lines={2} />)}</div>}
        {error && <ErrorState text={error} onRetry={fetchAll} />}
        {!loading && !error && items.length === 0 && <EmptyState title="No events listed" text="Upcoming events will appear here. Contact us to ask about open days and graduations." />}
        {!loading && !error && upcoming.length > 0 && (
          <><h2 className="font-display font-extrabold text-navy-900 text-xl">Upcoming Events</h2>
          <div className="mt-5 grid md:grid-cols-2 gap-5">{upcoming.map((e) => <EventCard key={e.slug} e={e} />)}</div></>
        )}
        {!loading && !error && past.length > 0 && (
          <><h2 className="font-display font-extrabold text-navy-900 text-xl mt-12">Past Events</h2>
          <div className="mt-5 grid md:grid-cols-2 gap-5 opacity-80">{past.map((e) => <EventCard key={e.slug} e={e} />)}</div></>
        )}
      </section>
    </main>
  );
}
