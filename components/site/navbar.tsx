"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuIcon, XIcon } from "lucide-react";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Tentang", href: "#tentang" },
  { label: "Keahlian", href: "#keahlian" },
  { label: "Proyek", href: "#proyek" },
  { label: "Pengalaman", href: "#pengalaman" },
  { label: "Kontak", href: "#kontak" },
];

export function Navbar({
  displayName,
  avatarUrl,
}: {
  displayName: string;
  avatarUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const initial = displayName.trim().charAt(0).toUpperCase() || "P";

  return (
    <header className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6">
      <nav className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-primary/20 bg-background/90 py-2.5 pl-4 pr-3 shadow-lg shadow-primary/5 backdrop-blur-xl">
        <a href="#beranda" className="flex items-center gap-3 group">
          <span className="relative flex size-9 items-center justify-center overflow-hidden andalusia-arch rounded-b-md bg-primary/10 border border-primary/30 text-sm font-heading font-bold text-primary group-hover:border-primary transition-colors">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`Avatar ${displayName || ""}`.trim()}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              initial
            )}
          </span>
          <div className="flex flex-col">
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              {displayName || "Portofolio"}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-serif text-accent">
              <span>ديوان الإبداع</span>
              <span className="text-primary/40">✦</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-sans">Al-Andalus</span>
            </span>
          </div>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-xl px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className="flex size-9 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-muted md:hidden"
        >
          {open ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
        </button>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-5xl md:hidden">
          <div className="flex flex-col rounded-2xl border border-primary/20 bg-background/95 p-2.5 shadow-xl shadow-primary/10 backdrop-blur-xl">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <span>{item.label}</span>
                <span className="text-xs text-accent">✦</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export { socialLinks, socialIcon } from "@/components/site/social";
export type { SocialLink } from "@/components/site/social";
