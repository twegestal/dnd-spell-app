import { createClient } from '@supabase/supabase-js';

export function supabaseForRequest(authHeader?: string) {
  const jwt = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : undefined;

  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, {
    global: { headers: jwt ? { Authorization: `Bearer ${jwt}` } : {} },
  });
}
