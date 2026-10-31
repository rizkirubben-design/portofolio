import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SETUP_HINT } from "@/lib/supabase/env";

export { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Klien Supabase dengan service role key (bypass RLS).
 * Hanya untuk operasi server-side admin, mis. auto-provision akun admin.
 * Mengembalikan null jika key tidak diisi.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createServerClient(url, serviceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // service role tidak perlu cookie
      },
    },
  });
}

/**
 * Klien Supabase untuk Server Components / Server Actions.
 * Cookies di Next 15+ bersifat async, sehingga fungsi ini async.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(`Konfigurasi Supabase belum diisi. ${SETUP_HINT}`);
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil dari Server Component — bisa diabaikan karena proxy.ts
          // yang menyegarkan session.
        }
      },
    },
  });
}
