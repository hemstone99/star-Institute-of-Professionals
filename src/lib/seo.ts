import { useEffect } from 'react';

const BASE = 'https://starinstitute.ac.ke';

export function useSEO(opts: { title: string; description: string; path?: string; image?: string }) {
  const { title, description, path, image } = opts;
  useEffect(() => {
    const full = title.includes('Star Institute') ? title : title + ' | Star Institute of Professionals';
    document.title = full;
    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [k, v] = sel.replace(/[[\]"]/g, '').split('=');
        el.setAttribute(k, v);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', full);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', 'website');
    if (path) {
      let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = BASE + path;
      setMeta('meta[property="og:url"]', 'content', BASE + path);
    }
    if (image) setMeta('meta[property="og:image"]', 'content', image);
  }, [title, description, path, image]);
}

export function useJsonLd(id: string, data: unknown) {
  useEffect(() => {
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      const n = document.getElementById(id);
      if (n) n.remove();
    };
  }, [id, JSON.stringify(data)]);
}
