import { GraduationCapIcon, BriefcaseIcon } from "lucide-react";
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
}: {
  title: string;
  subtitle: string;
  period: string | null;
  description: string | null;
  badge?: string;
}) {
  return (
    <li className="relative pl-8">
      {/* Titik timeline */}
      <span className="absolute left-0 top-1.5 flex size-3.5 items-center justify-center">
        <span className="size-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
      </span>
      <span className="absolute left-[6.5px] top-5 h-[calc(100%-1rem)] w-px bg-border" aria-hidden />

      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium leading-snug">{title}</h3>
          {badge && (
            <Badge variant="outline" className="h-4 px-1.5 text-[10px] uppercase tracking-wide">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {subtitle}
          {period && <span className="text-xs"> · {period}</span>}
        </p>
        {description && <p className="text-sm text-muted-foreground/80">{description}</p>}
      </div>
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
    <section id="pengalaman" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Perjalanan"
        title="Pengalaman & Pendidikan"
        description="Rekam jejak magang, organisasi, dan pendidikan yang membentuk saya."
      />

      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <BriefcaseIcon className="size-4 text-primary" />
            <h3 className="text-sm font-medium uppercase tracking-wide">Pengalaman</h3>
          </div>
          {experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada pengalaman.</p>
          ) : (
            <ul className="space-y-6">
              {experiences.map((e) => (
                <TimelineItem
                  key={e.id}
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
          <div className="flex items-center gap-2 text-foreground">
            <GraduationCapIcon className="size-4 text-primary" />
            <h3 className="text-sm font-medium uppercase tracking-wide">Pendidikan</h3>
          </div>
          {education.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada data pendidikan.</p>
          ) : (
            <ul className="space-y-6">
              {education.map((d) => (
                <TimelineItem
                  key={d.id}
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
