import { MailIcon } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/site/brand-icons";

export type SocialLink = {
  kind: "github" | "linkedin" | "instagram" | "email";
  url: string;
  label: string;
};

export function socialLinks(s: {
  email: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
}): SocialLink[] {
  const links: SocialLink[] = [];
  if (s.github_url) links.push({ kind: "github", url: s.github_url, label: "GitHub" });
  if (s.linkedin_url) links.push({ kind: "linkedin", url: s.linkedin_url, label: "LinkedIn" });
  if (s.instagram_url) links.push({ kind: "instagram", url: s.instagram_url, label: "Instagram" });
  if (s.email) links.push({ kind: "email", url: `mailto:${s.email}`, label: "Email" });
  return links;
}

export function socialIcon(kind: SocialLink["kind"]) {
  switch (kind) {
    case "github":
      return <GithubIcon />;
    case "linkedin":
      return <LinkedinIcon />;
    case "instagram":
      return <InstagramIcon />;
    default:
      return <MailIcon />;
  }
}
