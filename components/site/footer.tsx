import { MailIcon } from "lucide-react";
import { socialIcon, socialLinks } from "@/components/site/social";
import { Reveal } from "@/components/site/reveal";
import { Year } from "@/components/site/year";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const name = settings?.display_name?.trim() || "Nama Anda";
  const email = settings?.email?.trim();
  const links = settings ? socialLinks(settings) : [];

  return (
    <footer id="kontak" className="scroll-mt-20 border-t border-border/80 bg-secondary/30 relative overflow-hidden">
      {/* Ornamen latar belakang */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 andalusia-pattern text-primary/5 opacity-50"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-2">
            <span className="text-accent text-xs">✦</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Al-Ittisal · الاتصال
            </span>
            <span className="text-accent text-xs">✦</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-normal text-foreground">
            Majlis Silaturahmi & Musyawarah
          </h2>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed -mt-2">
            Pintu diwan senantiasa terbuka untuk menjalin ukhuwah profesional, pertukaran wawasan, serta kolaborasi proyek berdaya guna.
          </p>

          {email ? (
            <Button asChild size="lg" className="rounded-xl shadow-lg shadow-primary/20 px-6">
              <a href={`mailto:${email}`}>
                <MailIcon className="size-4 mr-1 text-accent" /> Kirim Pesan ({email})
              </a>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Email belum diatur — tambahkan melalui dashboard admin.
            </p>
          )}

          {links.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {links.map((link) => (
                <Button
                  key={link.kind}
                  asChild
                  variant="outline"
                  size="icon"
                  className="rounded-xl border-border bg-card hover:border-primary hover:text-primary"
                  aria-label={link.label}
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {socialIcon(link.kind)}
                  </a>
                </Button>
              ))}
            </div>
          )}

          <p className="pt-6 text-xs text-muted-foreground font-serif">
            © <Year /> {name} · كُتب بحب وشغف في ديوان العمل
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
