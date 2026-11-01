"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  FolderPlusIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { upsertProjectAction, deleteProjectAction, setProjectPublishedAction } from "@/lib/actions/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhotoUpload } from "@/components/admin/photo-upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function toForm(fields: Record<string, string | number | boolean>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, String(v));
  return fd;
}

export function ProjectsManager({ rows }: { rows: Project[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [submitting, startSaving] = useTransition();
  const [, startManaged] = useTransition();

  function onSubmit(fd: FormData) {
    startSaving(async () => {
      const res = await upsertProjectAction({}, fd);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(editing ? "Proyek diperbarui." : "Proyek ditambahkan.");
        setOpen(false);
        setEditing(null);
      }
    });
  }

  function onDelete() {
    if (!deleteTarget) return;
    startManaged(async () => {
      const res = await deleteProjectAction({}, toForm({ id: deleteTarget.id }));
      if (res.error) toast.error(res.error);
      else toast.success("Proyek dihapus.");
      setDeleteTarget(null);
    });
  }

  function onTogglePublished(p: Project, value: boolean) {
    startManaged(async () => {
      const res = await setProjectPublishedAction(
        {},
        toForm({ id: p.id, published: value })
      );
      if (res.error) toast.error(res.error);
      else toast.success(value ? "Proyek dipublikasikan." : "Proyek disembunyikan.");
    });
  }

  function openNew() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(p: Project) {
    setEditing(p);
    setOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Proyek</h1>
          <p className="text-sm text-muted-foreground">Kelola daftar proyek yang tampil di halaman utama.</p>
        </div>
        <Button onClick={openNew}>
          <FolderPlusIcon className="size-4" />
          Tambah
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Belum ada proyek. Klik &ldquo;Tambah&rdquo; untuk membuat proyek pertama.
        </p>
      ) : (
        <div className="rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyek</TableHead>
                <TableHead className="hidden sm:table-cell">Tech</TableHead>
                <TableHead className="text-center">Tampil</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-56">
                    <div className="truncate font-medium">{p.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {p.description || "Tanpa deskripsi"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex max-w-48 flex-wrap gap-1">
                      {p.tech.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                      {p.tech.length > 3 && (
                        <Badge variant="secondary" className="text-[10px]">
                          +{p.tech.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={p.is_published}
                      onCheckedChange={(v) => onTogglePublished(p, v)}
                      aria-label={`Publikasi ${p.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" aria-label="Aksi">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onSelect={() => openEdit(p)}>
                          <PencilIcon className="size-4" />
                          Ubah
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(p)}>
                          <TrashIcon className="size-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog tambah/ubah */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Ubah proyek" : "Proyek baru"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui detail proyek." : "Isi detail proyek. Semua kecuali judul opsional."}
            </DialogDescription>
          </DialogHeader>

          <form action={onSubmit} key={editing?.id ?? "new"} className="flex flex-col gap-3">
            {editing && <input type="hidden" name="id" value={editing.id} />}

            <div className="space-y-1.5">
              <Label htmlFor="p-title">Judul *</Label>
              <Input id="p-title" name="title" defaultValue={editing?.title} placeholder="Nama proyek" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-desc">Deskripsi</Label>
              <Textarea
                id="p-desc"
                name="description"
                defaultValue={editing?.description}
                placeholder="Ringkasan singkat proyek..."
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-tech">Tech (pisahkan dengan koma)</Label>
              <Input
                id="p-tech"
                name="tech"
                defaultValue={editing?.tech.join(", ")}
                placeholder="Next.js, Tailwind, Supabase"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="p-repo">URL Repo</Label>
                <Input id="p-repo" name="repo_url" defaultValue={editing?.repo_url} placeholder="https://github.com/..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-demo">URL Demo</Label>
                <Input id="p-demo" name="demo_url" defaultValue={editing?.demo_url} placeholder="https://..." />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <PhotoUpload
                name="image_url"
                initial={editing?.image_url ?? ""}
                folder="proyek"
                label="Gambar Proyek"
              />
              <div className="space-y-1.5">
                <Label htmlFor="p-order">Urutan</Label>
                <Input id="p-order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className="sm:w-20" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <div className="space-y-0.5">
                <Label htmlFor="p-published" className="cursor-pointer">Tampilkan di situs</Label>
                <p className="text-xs text-muted-foreground">Proyek tidak tampil di halaman publik bila mati.</p>
              </div>
              <Switch id="p-published" name="is_published" defaultChecked={editing?.is_published ?? true} />
            </div>

            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Konfirmasi hapus */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus proyek ini?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.title} akan dihapus permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
            >
              <TrashIcon className="size-4" />
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
