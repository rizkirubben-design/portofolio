"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminCredentials } from "@/lib/admin-credentials";
import { setAdminSession, clearAdminSession } from "@/lib/admin-session";

export type AuthFormState = { error?: string; notice?: string };

/** Masuk sebagai admin dengan kredensial yang di-hardcode. */
export async function signInAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  if (!isAdminCredentials(email, password)) {
    return { error: "Email atau password salah." };
  }

  await setAdminSession();
  revalidatePath("/", "layout");
  redirect("/admin");
}

/** Keluar dari akun. */
export async function signOutAction() {
  await clearAdminSession();
  revalidatePath("/", "layout");
  redirect("/login");
}
