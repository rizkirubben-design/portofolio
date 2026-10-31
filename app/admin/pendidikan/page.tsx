import { Suspense } from "react";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SETUP_HINT } from "@/lib/supabase/env";
import { Skeleton } from "@/components/ui/skeleton";
import { EducationManager } from "@/components/admin/education-manager";
import type { Education } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pendidikan" };

export default function AdminEducationPage() {
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

  let data: Education[] | null = null;
  let error: { message: string } | null = null;
  let thrown: string | null = null;
  try {
    const supabase = createServiceClient() ?? (await createClient());
    const res = await supabase
      .from("education")
      .select("*")
      .order("sort_order")
      .order("created_at");
    data = (res.data as Education[] | null) ?? null;
    error = (res.error as { message: string } | null) ?? null;
  } catch (e) {
    thrown = e instanceof Error ? e.message : "kesalahan";
  }

  if (thrown) {
    return <p className="text-sm text-destructive">Gagal memuat: {thrown}</p>;
  }
  if (error) {
    return <p className="text-sm text-destructive">Gagal memuat pendidikan: {error.message}</p>;
  }
  return <EducationManager rows={(data ?? []) as Education[]} />;
}

