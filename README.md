# Portofolio — Web Portofolio Dinamis

Web portofolio pribadi (Bahasa Indonesia) yang dibangun dengan **Next.js 16**, **shadcn/ui**, dan **Supabase** (database + autentikasi). Memiliki dua role: **admin** (kelola konten) dan **user** (akun publik). Semua konten portofolio dibaca langsung dari Supabase.

## Fitur

- Halaman publik: Hero, Tentang, Keahlian, Proyek, Pengalaman & Pendidikan, Kontak
- Tema gelap dengan aksen violet/biru (shadcn/ui)
- Dashboard admin: kelola Proyek, Pengalaman, Pendidikan, Keahlian, dan Profil (nama, tagline, bio, email, sosmed)
- Login / daftar dengan email & password (Supabase Auth)
- Proteksi route `/admin` (hanya role `admin`)
- Konten fallback gracefully bila Supabase belum dikonfigurasi

## Menjalankan (dev)

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Setup Supabase (wajib agar data muncul)

1. Buat akun & project gratis di [supabase.com](https://supabase.com) (region bebas).
2. Di dashboard Supabase → **Settings → API**, salin:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Buat file `.env.local` di root proyek (atau salin dari `.env.example`), isi kedua variabel di atas.
4. Restart dev server (`Ctrl+C` lalu `npm run dev`).
5. Di dashboard Supabase → **SQL Editor → New Query**, paste seluruh isi `supabase/schema.sql`, lalu **Run**. Ini membuat tabel, RLS, data dummy, **dan bucket storage `media`** untuk foto. (File ini idempotent — boleh dijalankan ulang kapan saja.)

### Menjadikan akun admin

Tidak ada registrasi dan tidak ada email konfirmasi. Akun admin tunggal dengan kredensial **di-hardcode**:

- Email: `admin@portofolio.com`
- Password: `admin123`

(Override lewat env `ADMIN_EMAIL` / `ADMIN_PASSWORD` jika diinginkan.)

Admin masuk lewat sesi cookie (httpOnly) — bukan Supabase Auth — sehingga tidak bergantung pada validasi email Supabase. Yang dibutuhkan Supabase hanya untuk **data**:

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (baca publik)
- `SUPABASE_SERVICE_ROLE_KEY` (wajib agar dashboard admin bisa menulis data, bypass RLS)

Langkah:
1. Isi `.env.local` (URL, anon key, dan service role key).
2. Jalankan `supabase/schema.sql` di SQL Editor (membuat tabel + RLS + seed).
3. Buka `/login`, masuk dengan kredensial di atas → masuk ke `/admin`.

Tidak perlu membuat user di Supabase Auth.

## Struktur penting

- `app/page.tsx` — halaman publik (baca dari Supabase, dibungkus Suspense)
- `app/login/page.tsx` — login & daftar
- `app/admin/*` — dashboard admin (CRUD konten)
- `components/site/*` — komponen tampilan publik
- `components/admin/*` — komponen dashboard
- `lib/actions/*` — server actions (auth & CRUD)
- `lib/data.ts` — pengambil data publik + fallback
- `supabase/schema.sql` — skema + RLS + seed
- `proxy.ts` — proteksi `/admin` (Next.js 16)

## Skrip

```bash
npm run dev      # development
npm run build    # production build
npm run lint     # eslint
npm run start    # run production build
```

## Catatan keamanan

- Proteksi `/admin` dilakukan di dua lapis: `proxy.ts` (optimistis) dan `app/admin/layout.tsx` (pemeriksaan role sesungguhnya di server).
- Setiap server action juga memeriksa role admin di sisi server.
- RLS Supabase memastikan hanya admin yang bisa menulis data.
- Jangan commit `.env.local`.
