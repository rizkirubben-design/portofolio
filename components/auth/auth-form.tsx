"use client";

import { useActionState } from "react";
import { Loader2Icon, LogInIcon } from "lucide-react";
import { signInAction, type AuthFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_EMAIL } from "@/lib/admin-credentials";

const initial: AuthFormState = {};

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function AuthForm() {
  const [state, doSignIn, pending] = useActionState(signInAction, initial);

  return (
    <form action={doSignIn} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={ADMIN_EMAIL}
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>
      <ErrorText message={state.error} />
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2Icon className="animate-spin" /> : <LogInIcon />}
        {pending ? "Memproses..." : "Masuk"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Akses dashboard hanya untuk admin.
      </p>
    </form>
  );
}
