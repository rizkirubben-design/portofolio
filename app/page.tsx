import { Suspense } from "react";
import { connection } from "next/server";
import { InfoIcon } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Reveal } from "@/components/site/reveal";
import { Hero } from "@/components/site/hero";
import { About } from "@/components/site/about";
import { Skills } from "@/components/site/skills";
import { Projects } from "@/components/site/projects";
import { Timeline } from "@/components/site/timeline";
import { Footer } from "@/components/site/footer";
import { getPortfolioData } from "@/lib/data";

// Halaman publik membaca data dari Supabase (runtime), jadi boleh blocking.
export const instant = false;

/**
 * Cache Components: konten yang membaca session/DB (runtime) dibungkus Suspense,
 * sehingga halaman tetap punya static shell lalu data mengalir saat request.
 */
export default function Home() {
  return (
    <div className="flex w-full flex-col">
      <Suspense fallback={<PortfolioSkeleton />}>
        <PortfolioContent />
      </Suspense>
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mx-auto max-w-5xl px-4 pt-40 sm:px-6">
        <div className="h-7 w-48 rounded-md bg-muted" />
        <div className="mt-6 h-12 w-2/3 rounded-md bg-muted" />
        <div className="mt-4 h-5 w-1/2 rounded-md bg-muted" />
        <div className="mt-8 flex gap-3">
          <div className="h-9 w-36 rounded-lg bg-muted" />
          <div className="h-9 w-36 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="mx-auto mt-24 grid max-w-5xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-64 rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

async function PortfolioContent() {
  await connection();
  const { settings, skills, projects, experiences, education, error } =
    await getPortfolioData();

  return (
    <>
      <Navbar
        displayName={settings?.display_name ?? ""}
        avatarUrl={settings?.avatar_url ?? ""}
      />
      <Hero settings={settings} skills={skills} />
      <main>
        {error && (
          <div className="mx-auto flex w-full max-w-5xl items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        <Reveal>
          <About settings={settings} />
        </Reveal>
        <Reveal>
          <Skills skills={skills} />
        </Reveal>
        <Reveal>
          <Projects projects={projects} />
        </Reveal>
        <Reveal>
          <Timeline experiences={experiences} education={education} />
        </Reveal>
      </main>
      <Footer settings={settings} />
    </>
  );
}
