"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { updateSettingsAction } from "@/lib/actions/content";
import type { SiteSettings } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [submitting, startSaving] = useTransition();

  function onSubmit(fd: FormData) {
    startSaving(async () => {
      const res = await updateSettingsAction({}, fd);
      if (res.error) toast.error(res.error);
      else toast.success("Pengaturan profil tersimpan.");
    });
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="display_name">Nama Tampilan *</Label>
          <Input id="display_name" name="display_name" defaultValue={settings?.display_name ?? ""} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" name="tagline" defaultValue={settings?.tagline ?? ""} placeholder="Mahasiswa Ilmu Komputer — pencinta web dev" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={settings?.bio ?? ""}
          rows={5}
          placeholder="Cerita singkat tentang Anda. Pisahkan paragraf dengan baris kosong."
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="avatar_url">URL Foto / Avatar</Label>
        <Input id="avatar_url" name="avatar_url" defaultValue={settings?.avatar_url ?? ""} placeholder="https://..." />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email Kontak</Label>
        <Input id="email" name="email" type="email" defaultValue={settings?.email ?? ""} placeholder="email@anda.com" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="github_url">URL GitHub</Label>
          <Input id="github_url" name="github_url" defaultValue={settings?.github_url ?? ""} placeholder="https://github.com/..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="linkedin_url">URL LinkedIn</Label>
          <Input id="linkedin_url" name="linkedin_url" defaultValue={settings?.linkedin_url ?? ""} placeholder="https://linkedin.com/in/..." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="instagram_url">URL Instagram</Label>
          <Input id="instagram_url" name="instagram_url" defaultValue={settings?.instagram_url ?? ""} placeholder="https://instagram.com/..." />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}
          {submitting ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>
      </div>
    </form>
  );
}
