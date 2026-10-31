import { createBrowserClient } from "@supabase/ssr";
import { SETUP_HINT } from "@/lib/supabase/env";

export { isSupabaseConfigured } from "@/lib/supabase/env";

/** Klien Supabase untuk komponen client. Lempar error jelas jika env belum diisi. */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(`Konfigurasi Supabase belum diisi. ${SETUP_HINT}`);
  }
  return createBrowserClient(url, key);
}
