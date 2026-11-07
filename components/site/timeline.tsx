import { GraduationCapIcon, BriefcaseIcon } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import type { Education, Experience } from "@/lib/types";

const kindLabel: Record<Experience["kind"], string> = {
  magang: "Magang",
  organisasi: "Organisasi",
  pekerjaan: "Pekerjaan",
};

function TimelineItem({
  title,
  subtitle,
  period,
  description,
  badge,
  delay = 0,
}: {
  title: string;
  subtitle: string;
  period: string | null;
  description: string | null;
  badge?: string;
  /** Tanda telat untuk animasi muncul berurutan. */
  delay?: number;
}) {
  return (
    <li className="relative pl-8">
      {/* Node bintang emas Andalusia */}
      <span className="absolute left-0 top-1.5 flex size-4 items-center justify-center text-accent text-xs">
        ✦
      </span>
      <span className="absolute left-[7px] top-5 h-[calc(100%-1rem)] w-px bg-primary/20 border-l border-dashed border-primary/40" aria-hidden />

      <Reveal delay={delay}>
        <div className="space-y-1.5 rounded-2xl border border-primary/20 bg-card/60 p-4 backdrop-blur-xs transition-colors hover:border-primary/40 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-normal leading-snug">{title}</h3>
            {badge && (
              <Badge variant="outline" className="h-auto border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent rounded-full">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {subtitle}
            {period && <span className="text-accent font-medium"> · {period}</span>}
          </p>
          {description && <p className="text-xs text-muted-foreground/90 pt-1 leading-relaxed">{description}</p>}
        </div>
      </Reveal>
    </li>
  );
}

export function Timeline({
  experiences,
  education,
}: {
  experiences: Experience[];
  education: Education[];
}) {
  return (
    <section id="pengalaman" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Al-Rihlah · الرحلة"
        title="Rihlah Pengalaman & Sanad Ilmu"
        description="Rekam jejak dedikasi profesional, amanah organisasi, dan penempaan ilmu akademik."
      />

      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/80 pb-2.5 text-foreground">
            <BriefcaseIcon className="size-4 text-accent" />
            <h3 className="font-heading text-base font-normal tracking-wide text-foreground">
              Pengalaman & Khidmah
            </h3>
          </div>
          {experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada pengalaman.</p>
          ) : (
            <ul className="space-y-4">
              {experiences.map((e, i) => (
                <TimelineItem
                  key={e.id}
                  delay={i * 80}
                  badge={kindLabel[e.kind]}
                  title={e.position}
                  subtitle={e.org_name}
                  period={e.period}
                  description={e.description}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/80 pb-2.5 text-foreground">
            <GraduationCapIcon className="size-4 text-accent" />
            <h3 className="font-heading text-base font-normal tracking-wide text-foreground">
              Sanad Pendidikan & Studi
            </h3>
          </div>
          {education.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada data pendidikan.</p>
          ) : (
            <ul className="space-y-4">
              {education.map((d, i) => (
                <TimelineItem
                  key={d.id}
                  delay={i * 80}
                  title={d.institution}
                  subtitle={d.major}
                  period={d.period}
                  description={d.description}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
