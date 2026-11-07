import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Marcellus, Amiri } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans-base",
  subsets: ["latin"],
});

const andalusiaHeading = Marcellus({
  variable: "--font-andalusia",
  weight: "400",
  subsets: ["latin"],
});

const amiriFont = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portofolio",
    template: "%s · Portofolio",
  },
  description: "Portofolio pribadi — proyek, pengalaman, dan keahlian.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${sansFont.variable} ${andalusiaHeading.variable} ${amiriFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
