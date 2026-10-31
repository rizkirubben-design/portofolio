import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-session";
import { AdminShell } from "@/components/admin/admin-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin",
};

export const instant = false;

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!(await hasAdminSession())) {
    redirect("/login");
  }

  return (
    <AdminShell user={{ name: "Admin", email: null }}>
      {children}
    </AdminShell>
  );
}
