"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import { upsertSkillAction, deleteSkillAction } from "@/lib/actions/content";
import type { Skill } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function toForm(fields: Record<string, string | number | boolean>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, String(v));
  return fd;
}

const levels = ["Pemula", "Menengah", "Mahir"];

export function SkillsManager({ rows }: { rows: Skill[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [level, setLevel] = useState<string>("");
  const [submitting, startSaving] = useTransition();
  const [, startManaged] = useTransition();

  function openNew() { setEditing(null); setLevel(""); setOpen(true); }
  function openEdit(s: Skill) { setEditing(s); setLevel(s.level ?? ""); setOpen(true); }

  function onSubmit(fd: FormData) {
    fd.set("level", level);
    startSaving(async () => {
      const res = await upsertSkillAction({}, fd);
      if (res.error) toast.error(res.error);
      else {
        toast.success(editing ? "Keahlian diperbarui." : "Keahlian ditambahkan.");
        setOpen(false);
        setEditing(null);
      }
    });
  }

  function onDelete() {
    if (!deleteTarget) return;
    startManaged(async () => {
      const res = await deleteSkillAction({}, toForm({ id: deleteTarget.id }));
      if (res.error) toast.error(res.error);
      else toast.success("Keahlian dihapus.");
      setDeleteTarget(null);
    });
  }

  // Kelompokkan per kategori
  const grouped = new Map<string, Skill[]>();
  for (const s of rows) {
    const list = grouped.get(s.category) ?? [];
    list.push(s);
    grouped.set(s.category, list);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Keahlian</h1>
          <p className="text-sm text-muted-foreground">Kelompokkan per kategori.</p>
        </div>
        <Button onClick={openNew}>
          <PlusIcon className="size-4" /> Tambah
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Belum ada keahlian.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {[...grouped.entries()].map(([category, list]) => (
            <div key={category} className="rounded-xl border border-border/60 p-4">
              <div className="mb-3 flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                <h3 className="text-sm font-medium uppercase tracking-wide">{category}</h3>
              </div>
              <div className="flex flex-col divide-y divide-border/60">
                {list.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{s.name}</span>
                      {s.level && (
                        <Badge variant="secondary" className="text-[10px]">
                          {s.level}
                        </Badge>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs" aria-label="Aksi">
                          <MoreHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onSelect={() => openEdit(s)}>
                          <PencilIcon className="size-4" /> Ubah
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(s)}>
                          <TrashIcon className="size-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Ubah keahlian" : "Keahlian baru"}</DialogTitle>
            <DialogDescription>Nama keahlian dan kategori.</DialogDescription>
          </DialogHeader>
          <form action={onSubmit} key={editing?.id ?? "new"} className="flex flex-col gap-3">
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="s-name">Nama *</Label>
                <Input id="s-name" name="name" defaultValue={editing?.name} placeholder="React, Python, Figma..." required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-cat">Kategori *</Label>
                <Input id="s-cat" name="category" defaultValue={editing?.category} placeholder="Bahasa Pemrograman" required />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">—</SelectItem>
                    {levels.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-order">Urutan</Label>
                <Input id="s-order" name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
              </div>
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
            <AlertDialogTitle>Hapus keahlian ini?</AlertDialogTitle>
            <AlertDialogDescription>{deleteTarget?.name}</AlertDialogDescription>
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
