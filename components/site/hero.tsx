import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import { socialIcon, socialLinks } from "@/components/site/social";
import { Button } from "@/components/ui/button";
import type { SiteSettings, Skill } from "@/lib/types";

export function Hero({
  settings,
  skills,
}: {
  settings: SiteSettings | null;
  skills: Skill[];
}) {
  const name = settings?.display_name?.trim() || "Nama Anda";
  const tagline = settings?.tagline?.trim() || "Tagline profil akan tampil di sini.";
  const chips = skills.slice(0, 5);
  const links = settings ? socialLinks(settings) : [];
  const avatar = settings?.avatar_url?.trim() || "";
  const fokus = skills[0]?.name ?? "Web Development";
  const juga = skills[1]?.name ?? "UI/UX Design";

  return (
    <section id="beranda" className="relative overflow-hidden">
      {/* Aura latar yang lembut dan hangat */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 size-72 rounded-full bg-primary/15 blur-3xl sm:size-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-40 size-80 rounded-full bg-accent/50 blur-3xl"
      />

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
        <div className="grid items-center gap-12 md:grid-cols-12 lg:gap-16">
          {/* Kolom teks */}
          <div className="order-2 flex animate-in flex-col items-start gap-5 duration-700 fade-in slide-in-from-bottom-4 md:order-1 md:col-span-7">
            <h1 className="font-heading text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              Halo, saya <span className="text-primary">{name}</span>
            </h1>

            <p className="max-w-lg text-pretty text-base text-muted-foreground sm:text-lg">
              {tagline}
            </p>

            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip.id}
                    className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {chip.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild size="lg" className="rounded-xl">
                <a href="#proyek">
                  Lihat Proyek <ArrowRightIcon />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <a href="#kontak">Kontak Saya</a>
              </Button>
            </div>

            {links.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Temukan saya di
                </span>
                <div className="flex gap-2">
                  {links.map((link) => (
                    <a
                      key={link.kind}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                    >
                      {socialIcon(link.kind)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kolom foto */}
          <div className="relative order-1 flex items-center justify-center py-2 md:order-2 md:col-span-5">
            <div className="relative flex size-56 items-center justify-center sm:size-72 lg:size-80">
              <div
                aria-hidden
                className="absolute -inset-8 animate-pulse rounded-full bg-primary/20 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -inset-2 rounded-full border border-border/50"
              />

              <div className="relative size-full overflow-hidden rounded-full border-4 border-background shadow-xl ring-1 ring-foreground/10">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={`Foto ${name}`}
                    fill
                    priority
                    sizes="(max-width: 640px) 224px, 320px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-primary/15 font-heading text-7xl font-semibold text-primary">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Lencana melayang */}
              <div className="animate-float absolute -right-2 top-6 rounded-xl border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur sm:-right-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Fokus di
                </p>
                <p className="font-heading text-sm font-bold">{fokus}</p>
              </div>
              <div className="animate-float-delayed absolute -left-2 bottom-8 rounded-xl border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur sm:-left-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Juga suka
                </p>
                <p className="font-heading text-sm font-bold">{juga}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
