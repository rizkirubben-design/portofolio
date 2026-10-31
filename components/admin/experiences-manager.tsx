"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { upsertExperienceAction, deleteExperienceAction } from "@/lib/actions/content";
import type { Experience } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const kindLabel: Record<Experience["kind"], string> = {
  magang: "Magang",
  organisasi: "Organisasi",
  pekerjaan: "Pekerjaan",
};

export function ExperiencesManager({ rows }: { rows: Experience[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [kind, setKind] = useState<Experience["kind"]>("magang");
  const [submitting, startSaving] = useTransition();
  const [, startManaged] = useTransition();

  function openNew() {
    setEditing(null);
    setKind("magang");
    setOpen(true);
  }
  function openEdit(e: Experience) {
    setEditing(e);
    setKind(e.kind);
    setOpen(true);
  }

  function onSubmit(fd: FormData) {
    fd.set("kind", kind);
    startSaving(async () => {
      const res = await upsertExperienceAction({}, fd);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing ? "Pengalaman diperbarui." : "Pengalaman ditambahkan.");
        setOpen(false);
        setEditing(null);
      }
    });
  }

  function onDelete() {
    if (!deleteTarget) return;
    startManaged(async () => {
      const res = await deleteExperienceAction({}, toForm({ id: deleteTarget.id }));
      if (res.error) toast.error(res.error);
      else toast.success("Pengalaman dihapus.");
      setDeleteTarget(null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Pengalaman</h1>
          <p className="text-sm text-muted-foreground">Magang, organisasi, dan pekerjaan yang pernah dijalani.</p>
        </div>
        <Button onClick={openNew}>
          <PlusIcon className="size-4" /> Tambah
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Belum ada pengalaman.
        </p>
      ) : (
        <div className="rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posisi</TableHead>
                <TableHead className="hidden sm:table-cell">Organisasi</TableHead>
                <TableHead className="hidden md:table-cell">Jenis</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="max-w-40">
                    <div className="truncate font-medium">{e.position}</div>
                    <div className="truncate text-xs text-muted-foreground">{e.period}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{e.org_name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {kindLabel[e.kind]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" aria-label="Aksi">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onSelect={() => openEdit(e)}>
                          <PencilIcon className="size-4" /> Ubah
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(e)}>
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
            <DialogTitle>{editing ? "Ubah pengalaman" : "Pengalaman baru"}</DialogTitle>
            <DialogDescription>Magang, organisasi, atau pekerjaan.</DialogDescription>
          </DialogHeader>
          <form action={onSubmit} key={editing?.id ?? "new"} className="flex flex-col gap-3">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Jenis</Label>
                <Select value={kind} onValueChange={(v) => setKind(v as Experience["kind"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="magang">Magang</SelectItem>
                    <SelectItem value="organisasi">Organisasi</SelectItem>
                    <SelectItem value="pekerjaan">Pekerjaan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="e-order">Urutan</Label>
                <Input id="e-order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-pos">Posisi *</Label>
              <Input id="e-pos" name="position" defaultValue={editing?.position} placeholder="Frontend Intern" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-org">Organisasi / Perusahaan *</Label>
              <Input id="e-org" name="org_name" defaultValue={editing?.org_name} placeholder="Nama org" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-period">Periode</Label>
              <Input id="e-period" name="period" defaultValue={editing?.period} placeholder="Jun 2024 – Des 2024" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-desc">Deskripsi</Label>
              <Textarea id="e-desc" name="description" defaultValue={editing?.description} rows={3} />
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
            <AlertDialogTitle>Hapus pengalaman ini?</AlertDialogTitle>
            <AlertDialogDescription>{deleteTarget?.position} — {deleteTarget?.org_name}</AlertDialogDescription>
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
