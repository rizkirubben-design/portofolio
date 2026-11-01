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
    <footer id="kontak" className="scroll-mt-20 border-t border-border/60">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal className="flex flex-col items-center gap-6 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            Kontak
          </span>

          {email ? (
            <Button asChild size="lg" variant="outline" className="mx-auto">
              <a href={`mailto:${email}`}>
                <MailIcon /> {email}
              </a>
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Email belum diatur — tambahkan melalui dashboard admin.
            </p>
          )}

          {links.length > 0 && (
            <div className="flex items-center justify-center gap-2">
              {links.map((link) => (
                <Button
                  key={link.kind}
                  asChild
                  variant="outline"
                  size="icon"
                  aria-label={link.label}
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {socialIcon(link.kind)}
                  </a>
                </Button>
              ))}
            </div>
          )}

          <p className="pt-4 text-xs text-muted-foreground">
            © <Year /> {name}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
