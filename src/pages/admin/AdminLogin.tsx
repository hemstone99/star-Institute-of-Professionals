import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { useSEO } from '../../lib/seo';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useSEO({ title: 'Admin Sign In', description: 'Administrator sign in for Star Institute of Professionals.' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) { setError('Enter your username and password.'); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sign in failed.');
      localStorage.setItem('sip_admin_token', data.token);
      localStorage.setItem('sip_admin_user', data.username);
      nav('/admin', { replace: true });
    } catch (err: any) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <main id="main-content" className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-14">
      <div className="card w-full max-w-md p-8">
        <span className="p-3 rounded bg-navy-900 text-gold-400 inline-block" aria-hidden><Lock size={22} /></span>
        <h1 className="font-display font-extrabold text-navy-900 text-2xl mt-4">Admin Sign In</h1>
        <p className="text-sm text-slate-500 mt-1">Institution Management System — authorised staff only.</p>
        {error && <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div><label className="label" htmlFor="a-user">Username</label><input id="a-user" value={username} onChange={(e) => setUsername(e.target.value)} className="field" autoComplete="username" /></div>
          <div><label className="label" htmlFor="a-pass">Password</label><input id="a-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" autoComplete="current-password" /></div>
          <button type="submit" disabled={busy} className="btn btn-navy w-full">{busy ? <><Loader2 size={17} className="animate-spin" /> Signing in…</> : 'Sign In'}</button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-400"><Link to="/" className="underline">← Back to website</Link></p>
      </div>
    </main>
  );
}
