"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Pembungkus animasi "muncul saat di-scroll".
 * - Bagian yang sudah berada di layar saat halaman dibuka langsung tampil
 *   (tanpa berkedip).
 * - Bagian di bawah layar mulai tersembunyi, lalu fade + naik ke posisinya
 *   begitu masuk viewport.
 * - Hormat `prefers-reduced-motion` (nonaktif via kelas motion-reduce).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Tunda transisi (ms) untuk efek muncul berurutan. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sudah terlihat di layar saat mount? Tampilkan langsung.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${className} transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
