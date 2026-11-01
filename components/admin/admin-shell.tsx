"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  FolderGit2Icon,
  GraduationCapIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
  SparklesIcon,
} from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboardIcon },
  { href: "/admin/proyek", label: "Proyek", icon: FolderGit2Icon },
  { href: "/admin/pengalaman", label: "Pengalaman", icon: BriefcaseBusinessIcon },
  { href: "/admin/pendidikan", label: "Pendidikan", icon: GraduationCapIcon },
  { href: "/admin/keahlian", label: "Keahlian", icon: SparklesIcon },
  { href: "/admin/profil", label: "Profil", icon: SettingsIcon },
] as const;

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string | null };
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  function renderNav(variant: "desktop" | "mobile") {
    return nav.map((item) => {
      const Icon = item.icon;
      const classes =
        variant === "desktop"
          ? cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          : cn(
              "flex items-center gap-2 px-3 py-2 text-sm",
              isActive(item.href) && "text-primary"
            );
      return (
        <Link key={item.href} href={item.href} className={classes}>
          <Icon className="size-4" />
          {item.label}
        </Link>
      );
    });
  }

  return (
    <div className="flex min-h-full w-full">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-border/60 bg-sidebar md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
            P
          </span>
          <span className="text-sm font-semibold">Portofolio Admin</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">{renderNav("desktop")}</nav>
        <div className="border-t border-border/60 p-3">
          <form action={signOutAction}>
            <Button type="submit" variant="outline" size="sm" className="w-full justify-start gap-2">
              <LogOutIcon className="size-4" />
              Keluar
            </Button>
          </form>
        </div>
      </aside>

      <div className="w-full md:pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md">
          {/* Menu mobile */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-sm" aria-label="Menu navigasi">
                  <MenuIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Navigasi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {renderNav("mobile")}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/" target="_blank">
                <ExternalLinkIcon className="size-4" />
                Lihat Situs
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {(user.name || user.email || "A").charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-32 truncate">{user.name || "Admin"}</span>
                  <ChevronDownIcon className="size-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" target="_blank">
                    <ExternalLinkIcon className="size-4" />
                    Lihat situs publik
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild variant="destructive">
                  <form action={signOutAction} className="w-full">
                    <button type="submit" className="flex items-center gap-2">
                      <LogOutIcon className="size-4" />
                      Keluar
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
