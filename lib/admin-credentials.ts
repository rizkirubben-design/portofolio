/**
 * Kredensial admin yang di-hardcode.
 * Bisa di-override lewat env ADMIN_EMAIL / ADMIN_PASSWORD (opsional).
 *
 * Catatan: pengguna dengan email+password ini harus ada di Supabase Auth agar
 * RLS (role admin) berfungsi. Jika SUPABASE_SERVICE_ROLE_KEY diisi, pengguna
 * akan dibuat otomatis saat login pertama. Jika tidak, buat manual di
 * dashboard Supabase (Authentication -> Users -> Add user) dengan email &
 * password yang sama, lalu set role='admin' di tabel profiles.
 */
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL?.trim() || "admin@portofolio.com";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export function isAdminCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}
