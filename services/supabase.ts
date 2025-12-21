
import { createClient } from '@supabase/supabase-js';

/**
 * Safer environment variable access.
 * If you are running locally without Vite, these fallbacks ensure the app doesn't crash.
 */
const getEnv = (key: string, fallback: string) => {
  try {
    // Attempt to access Vite-style env
    const viteEnv = (import.meta as any).env;
    if (viteEnv && viteEnv[key]) return viteEnv[key];
  } catch (e) {}
  
  try {
    // Attempt to access process.env (for some builders)
    if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  } catch (e) {}

  return fallback;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://qcnyyjzivdhezfranyja.supabase.co');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_6yAuApxzGpYhQvbtEZbwoA_1YnWAfJr');

console.log('[Supabase] Initializing with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
