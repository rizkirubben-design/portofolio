import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || "portofolio-admin-session-secret-change-me";

/** Kredensial admin di-hardcode (bisa di-override lewat env). */
export { isAdminCredentials } from "@/lib/admin-credentials";

/** Cek apakah cookie sesi admin valid. */
export async function hasAdminSession(): Promise<boolean> {
  const store = await cookies();
  if (!store) return false;
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return token === ADMIN_SESSION_SECRET;
}

/** Set cookie sesi admin (httpOnly). */
export async function setAdminSession(): Promise<void> {
  const store = await cookies();
  if (!store) return;
  store.set(ADMIN_SESSION_COOKIE, ADMIN_SESSION_SECRET, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

/** Hapus cookie sesi admin. */
export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  if (!store) return;
  store.delete(ADMIN_SESSION_COOKIE);
}
