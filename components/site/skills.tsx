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
        eyebrow="Baitul Hikmah · المهارات"
        title="Disiplin Ilmu & Instrumen Teknologi"
        description="Peralatan rekayasa, bahasa komputasi, dan arsitektur yang dikuasai dengan dedikasi tinggi."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada keahlian. Tambahkan lewat dashboard admin.
          </p>
        ) : (
          categories.map(([category, list]) => (
            <Reveal key={category} delay={90} className="h-full">
              <div className="group relative h-full flex flex-col justify-between rounded-2xl border border-primary/20 bg-card/85 p-6 backdrop-blur-xs transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-primary/5">
                {/* Header modul berornamen */}
                <div>
                  <div className="flex items-center justify-between border-b border-border/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-accent text-sm">۞</span>
                      <h3 className="font-heading text-lg font-normal tracking-wide text-foreground">
                        {category}
                      </h3>
                    </div>
                    <span className="font-serif text-xs font-bold text-accent">
                      فن
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {list.map((skill) => (
                      <Badge
                        key={skill.id}
                        variant="outline"
                        className="h-auto rounded-xl border-border bg-background/70 px-3 py-1.5 text-xs font-normal transition-all hover:border-accent hover:text-accent hover:shadow-xs"
                      >
                        <span className="text-accent mr-1.5 text-[10px]">✦</span>
                        {skill.name}
                        {skill.level ? (
                          <span className="ml-1 text-[11px] text-muted-foreground">· {skill.level}</span>
                        ) : null}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))
        )}
      </div>
    </section>
  );
}
