import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import type { Skill } from "@/lib/types";

export function Skills({ skills }: { skills: Skill[] }) {
  const grouped = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = grouped.get(skill.category) ?? [];
    list.push(skill);
    grouped.set(skill.category, list);
  }
  const categories = [...grouped.entries()];

  return (
    <section id="keahlian" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Keahlian"
        title="Tech stack & kemampuan"
        description="Peralatan yang saya gunakan untuk membangun sesuatu."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada keahlian. Tambahkan lewat dashboard admin.
          </p>
        ) : (
          categories.map(([category, list], i) => (
            <Reveal key={category} delay={(i % 3) * 90} className="h-full">
              <div className="h-full space-y-4 rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/30">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {list.map((skill) => (
                    <Badge key={skill.id} variant="outline" className="h-auto px-3 py-1.5 text-sm">
                      {skill.name}
                      {skill.level ? (
                        <span className="font-normal text-muted-foreground"> · {skill.level}</span>
                      ) : null}
                    </Badge>
                  ))}
                </div>
              </div>
            </Reveal>
          ))
        )}
      </div>
    </section>
  );
}
