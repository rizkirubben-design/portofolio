import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  Education,
  Experience,
  PortfolioData,
  Project,
  SiteSettings,
  Skill,
} from "@/lib/types";

export type AdminPage = PortfolioData;

/**
 * Ambil semua data portofolio untuk halaman publik.
 * Kalau Supabase belum dikonfigurasi / tabel gagal di-query,
 * kembalikan struktur kosong supaya halaman tetap tampil.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  if (!isSupabaseConfigured()) {
    return empty("Supabase belum dikonfigurasi. Isi .env.local lalu restart dev server (lihat README).");
  }

  try {
    const supabase = await createClient();

    const [settingsRes, skillsRes, projectsRes, experiencesRes, educationRes] =
      await Promise.all([
        supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.from("skills").select("*").order("sort_order").order("created_at"),
        supabase
          .from("projects")
          .select("*")
          .eq("is_published", true)
          .order("sort_order")
          .order("created_at"),
        supabase.from("experiences").select("*").order("sort_order").order("created_at"),
        supabase.from("education").select("*").order("sort_order").order("created_at"),
      ]);

    const firstError =
      settingsRes.error ??
      skillsRes.error ??
      projectsRes.error ??
      experiencesRes.error ??
      educationRes.error;

    if (firstError) {
      return empty(`Gagal membaca data: ${firstError.message}`);
    }

    return {
      settings: (settingsRes.data as SiteSettings | null) ?? null,
      skills: (skillsRes.data as Skill[] | null) ?? [],
      projects: (projectsRes.data as Project[] | null) ?? [],
      experiences: (experiencesRes.data as Experience[] | null) ?? [],
      education: (educationRes.data as Education[] | null) ?? [],
      error: null,
    };
  } catch (e) {
    return empty(
      `Tidak dapat terhubung ke Supabase: ${
        e instanceof Error ? e.message : "kesalahan tidak diketahui"
      }`
    );
  }
}

function empty(error: string | null): PortfolioData {
  return { settings: null, skills: [], projects: [], experiences: [], education: [], error };
}
