import { Badge } from "@/components/ui/badge";
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
    <section id="keahlian" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Keahlian"
        title="Tech stack & kemampuan"
        description="Peralatan yang saya gunakan untuk membangun sesuatu."
      />

      <div className="mt-8 space-y-6">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada keahlian. Tambahkan lewat dashboard admin.
          </p>
        ) : (
          categories.map(([category, list]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
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
          ))
        )}
      </div>
    </section>
  );
}
