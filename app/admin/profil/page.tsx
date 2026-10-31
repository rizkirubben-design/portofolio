import { Suspense } from "react";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SETUP_HINT } from "@/lib/supabase/env";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsForm } from "@/components/admin/settings-form";
import type { SiteSettings } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profil" };

export default function AdminProfilePage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-amber-200">{SETUP_HINT}</p>;
  }

  let data: SiteSettings | null = null;
  let error: { message: string } | null = null;
  let thrown: string | null = null;
  try {
    const supabase = createServiceClient() ?? (await createClient());
    const res = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    data = (res.data as SiteSettings | null) ?? null;
    error = (res.error as { message: string } | null) ?? null;
  } catch (e) {
    thrown = e instanceof Error ? e.message : "kesalahan";
  }

  if (thrown) {
    return <p className="text-sm text-destructive">Gagal memuat: {thrown}</p>;
  }
  if (error) {
    return <p className="text-sm text-destructive">Gagal memuat pengaturan: {error.message}</p>;
  }
  return <SettingsForm settings={data} />;
}

