import { Suspense } from "react";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { SETUP_HINT } from "@/lib/supabase/env";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectsManager } from "@/components/admin/projects-manager";
import type { Project } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Proyek" };

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-amber-200">{SETUP_HINT}</p>;
  }

  let data: Project[] | null = null;
  let error: { message: string } | null = null;
  let thrown: string | null = null;
  try {
    const supabase = createServiceClient() ?? (await createClient());
    const res = await supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .order("created_at");
    data = (res.data as Project[] | null) ?? null;
    error = (res.error as { message: string } | null) ?? null;
  } catch (e) {
    thrown = e instanceof Error ? e.message : "kesalahan";
  }

  if (thrown) {
    return <p className="text-sm text-destructive">Gagal memuat: {thrown}</p>;
  }
  if (error) {
    return <p className="text-sm text-destructive">Gagal memuat proyek: {error.message}</p>;
  }
  return <ProjectsManager rows={(data ?? []) as Project[]} />;
}

