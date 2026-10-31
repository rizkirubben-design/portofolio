"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { upsertEducationAction, deleteEducationAction } from "@/lib/actions/content";
import type { Education } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

export function EducationManager({ rows }: { rows: Education[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [submitting, startSaving] = useTransition();
  const [, startManaged] = useTransition();

  function openNew() { setEditing(null); setOpen(true); }
  function openEdit(e: Education) { setEditing(e); setOpen(true); }

  function onSubmit(fd: FormData) {
    startSaving(async () => {
      const res = await upsertEducationAction({}, fd);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing ? "Pendidikan diperbarui." : "Pendidikan ditambahkan.");
        setOpen(false);
        setEditing(null);
      }
    });
  }

  function onDelete() {
    if (!deleteTarget) return;
    startManaged(async () => {
      const res = await deleteEducationAction({}, toForm({ id: deleteTarget.id }));
      if (res.error) toast.error(res.error);
      else toast.success("Pendidikan dihapus.");
      setDeleteTarget(null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Pendidikan</h1>
          <p className="text-sm text-muted-foreground">Riwayat pendidikan formal.</p>
        </div>
        <Button onClick={openNew}>
          <PlusIcon className="size-4" /> Tambah
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Belum ada data pendidikan.
        </p>
      ) : (
        <div className="rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institusi</TableHead>
                <TableHead className="hidden sm:table-cell">Jurusan</TableHead>
                <TableHead className="hidden md:table-cell">Periode</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="max-w-40">
                    <div className="truncate font-medium">{d.institution}</div>
                    <div className="truncate text-xs text-muted-foreground">{d.major}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{d.major}</TableCell>
                  <TableCell className="hidden md:table-cell">{d.period}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" aria-label="Aksi">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onSelect={() => openEdit(d)}>
                          <PencilIcon className="size-4" /> Ubah
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(d)}>
                          <TrashIcon className="size-4" /> Hapus
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Ubah pendidikan" : "Pendidikan baru"}</DialogTitle>
            <DialogDescription>Informasi pendidikan formal.</DialogDescription>
          </DialogHeader>
          <form action={onSubmit} key={editing?.id ?? "new"} className="flex flex-col gap-3">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="space-y-1.5">
              <Label htmlFor="d-inst">Institusi *</Label>
              <Input id="d-inst" name="institution" defaultValue={editing?.institution} placeholder="Universitas X" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-major">Jurusan *</Label>
              <Input id="d-major" name="major" defaultValue={editing?.major} placeholder="S1 Informatika" required />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-1.5">
                <Label htmlFor="d-period">Periode</Label>
                <Input id="d-period" name="period" defaultValue={editing?.period} placeholder="2021 – 2025" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d-order">Urutan</Label>
                <Input id="d-order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className="sm:w-20" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-desc">Deskripsi</Label>
              <Textarea id="d-desc" name="description" defaultValue={editing?.description} rows={3} />
            </div>
            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data pendidikan ini?</AlertDialogTitle>
            <AlertDialogDescription>{deleteTarget?.institution} — {deleteTarget?.major}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); onDelete(); }}>
              <TrashIcon className="size-4" /> Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
