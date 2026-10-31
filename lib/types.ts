export type Profile = {
  id: string;
  role: "user" | "admin";
  display_name: string | null;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  display_name: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  updated_at: string | null;
};

export type Skill = {
  id: string;
  category: string;
  name: string;
  level: string | null;
  sort_order: number;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  repo_url: string;
  demo_url: string;
  image_url: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type Experience = {
  id: string;
  kind: "magang" | "organisasi" | "pekerjaan";
  position: string;
  org_name: string;
  period: string;
  description: string;
  sort_order: number;
  created_at: string;
};

export type Education = {
  id: string;
  institution: string;
  major: string;
  period: string;
  description: string;
  sort_order: number;
  created_at: string;
};

/** Hasil ambil data untuk halaman publik (null = tabel Supabase belum siap/kosong). */
export type PortfolioData = {
  settings: SiteSettings | null;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  error: string | null;
};
