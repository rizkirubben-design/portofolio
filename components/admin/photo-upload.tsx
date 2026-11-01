"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageIcon, Loader2Icon, TrashIcon, UploadIcon } from "lucide-react";
import { uploadImageAction, type UploadState } from "@/lib/actions/upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * Kridensial unggah foto: tombol pilih file → unggah ke Supabase Storage →
 * URL publiknya diisi ke field tersembunyi `name` sehingga form pengirim
 * (tambah/ubah proyek, pengaturan profil) tetap menyimpan *_url seperti biasa.
 */
export function PhotoUpload({
  name,
  initial = "",
  folder = "lainnya",
  label,
}: {
  /** Nama field form (mis. "avatar_url" / "image_url"). */
  name: string;
  /** URL awal (data lama) untuk pratinjau saat mengubah. */
  initial?: string;
  /** Folder penyimpanan di bucket "media" (mis. "avatar", "proyek"). */
  folder?: string;
  label?: string;
}) {
  const [url, setUrl] = useState(initial);
  const [uploading, startUpload] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function pickAndUpload(file: File) {
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);

    startUpload(async () => {
      const res: UploadState = await uploadImageAction({}, fd);
      if (res.error) {
        toast.error(res.error);
      } else if (res.url) {
        setUrl(res.url);
        toast.success("Foto berhasil diunggah.");
      }
    });
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {/* Nilai akhir yang ikut ter-submit bersama form induk. */}
      <input type="hidden" name={name} value={url} />

      <div className="flex items-center gap-3">
        {url ? (
          <Image
            src={url}
            alt="Pratinjau foto"
            width={64}
            height={64}
            unoptimized
            className="size-16 rounded-lg border border-border object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
            <ImageIcon className="size-5" />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <UploadIcon />
            )}
            {uploading ? "Mengunggah..." : "Unggah"}
          </Button>
          {url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-destructive hover:text-destructive"
              onClick={() => setUrl("")}
            >
              <TrashIcon className="size-3.5" />
              Hapus
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        JPG, PNG, WEBP, GIF, atau AVIF — maksimal 4 MB.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = ""; // agar file yang sama bisa dipilih lagi
          if (file) pickAndUpload(file);
        }}
      />
    </div>
  );
}
