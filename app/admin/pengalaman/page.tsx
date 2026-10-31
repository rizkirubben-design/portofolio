import { Suspense } from "react";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SETUP_HINT } from "@/lib/supabase/env";
import { Skeleton } from "@/components/ui/skeleton";
import { ExperiencesManager } from "@/components/admin/experiences-manager";
import type { Experience } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pengalaman" };

export default function AdminExperiencesPage() {
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

  let data: Experience[] | null = null;
  let error: { message: string } | null = null;
  let thrown: string | null = null;
  try {
    const supabase = createServiceClient() ?? (await createClient());
    const res = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order")
      .order("created_at");
    data = (res.data as Experience[] | null) ?? null;
    error = (res.error as { message: string } | null) ?? null;
  } catch (e) {
    thrown = e instanceof Error ? e.message : "kesalahan";
  }

  if (thrown) {
    return <p className="text-sm text-destructive">Gagal memuat: {thrown}</p>;
  }
  if (error) {
    return <p className="text-sm text-destructive">Gagal memuat pengalaman: {error.message}</p>;
  }
  return <ExperiencesManager rows={(data ?? []) as Experience[]} />;
}

