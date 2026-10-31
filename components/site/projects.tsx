import Image from "next/image";
import {
  ExternalLinkIcon,
  FolderIcon,
} from "lucide-react";
import { GithubIcon } from "@/components/site/brand-icons";
import { SectionHeading } from "@/components/site/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="proyek" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Proyek"
        title="Proyek pilihan"
        description="Hasil latihan, kolaborasi, dan eksperimen yang paling saya banggakan."
      />

      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Belum ada proyek yang dipublikasikan. Tambahkan lewat dashboard admin.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="p-0 has-[>a]:transition-transform hover:ring-primary/40">
              <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-linear-to-br from-violet-500/25 to-blue-500/25">
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={`Gambar proyek ${project.title}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 380px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-3xl text-primary/70">
                    <FolderIcon className="size-12" />
                  </div>
                )}
              </div>

              <CardContent className="space-y-2 pt-4">
                <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {project.description || "Tanpa deskripsi."}
                </p>
                {project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[11px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="mt-4 justify-start gap-2">
                {project.repo_url && (
                  <Button asChild variant="outline" size="sm">
                    <a href={project.repo_url} target="_blank" rel="noopener noreferrer">
                      <GithubIcon /> Kode
                    </a>
                  </Button>
                )}
                {project.demo_url && (
                  <Button asChild size="sm">
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon /> Demo
                    </a>
                  </Button>
                )}
                {!project.repo_url && !project.demo_url && (
                  <span className="text-xs text-muted-foreground">Belum ada tautan.</span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
