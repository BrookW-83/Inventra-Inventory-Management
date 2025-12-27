'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lduteqegjntxifwifbxn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
  console.warn('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Supabase client may not work properly.');
}

// Create a singleton instance
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: return a new instance (won't be used for auth operations)
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : createBrowserClient(supabaseUrl, supabaseAnonKey);

// Helper to get the current session with retry logic
export async function getSessionWithRetry(maxRetries = 3, delay = 100) {
  const client = getSupabaseClient();

  for (let i = 0; i < maxRetries; i++) {
    try {
      const { data: { session }, error } = await client.auth.getSession();

      if (session) {
        return session;
      }

      if (error) {
        console.error('Error fetching session:', error);
      }

      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (err) {
      console.error('Exception fetching session:', err);
      if (i === maxRetries - 1) {
        return null;
      }
    }
  }

  return null;
}
