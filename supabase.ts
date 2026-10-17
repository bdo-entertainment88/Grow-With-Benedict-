import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// REPLACE THESE WITH YOUR OWN SUPABASE KEYS
// 1. Go to https://supabase.com → create a free project
// 2. Go to Project Settings → API
// 3. Copy "Project URL" and "anon public" key
// ============================================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';          // e.g. https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // the anon/public key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
    SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
    SUPABASE_URL.startsWith('https://')
  );
};
