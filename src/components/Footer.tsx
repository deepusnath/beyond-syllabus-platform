import Image from "next/image";
import Link from "next/link";
import { getSite } from "@/lib/content";
import { DateStrip } from "@/components/ui";

const columns = [
  {
    title: "The Journey",
    links: [
      { href: "/journey", label: "Journey" },
      { href: "/live", label: "Live" },
      { href: "/voices", label: "Voices" },
      { href: "/participate", label: "Participate" },
    ],
  },
  {
    title: "The Record",
    links: [
      { href: "/conversations", label: "Documentation" },
      { href: "/commons", label: "Capability Commons" },
      { href: "/ideas", label: "Ideas" },
      { href: "/prototypes", label: "Prototypes" },
      { href: "/outcomes", label: "Outcomes" },
    ],
  },
];

export function Footer() {
  const site = getSite();
  const social = site.social.filter((s) => s.url);

  return (
    <footer className="bg-purple-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="display text-4xl sm:text-5xl">
              Beyond<br />
              Syllabus
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Image
                src="/brand/purple-movement.webp"
                alt="The Purple Movement"
                width={132}
                height={38}
                className="h-9 w-auto"
              />
            </div>
            <p className="condensed mt-8 text-sm font-medium leading-relaxed tracking-[0.08em] text-purple-soft/90">
              From protest to prototype.
              <br />
              From problems to possibilities.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="kicker text-purple-bright">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-purple-soft transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <DateStrip className="text-purple-soft" />
          <div className="flex flex-wrap items-center gap-4">
            {social.length > 0 ? (
              social.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  className="condensed text-xs font-medium tracking-[0.16em] text-purple-soft hover:text-white"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {s.label}
                </a>
              ))
            ) : (
              <span className="condensed text-xs font-medium tracking-[0.16em] text-purple-soft/80">
                @purplemovement
              </span>
            )}
          </div>
        </div>
        <p className="mt-6 text-xs text-purple-soft/70">
          Bridge The Gap 4.0 · An initiative of The Purple Movement · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
