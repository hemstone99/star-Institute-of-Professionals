export function adminHeaders(): Record<string, string> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('sip_admin_token') : null;
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['X-Admin-Token'] = token;
  return h;
}

export async function api(path: string, opts: RequestInit = {}): Promise<any> {
  const res = await fetch(path, {
    ...opts,
    headers: { ...adminHeaders(), ...(opts.headers || {}) },
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : 'Request failed (' + res.status + ')';
    throw new Error(msg);
  }
  return data;
}

export const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export const fmtDateTime = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString('en-KE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '';
