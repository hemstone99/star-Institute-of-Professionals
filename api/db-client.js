import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './db-wake.js';

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceKey || publicKey,
  {
    global: {
      fetch: async (url, options) => {
        let res = await fetch(url, options);
        if (res.status === 401 && publicKey && serviceKey && serviceKey !== publicKey) {
          const headers = new Headers(options?.headers);
          headers.set('apikey', publicKey);
          headers.set('Authorization', 'Bearer ' + publicKey);
          res = await fetch(url, { ...options, headers });
        }
        if (!res.ok && res.status >= 500) triggerRestore();
        return res;
      },
    },
  }
);

export default supabase;
