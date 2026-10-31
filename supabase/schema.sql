-- ============================================================
-- Portofolio â€” skema database Supabase
-- Cara pakai:
-- 1. Buat project gratis di https://supabase.com
-- 2. Buka SQL Editor -> New Query
-- 3. Paste seluruh file ini -> Run
-- 4. (Opsional) atur akun admin: lihat bagian "Menjadikan admin" di bawah
-- ============================================================

-- ---------- profiles (terhubung ke auth.users, menyimpan role) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- helper: cek apakah pengguna yang login adalah admin (security definer)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Kebijakan profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

-- Trigger: otomatis buat profile saat ada signup baru (role default 'user')
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- site_settings (1 baris konfigurasi situs) ----------
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  display_name text not null default 'Nama Anda',
  tagline text not null default '',
  bio text not null default '',
  avatar_url text not null default '',
  email text not null default '',
  github_url text not null default '',
  linkedin_url text not null default '',
  instagram_url text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_select_public" on public.site_settings;
create policy "site_settings_select_public"
  on public.site_settings for select
  using (true);

drop policy if exists "site_settings_insert_admin" on public.site_settings;
create policy "site_settings_insert_admin"
  on public.site_settings for insert
  with check (public.is_admin());

drop policy if exists "site_settings_update_admin" on public.site_settings;
create policy "site_settings_update_admin"
  on public.site_settings for update
  using (public.is_admin())
  with check (public.is_admin());

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------- skills ----------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  level text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.skills enable row level security;

drop policy if exists "skills_select_public" on public.skills;
create policy "skills_select_public" on public.skills for select using (true);

drop policy if exists "skills_insert_admin" on public.skills;
create policy "skills_insert_admin" on public.skills for insert with check (public.is_admin());

drop policy if exists "skills_update_admin" on public.skills;
create policy "skills_update_admin" on public.skills for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "skills_delete_admin" on public.skills;
create policy "skills_delete_admin" on public.skills for delete using (public.is_admin());

-- ---------- projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tech text[] not null default '{}',
  repo_url text not null default '',
  demo_url text not null default '',
  image_url text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "projects_select_public" on public.projects;
create policy "projects_select_public"
  on public.projects for select
  using (is_published = true or public.is_admin());

drop policy if exists "projects_insert_admin" on public.projects;
create policy "projects_insert_admin"
  on public.projects for insert with check (public.is_admin());

drop policy if exists "projects_update_admin" on public.projects;
create policy "projects_update_admin"
  on public.projects for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects_delete_admin" on public.projects;
create policy "projects_delete_admin"
  on public.projects for delete using (public.is_admin());

-- ---------- experiences ----------
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'magang' check (kind in ('magang', 'organisasi', 'pekerjaan')),
  position text not null,
  org_name text not null,
  period text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.experiences enable row level security;

drop policy if exists "experiences_select_public" on public.experiences;
create policy "experiences_select_public" on public.experiences for select using (true);

drop policy if exists "experiences_insert_admin" on public.experiences;
create policy "experiences_insert_admin" on public.experiences for insert with check (public.is_admin());

drop policy if exists "experiences_update_admin" on public.experiences;
create policy "experiences_update_admin" on public.experiences for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "experiences_delete_admin" on public.experiences;
create policy "experiences_delete_admin" on public.experiences for delete using (public.is_admin());

-- ---------- education ----------
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  major text not null,
  period text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.education enable row level security;

drop policy if exists "education_select_public" on public.education;
create policy "education_select_public" on public.education for select using (true);

drop policy if exists "education_insert_admin" on public.education;
create policy "education_insert_admin" on public.education for insert with check (public.is_admin());

drop policy if exists "education_update_admin" on public.education;
create policy "education_update_admin" on public.education for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "education_delete_admin" on public.education;
create policy "education_delete_admin" on public.education for delete using (public.is_admin());

-- ============================================================
-- Seed data dummy (boleh dihapus / diganti nanti lewat dashboard)
-- ============================================================

update public.site_settings
set
  display_name = 'Andi Pratama',
  tagline = 'Mahasiswa Ilmu Komputer â€” pencinta web development & open source',
  bio = 'Halo! Saya mahasiswa Ilmu Komputer yang fokus di web development. Saya senang membangun aplikasi web yang bersih, cepat, dan bermanfaat. Selain kuliah, saya aktif di organisasi kampus dan sering mengikuti hackathon.',
  avatar_url = '',
  email = 'andi.pratama@email.com',
  github_url = 'https://github.com/andipratama',
  linkedin_url = 'https://linkedin.com/in/andipratama',
  instagram_url = 'https://instagram.com/andipratama',
  updated_at = now()
where id = 1;

insert into public.skills (category, name, level, sort_order) values
  ('Bahasa Pemrograman', 'TypeScript', 'Mahir', 1),
  ('Bahasa Pemrograman', 'JavaScript', 'Mahir', 2),
  ('Bahasa Pemrograman', 'Python', 'Menengah', 3),
  ('Bahasa Pemrograman', 'SQL', 'Menengah', 4),
  ('Framework & Tools', 'Next.js', 'Mahir', 1),
  ('Framework & Tools', 'React', 'Mahir', 2),
  ('Framework & Tools', 'Tailwind CSS', 'Mahir', 3),
  ('Framework & Tools', 'Supabase', 'Menengah', 4),
  ('Framework & Tools', 'Git', 'Mahir', 5),
  ('Lainnya', 'UI/UX Design', 'Menengah', 1),
  ('Lainnya', 'Public Speaking', 'Menengah', 2)
on conflict do nothing;

insert into public.projects (title, description, tech, repo_url, demo_url, is_published, sort_order) values
  ('Portofolio Web Dinamis', 'Web portofolio pribadi dengan dashboard admin dan Supabase sebagai database.', array['Next.js','Tailwind','Supabase'], 'https://github.com/andipratama/portofolio', 'https://portofolio-andi.vercel.app', true, 1),
  ('Aplikasi Catatan Kuliah', 'Aplikasi catatan sederhana untuk mahasiswa dengan fitur pencarian dan tag.', array['React','Node.js','PostgreSQL'], 'https://github.com/andipratama/notes-app', '', true, 2),
  ('Dashboard Analitik Kampus', 'Dashboard visualisasi data mahasiswa dan mata kuliah.', array['Next.js','Chart.js','Supabase'], 'https://github.com/andipratama/campus-dashboard', '', false, 3)
on conflict do nothing;

insert into public.experiences (kind, position, org_name, period, description, sort_order) values
  ('magang', 'Frontend Developer Intern', 'PT Teknologi Nusantara', 'Jun 2024 â€“ Sep 2024', 'Membangun komponen UI dengan React dan Tailwind, serta integrasi API.', 1),
  ('organisasi', 'Ketua Divisi IT', 'BEM Fakultas Ilmu Komputer', '2023 â€“ 2024', 'Memimpin tim pengembangan website dan sistem informasi organisasi.', 2),
  ('pekerjaan', 'Freelance Web Developer', 'Remote', '2022 â€“ Sekarang', 'Membuat website untuk UMKM dan individu.', 3)
on conflict do nothing;

insert into public.education (institution, major, period, description, sort_order) values
  ('Universitas Pendidikan Indonesia', 'S1 Ilmu Komputer', '2021 â€“ 2025', 'Fokus di rekayasa perangkat lunak dan sistem informasi.', 1),
  ('SMAN 1 Bandung', 'IPA', '2018 â€“ 2021', 'Jurusan IPA.', 2)
on conflict do nothing;
-- ============================================================
-- Menjadikan akun admin:
-- 1. (Otomatis) set SUPABASE_SERVICE_ROLE_KEY di .env.local, lalu login
--    dengan kredensial hardcoded (default admin@portofolio.com / admin123).
-- 2. (Manual) buat user di Authentication -> Users -> Add user dengan
--    email & password yang sama, lalu jalankan:
--       update public.profiles set role = 'admin'
--       where id = (select id from auth.users where email = 'admin@portofolio.com');
-- ============================================================
