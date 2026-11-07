import Image from "next/image";
import {
  ExternalLinkIcon,
  FolderIcon,
} from "lucide-react";
import { GithubIcon } from "@/components/site/brand-icons";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="proyek" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        eyebrow="Al-Ma'ridh · المعرض"
        title="Mahakarya & Diwan Proyek"
        description="Koleksi sistem komputasi, aplikasi web, dan arsitektur digital berdaya guna dan bernilai estetika."
      />

      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Belum ada proyek yang dipublikasikan. Tambahkan lewat dashboard admin.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={(i % 3) * 90} className="h-full">
              <Card className="group h-full flex flex-col justify-between overflow-hidden rounded-3xl border border-primary/20 bg-card/85 p-0 backdrop-blur-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-2xl hover:shadow-primary/10">
                <div>
                  <div className="relative aspect-video w-full overflow-hidden border-b border-border/80 bg-primary/10">
                    {/* Tag mahakarya Andalusia */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-primary/25 bg-background/90 px-3 py-1 text-xs text-accent font-serif backdrop-blur-xs shadow-xs">
                      <span>۞</span>
                      <span>Karya {String(i + 1).padStart(2, "0")}</span>
                    </div>

                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={`Gambar proyek ${project.title}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 380px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-3xl text-primary/70">
                        <FolderIcon className="size-12" />
                      </div>
                    )}
                  </div>

                  <CardContent className="space-y-3 p-5">
                    <CardTitle className="font-heading text-xl font-normal tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                      {project.description || "Tanpa deskripsi spesifikasi."}
                    </p>
                    {project.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tech.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="rounded-lg border border-border/60 bg-muted/60 px-2.5 py-0.5 text-[11px] font-normal"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </div>

                <CardFooter className="justify-start gap-2.5 border-t border-border/60 p-5 pt-3">
                  {project.repo_url && (
                    <Button asChild variant="outline" size="sm" className="rounded-xl text-xs hover:border-accent hover:text-accent">
                      <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                        <GithubIcon className="size-3.5" /> Kode
                      </a>
                    </Button>
                  )}
                  {project.demo_url && (
                    <Button asChild size="sm" className="rounded-xl text-xs shadow-xs px-4">
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon className="size-3.5" /> Demo
                      </a>
                    </Button>
                  )}
                  {!project.repo_url && !project.demo_url && (
                    <span className="text-xs text-muted-foreground">Belum ada tautan.</span>
                  )}
                </CardFooter>
              </Card>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
