import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import type { SiteSettings } from "@/lib/types";

export function About({ settings }: { settings: SiteSettings | null }) {
  const bio = settings?.bio?.trim();

  return (
    <section id="tentang" className="relative mx-auto max-w-5xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Tarjamah · السيرة"
        title="Kisah, Falsafah & Dedikasi Karya"
        description="Perjalanan tentang ketelitian karsa, komitmen intelektual, dan harmoni estetika Andalusia."
      />

      <Reveal className="mt-8 rounded-3xl border border-primary/25 bg-card/85 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-xl shadow-primary/5">
        {/* Ornamen sudut Arabesque */}
        <div className="absolute top-3 left-3 text-accent text-sm select-none">۞</div>
        <div className="absolute top-3 right-3 text-accent text-sm select-none">۞</div>
        <div className="absolute bottom-3 left-3 text-accent text-sm select-none">۞</div>
        <div className="absolute bottom-3 right-3 text-accent text-sm select-none">۞</div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Kolom potret gerbang kubah */}
          <div className="flex flex-col items-center justify-center lg:col-span-4">
            <div className="relative size-40 sm:size-48 overflow-hidden andalusia-arch rounded-b-2xl border-2 border-primary/30 p-1.5 bg-background shadow-md">
              <div className="relative size-full overflow-hidden andalusia-arch rounded-b-xl">
                {settings?.avatar_url ? (
                  <Image
                    src={settings.avatar_url}
                    alt={`Foto ${settings.display_name || "profil"}`}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-primary/10 font-serif text-5xl font-bold text-accent">
                    {(settings?.display_name || "A").trim().charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="font-serif text-xs font-bold text-accent">
                صاحب الديوان
              </span>
              <p className="font-heading text-sm font-semibold text-foreground">
                {settings?.display_name || "Profil"}
              </p>
            </div>
          </div>

          {/* Kolom narasi */}
          <div className="space-y-4 lg:col-span-8 border-t border-border/80 pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <div className="flex items-center gap-2 border-b border-border/80 pb-3">
              <span className="font-serif text-base text-accent font-bold">
                مجلس الفكر والبيان
              </span>
              <span className="text-muted-foreground text-xs font-sans tracking-wide">
                · Falsafah & Visi Intelektual
              </span>
            </div>

            {bio ? (
              <div className="space-y-3.5 text-sm leading-relaxed text-muted-foreground sm:text-base font-normal">
                {bio.split(/\n{2,}|\n/).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Bio belum diisi. Atur melalui dashboard admin.
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
