import Link from "next/link";

/** Small condensed uppercase label with a leading purple tick — poster kickers. */
export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`kicker flex items-center gap-3 text-ink-soft ${className ?? ""}`}>
      <span aria-hidden className="inline-block h-[2px] w-8 bg-purple" />
      {children}
    </p>
  );
}

/** Poster-style solid chip (mint time chip / orange live chip / purple date). */
export function Chip({
  tone = "purple",
  children,
  className,
}: {
  tone?: "purple" | "mint" | "signal" | "ink" | "outline";
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    purple: "bg-purple text-white",
    mint: "bg-mint text-ink",
    signal: "bg-signal text-white",
    ink: "bg-ink text-paper",
    outline: "border-2 border-ink text-ink",
  } as const;
  return (
    <span
      className={`condensed inline-flex items-center gap-2 rounded-chip px-3 py-1 text-sm font-semibold tracking-wide ${tones[tone]} ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

/** Marks fictional seed content, everywhere it appears. */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={`condensed inline-flex items-center rounded-chip border border-dashed border-ink-soft/60 px-2 py-0.5 text-[0.65rem] font-medium tracking-[0.15em] text-ink-soft ${className ?? ""}`}
      title="Fictional seed content used to develop the platform — not a confirmed record."
    >
      Sample content
    </span>
  );
}

/** Oversized section heading in the poster voice. */
export function SectionHeading({
  kicker,
  title,
  lede,
  className,
}: {
  kicker: string;
  title: string;
  lede?: string;
  className?: string;
}) {
  return (
    <header className={`max-w-3xl ${className ?? ""}`}>
      <Kicker>{kicker}</Kicker>
      <h2 className="display mt-4 text-5xl sm:text-6xl lg:text-7xl">{title}</h2>
      {lede ? <p className="mt-6 text-lg leading-relaxed text-ink-soft">{lede}</p> : null}
    </header>
  );
}

/** Primary CTA — hard-edged, black or purple, poster-style. */
export function CtaLink({
  href,
  children,
  tone = "ink",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "purple" | "outline" | "white";
  className?: string;
}) {
  const tones = {
    ink: "bg-ink text-paper hover:bg-purple-deep",
    purple: "ribbon-gradient text-white hover:brightness-110",
    outline: "border-2 border-ink text-ink hover:bg-ink hover:text-paper",
    white: "bg-paper text-ink hover:bg-purple-soft",
  } as const;
  return (
    <Link
      href={href}
      className={`condensed inline-flex items-center gap-3 px-7 py-4 text-base font-semibold tracking-[0.1em] transition-colors ${tones[tone]} ${className ?? ""}`}
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

/** The recurring date strip: AUG 15 → SEP 05 → OCT 02 → NOV 14 → DEC */
export function DateStrip({ className, linked = false }: { className?: string; linked?: boolean }) {
  const dates = ["AUG 15", "SEP 05", "OCT 02", "NOV 14", "DEC"];
  const strip = (
    <span className="condensed inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold tracking-[0.18em]">
      {dates.map((d, i) => (
        <span key={d} className="inline-flex items-center gap-3">
          {i > 0 && <span aria-hidden className="text-purple">→</span>}
          <span>{d}</span>
        </span>
      ))}
    </span>
  );
  if (linked) {
    return (
      <Link href="/journey" className={`text-ink hover:text-purple-deep ${className ?? ""}`}>
        {strip}
      </Link>
    );
  }
  return <div className={className}>{strip}</div>;
}
