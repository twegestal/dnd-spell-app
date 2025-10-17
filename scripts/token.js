import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.GMAIL_USR,
    password: process.env.GMAIL_PASS,
  });

  if (error) throw error;
  console.log('Access token:', data.session?.access_token);
})();