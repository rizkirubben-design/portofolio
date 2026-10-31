"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { hasAdminSession } from "@/lib/admin-session";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { SiteSettings } from "@/lib/types";

export type FormState = { ok?: boolean; error?: string };

/**
 * Semua aksi CRUD hanya boleh dijalankan oleh role 'admin'.
 * Pemeriksaan dilakukan di sisi server pada SETIAP aksi (proxy hanya optimistis).
 */
async function requireAdmin(): Promise<SupabaseClient> {
  if (!(await hasAdminSession())) {
    redirect("/login");
  }

  const service = createServiceClient();
  if (!service) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local. Dibutuhkan untuk menulis data dari dashboard admin."
    );
  }
  return service;
}

function crudOk(): FormState {
  // Halaman publik dan halaman admin menampilkan data yang sama,
  // jadi keduanya perlu direfresh.
  revalidatePath("/");
  revalidatePath("/admin", "layout");
  return { ok: true };
}

function fail(error: unknown): FormState {
  return { error: error instanceof Error ? error.message : "Terjadi kesalahan." };
}

function optional(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

/* ------------------------------- Proyek -------------------------------- */

export async function upsertProjectAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const id = optional(formData.get("id"));
    const title = optional(formData.get("title"));
    if (!title) return { error: "Judul proyek wajib diisi." };

    const tech = optional(formData.get("tech"))
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const row = {
      title,
      description: optional(formData.get("description")),
      tech,
      repo_url: optional(formData.get("repo_url")),
      demo_url: optional(formData.get("demo_url")),
      image_url: optional(formData.get("image_url")),
      is_published: formData.get("is_published") === "on" || formData.get("is_published") === "true",
      sort_order: Number(optional(formData.get("sort_order")) || 0),
    };

    const query = id
      ? supabase.from("projects").update(row).eq("id", id)
      : supabase.from("projects").insert(row);

    const { error } = await query;
    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProjectAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const id = optional(formData.get("id"));
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}

/** Toggle cepat status publikasi dari tabel proyek. */
export async function setProjectPublishedAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const id = optional(formData.get("id"));
    const published = optional(formData.get("published")) === "true";
    const { error } = await supabase
      .from("projects")
      .update({ is_published: published })
      .eq("id", id);
    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------ Pengalaman ------------------------------ */

export async function upsertExperienceAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const id = optional(formData.get("id"));
    const position = optional(formData.get("position"));
    const org = optional(formData.get("org_name"));
    if (!position || !org) return { error: "Posisi dan nama organisasi/perusahaan wajib diisi." };

    const kind = optional(formData.get("kind")) || "magang";
    if (!["magang", "organisasi", "pekerjaan"].includes(kind)) {
      return { error: "Jenis pengalaman tidak valid." };
    }

    const row = {
      kind,
      position,
      org_name: org,
      period: optional(formData.get("period")),
      description: optional(formData.get("description")),
      sort_order: Number(optional(formData.get("sort_order")) || 0),
    };

    const query = id
      ? supabase.from("experiences").update(row).eq("id", id)
      : supabase.from("experiences").insert(row);

    const { error } = await query;
    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}

export async function deleteExperienceAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const id = optional(formData.get("id"));
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------ Pendidikan ------------------------------ */

export async function upsertEducationAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const id = optional(formData.get("id"));
    const institution = optional(formData.get("institution"));
    const major = optional(formData.get("major"));
    if (!institution || !major) return { error: "Institusi dan jurusan wajib diisi." };

    const row = {
      institution,
      major,
      period: optional(formData.get("period")),
      description: optional(formData.get("description")),
      sort_order: Number(optional(formData.get("sort_order")) || 0),
    };

    const query = id
      ? supabase.from("education").update(row).eq("id", id)
      : supabase.from("education").insert(row);

    const { error } = await query;
    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}

export async function deleteEducationAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const id = optional(formData.get("id"));
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}

/* ------------------------------- Keahlian ------------------------------- */

export async function upsertSkillAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const id = optional(formData.get("id"));
    const name = optional(formData.get("name"));
    const category = optional(formData.get("category"));
    if (!name || !category) return { error: "Nama keahlian dan kategori wajib diisi." };

    const row = {
      name,
      category,
      level: optional(formData.get("level")) || null,
      sort_order: Number(optional(formData.get("sort_order")) || 0),
    };

    const query = id
      ? supabase.from("skills").update(row).eq("id", id)
      : supabase.from("skills").insert(row);

    const { error } = await query;
    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}

export async function deleteSkillAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const id = optional(formData.get("id"));
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}

/* --------------------------- Pengaturan profil -------------------------- */

export async function updateSettingsAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await requireAdmin();
    const row = {
      id: 1,
      display_name: optional(formData.get("display_name")) || "Nama Anda",
      tagline: optional(formData.get("tagline")),
      bio: optional(formData.get("bio")),
      avatar_url: optional(formData.get("avatar_url")),
      email: optional(formData.get("email")),
      github_url: optional(formData.get("github_url")),
      linkedin_url: optional(formData.get("linkedin_url")),
      instagram_url: optional(formData.get("instagram_url")),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("site_settings")
      .upsert(row satisfies Partial<SiteSettings> & { id: number }, { onConflict: "id" });

    if (error) return { error: error.message };
    return crudOk();
  } catch (e) {
    return fail(e);
  }
}
