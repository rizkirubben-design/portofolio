import { Suspense } from "react";
import { SparklesIcon } from "lucide-react";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SETUP_HINT } from "@/lib/supabase/env";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ringkasan" };

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<OverviewSkeleton />}>
      <OverviewContent />
    </Suspense>
  );
}

async function OverviewContent() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        <span>{SETUP_HINT}</span>
      </div>
    );
  }

  let projectsData: { is_published: boolean }[] | null = null;
  let experiencesData: unknown[] | null = null;
  let educationData: unknown[] | null = null;
  let skillsData: unknown[] | null = null;
  let settingsData: { display_name?: string } | null = null;
  let thrown: string | null = null;

  try {
    const supabase = createServiceClient() ?? (await createClient());
    const [projectsRes, experiencesRes, educationRes, skillsRes, settingsRes] =
      await Promise.all([
        supabase.from("projects").select("id, is_published"),
        supabase.from("experiences").select("id"),
        supabase.from("education").select("id"),
        supabase.from("skills").select("id"),
        supabase.from("site_settings").select("display_name").eq("id", 1).maybeSingle(),
      ]);

    if (projectsRes.error) throw projectsRes.error;
    if (experiencesRes.error) throw experiencesRes.error;
    if (educationRes.error) throw educationRes.error;
    if (skillsRes.error) throw skillsRes.error;
    if (settingsRes.error) throw settingsRes.error;

    projectsData = (projectsRes.data as { is_published: boolean }[] | null) ?? null;
    experiencesData = (experiencesRes.data as unknown[] | null) ?? null;
    educationData = (educationRes.data as unknown[] | null) ?? null;
    skillsData = (skillsRes.data as unknown[] | null) ?? null;
    settingsData = (settingsRes.data as { display_name?: string } | null) ?? null;
  } catch (e) {
    thrown = e instanceof Error ? e.message : "kesalahan";
  }

  if (thrown) {
    return <p className="text-sm text-destructive">Gagal memuat: {thrown}</p>;
  }

  const totalProjects = projectsData?.length ?? 0;
  const publishedProjects = projectsData?.filter((p) => p.is_published).length ?? 0;
  const totalExp = experiencesData?.length ?? 0;
  const totalEdu = educationData?.length ?? 0;
  const totalSkills = skillsData?.length ?? 0;
  const name = settingsData?.display_name;

  const stats = [
    { label: "Proyek (dipublikasikan)", value: `${publishedProjects}/${totalProjects}` },
    { label: "Pengalaman", value: String(totalExp) },
    { label: "Pendidikan", value: String(totalEdu) },
    { label: "Keahlian", value: String(totalSkills) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Selamat datang, {name ?? "Admin"} ðŸ‘‹</h1>
        <p className="text-sm text-muted-foreground">
          Kelola konten portofolio Anda dari dashboard ini. Perubahan langsung tampil di halaman publik.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} size="sm">
            <CardHeader>
              <CardTitle className="text-sm">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold tracking-tight">{s.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-primary" /> Mulai kelola
          </CardTitle>
          <CardDescription>Pilih menu di sidebar untuk mengubah konten.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm">
              <Link href="/admin/profil">Atur Profil</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/proyek">Tambah Proyek</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/keahlian">Tambah Keahlian</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/" target="_blank">
                Lihat Situs Publik
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

