import Image from "next/image";
import { ArrowRightIcon, CompassIcon, SparklesIcon } from "lucide-react";
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
  const chips = skills.slice(0, 6);
  const links = settings ? socialLinks(settings) : [];
  const avatar = settings?.avatar_url?.trim() || "";
  const fokus = skills[0]?.name ?? "Pengembangan Web";
  const juga = skills[1]?.name ?? "Arsitektur Sistem";

  return (
    <section id="beranda" className="relative overflow-hidden pt-8 pb-16 sm:pb-24">
      {/* Pola geometris Zellij Andalusia latar belakang */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 andalusia-pattern text-primary/10 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
      />

      {/* Pancaran hangat emas Andalusia & terakota Alhambra */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-20 -translate-x-1/2 size-[32rem] rounded-full bg-accent/15 blur-3xl animate-pulse-warm"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-60 size-80 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 pt-24 sm:px-6 sm:pt-32">
        {/* Ornamen puncak gerbang (Alhambra Portal Header) */}
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/25 bg-secondary/70 px-5 py-1.5 shadow-xs backdrop-blur-md">
            <span className="text-accent text-xs">۞</span>
            <span className="font-serif text-sm font-bold text-accent tracking-wider">
              بِسْمِ اللَّهِ · أهلاً وسهلاً
            </span>
            <span className="text-accent text-xs">۞</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <span>Diwan Al-Hikmah</span>
            <span className="text-accent">✦</span>
            <span>Karya & Portofolio</span>
          </div>
        </div>

        {/* Tata letak utama: Paviliun megah Andalusia */}
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Kolom foto: Gerbang Lengkung Moorish (Horseshoe Arch) */}
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">
            <div className="relative flex size-64 items-center justify-center sm:size-80">
              {/* Bingkai dekoratif luar berlapis */}
              <div
                aria-hidden
                className="absolute -inset-3 andalusia-arch rounded-b-3xl border border-accent/40 bg-card/30 backdrop-blur-xs"
              />
              <div
                aria-hidden
                className="absolute -inset-6 andalusia-arch rounded-b-4xl border border-dashed border-primary/25 opacity-70"
              />

              {/* Kontainer foto utama dengan lengkungan istana Cordoba */}
              <div className="relative size-56 sm:size-72 overflow-hidden andalusia-arch rounded-b-2xl border-2 border-primary/40 bg-card p-2 shadow-2xl ring-4 ring-accent/20">
                <div className="relative size-full overflow-hidden andalusia-arch rounded-b-xl bg-background/50">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={`Foto ${name}`}
                      fill
                      priority
                      sizes="(max-width: 640px) 224px, 288px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-primary/10 font-serif text-7xl font-bold text-accent">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Medallion mengambang kiri & kanan */}
              <div className="animate-float absolute -left-3 top-8 rounded-xl border border-primary/25 bg-card/95 px-3 py-2 shadow-lg backdrop-blur sm:-left-6">
                <p className="font-serif text-[11px] text-accent font-bold">
                  ✦ {fokus}
                </p>
                <p className="text-[10px] text-muted-foreground">Keahlian Inti</p>
              </div>

              <div className="animate-float-delayed absolute -right-3 bottom-8 rounded-xl border border-primary/25 bg-card/95 px-3 py-2 shadow-lg backdrop-blur sm:-right-6">
                <p className="font-serif text-[11px] text-accent font-bold">
                  ✦ {juga}
                </p>
                <p className="text-[10px] text-muted-foreground">Fokus Inovasi</p>
              </div>
            </div>
          </div>

          {/* Kolom teks & deskripsi */}
          <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:col-span-7 lg:items-start lg:text-left">
            <h1 className="font-heading text-balance text-4xl font-normal leading-[1.15] tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Salam & Kehormatan, saya <span className="font-serif text-accent underline decoration-primary/30 underline-offset-8">{name}</span>
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg leading-relaxed">
              {tagline}
            </p>

            {/* Mozaik keahlian (Zellij tiles) */}
            {chips.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                {chips.map((chip) => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-card/90 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-xs transition-all hover:border-accent hover:text-accent"
                  >
                    <span className="text-accent text-[10px]">۞</span>
                    {chip.name}
                  </span>
                ))}
              </div>
            )}

            {/* Tombol aksi */}
            <div className="mt-8 flex flex-wrap justify-center gap-3.5 lg:justify-start">
              <Button asChild size="lg" className="rounded-xl shadow-lg shadow-primary/20 font-medium px-6">
                <a href="#proyek">
                  Jelajahi Mahakarya <ArrowRightIcon className="size-4 ml-1" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-primary/30 hover:border-primary hover:bg-primary/5 px-6">
                <a href="#kontak">Silaturahmi Majlis</a>
              </Button>
            </div>

            {/* Jalur silaturahmi */}
            {links.length > 0 && (
              <div className="mt-8 flex flex-col items-center gap-3 border-t border-border/80 pt-6 sm:flex-row sm:gap-4 lg:items-start">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Jejaring Silaturahmi ✦
                </span>
                <div className="flex gap-2">
                  {links.map((link) => (
                    <a
                      key={link.kind}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                    >
                      {socialIcon(link.kind)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
