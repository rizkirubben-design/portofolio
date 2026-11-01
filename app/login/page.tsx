import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full w-full items-center justify-center px-4 py-24">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LogInIcon className="size-5" />
          </div>
          <CardTitle className="text-lg">Masuk Admin</CardTitle>
          <p className="text-sm text-muted-foreground">
            Gunakan kredensial admin yang sudah ditentukan.
          </p>
        </CardHeader>
        <CardContent>
          <AuthForm />
          <Link
            href="/"
            className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground"
          >
            ← Kembali ke beranda
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
