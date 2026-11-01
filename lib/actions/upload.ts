"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { hasAdminSession } from "@/lib/admin-session";

export type UploadState = { url?: string; error?: string };

/** Batas ukuran 4 MB. */
const MAX_BYTES = 4 * 1024 * 1024;

/** MIME yang diizinkan → ekstensi file untuk path storage. */
const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

/**
 * Unggah gambar ke Supabase Storage (bucket PUBLIC "media").
 * Mengembalikan URL publik yang dipakai form untuk mengisi kolom *_url.
 * Tulis hanya lewat service role — pengunjung tidak bisa mengunggah.
 */
export async function uploadImageAction(
  _prev: UploadState,
  formData: FormData
): Promise<UploadState> {
  try {
    if (!(await hasAdminSession())) {
      redirect("/login");
    }

    const service = createServiceClient();
    if (!service) {
      return {
        error:
          "SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local. Dibutuhkan untuk mengunggah foto.",
      };
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Pilih gambar terlebih dahulu." };
    }

    const ext = ALLOWED.get(file.type);
    if (!ext) {
      return { error: "Format harus JPG, PNG, WEBP, GIF, atau AVIF." };
    }
    if (file.size > MAX_BYTES) {
      return { error: "Ukuran file maksimal 4 MB." };
    }

    const folderRaw = String(formData.get("folder") ?? "lainnya");
    const folder =
      folderRaw.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "lainnya";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await service.storage.from("media").upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      return { error: `Gagal mengunggah: ${error.message}` };
    }

    const { data } = service.storage.from("media").getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (e) {
    // Biarkan redirect()/notFound() dari framework tetap bekerja.
    unstable_rethrow(e);
    return { error: e instanceof Error ? e.message : "Gagal mengunggah." };
  }
}
