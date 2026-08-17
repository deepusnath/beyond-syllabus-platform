import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Organisers",
  robots: { index: false, follow: false },
};

/* Minimal organiser chrome — deliberately not the public site shell. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b-2 border-ink bg-ink px-4 py-3 text-paper sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <p className="condensed text-sm font-semibold tracking-[0.16em]">
            Beyond Syllabus · Organisers
          </p>
          <Link href="/" className="condensed text-xs tracking-[0.14em] text-paper/70 hover:text-paper">
            ← Public site
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
