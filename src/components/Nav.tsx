"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLiveStatus } from "@/components/useLiveStatus";

const primary = [
  { href: "/journey", label: "Journey" },
  { href: "/voices", label: "Voices" },
  { href: "/commons", label: "Commons" },
  { href: "/prototypes", label: "Prototypes" },
  { href: "/outcomes", label: "Outcomes" },
];

const secondary = [
  { href: "/conversations", label: "Conversations" },
  { href: "/ideas", label: "Ideas" },
  { href: "/participate", label: "Participate" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { status: live } = useLiveStatus();
  const isLive = live?.state === "live";

  // Close the full-screen menu on navigation (state adjustment during render).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  // Lock page scroll while the full-screen menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    // No backdrop-filter on the header: it would create a containing block
    // that traps the fixed full-screen mobile menu inside the 64px bar.
    <header className="sticky top-0 z-50 border-b border-purple-line bg-paper">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="display text-xl leading-none tracking-tight text-ink">
          Beyond<span className="text-purple"> Syllabus</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`condensed text-sm font-medium tracking-[0.14em] transition-colors hover:text-purple-deep ${
                pathname.startsWith(item.href) ? "text-purple-deep" : "text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/live"
            className={`condensed inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-[0.12em] text-white transition-colors ${
              isLive ? "bg-signal" : "bg-ink hover:bg-purple-deep"
            }`}
          >
            {isLive && <span aria-hidden className="live-dot h-2 w-2 rounded-full bg-white" />}
            {isLive ? "Live Now" : "Watch Live"}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="condensed flex items-center gap-2 text-sm font-semibold tracking-[0.14em] lg:hidden"
        >
          {open ? "Close" : "Menu"}
          <span aria-hidden className="flex flex-col gap-1">
            <span className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-ink ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-ink transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {/* Full-screen mobile navigation */}
      {open && (
        <div id="mobile-menu" className="fixed inset-0 top-16 z-40 flex flex-col overflow-y-auto bg-paper lg:hidden">
          <div className="flex flex-1 flex-col justify-between px-6 py-10">
            <ul className="space-y-2">
              {primary.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="display block py-2 text-5xl text-ink transition-colors hover:text-purple"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/live"
                  className={`condensed inline-flex items-center gap-3 px-6 py-4 text-lg font-semibold tracking-[0.12em] text-white ${
                    isLive ? "bg-signal" : "bg-ink"
                  }`}
                >
                  {isLive && <span aria-hidden className="live-dot h-2.5 w-2.5 rounded-full bg-white" />}
                  {isLive ? "Live Now" : "Watch Live"}
                </Link>
              </li>
            </ul>
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-purple-line pt-8">
              {secondary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="condensed text-sm font-medium tracking-[0.16em] text-ink-soft hover:text-purple-deep"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Desktop secondary menu row */}
      <div className="hidden border-t border-purple-line/60 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-1.5">
          {secondary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`condensed text-[0.7rem] font-medium tracking-[0.18em] transition-colors hover:text-purple-deep ${
                pathname.startsWith(item.href) ? "text-purple-deep" : "text-ink-soft"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
