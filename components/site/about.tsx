import Image from "next/image";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import type { SiteSettings } from "@/lib/types";

export function About({ settings }: { settings: SiteSettings | null }) {
  const bio = settings?.bio?.trim();

  return (
    <section id="tentang" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Tentang"
        title="Kenalan lebih dekat"
        description="Cerita singkat tentang latar belakang, minat, dan apa yang saya kerjakan."
      />

      <Reveal className="mt-8 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
        <div className="relative mx-auto size-32 overflow-hidden rounded-2xl ring-1 ring-foreground/10 sm:mx-0 sm:size-40">
          {settings?.avatar_url ? (
            <Image
              src={settings.avatar_url}
              alt={`Foto ${settings.display_name || "profil"}`}
              fill
              sizes="160px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-primary/15 text-4xl font-semibold text-primary">
              {(settings?.display_name || "A").trim().charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {bio ? (
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
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
      </Reveal>
    </section>
  );
}
