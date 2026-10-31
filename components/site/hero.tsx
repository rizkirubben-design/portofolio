import { socialIcon, socialLinks, type SocialLink } from "@/components/site/social";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

export function Hero({ settings }: { settings: SiteSettings | null }) {
  const name = settings?.display_name?.trim() || "Nama Anda";
  const tagline = settings?.tagline?.trim() || "Tagline profil akan tampil di sini.";
  const links = settings ? socialLinks(settings) : [];

  return (
    <section id="beranda" className="relative overflow-hidden">
      {/* Latar halus: titik ungu yang menyala */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      >
        <div className="absolute left-1/2 top-[-12rem] size-[36rem] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute left-[20%] top-[-6rem] size-[24rem] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 pb-24 pt-32 text-left sm:px-6 sm:pt-40">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          Terbuka untuk magang &amp; kolaborasi
        </span>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Halo, saya{" "}
          <span className="bg-linear-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
            {name}
          </span>
        </h1>

        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{tagline}</p>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a href="#proyek">Lihat Proyek</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#kontak">Kontak Saya</a>
          </Button>
        </div>

        {links.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            {links.map((link: SocialLink) => (
              <Button key={link.kind} asChild variant="outline" size="icon" aria-label={link.label}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {socialIcon(link.kind)}
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
