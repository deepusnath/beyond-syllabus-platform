/*
 * The poster's dominant graphic: a thick purple ribbon that enters from
 * the top edge, sweeps into the Purple Movement "P" loop, and drops its
 * stem off the bottom edge — with the dotted ring rotating slowly inside
 * the loop's counter. Purely decorative (aria-hidden).
 */
export function PosterMotif({ className }: { className?: string }) {
  const dots = 24;
  const ring = Array.from({ length: dots }, (_, i) => {
    const a = (i / dots) * Math.PI * 2;
    return { x: 340 + 100 * Math.cos(a), y: 630 + 100 * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 640 1000" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="ribbon" x1="640" y1="0" x2="60" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c766ef" />
          <stop offset="0.55" stopColor="#9c34d0" />
          <stop offset="1" stopColor="#7a24ad" />
        </linearGradient>
      </defs>
      {/* Entry ribbon from the top edge, sweeping toward the loop */}
      <path
        d="M553 -80 L553 210 C553 360 460 470 360 520"
        stroke="url(#ribbon)"
        strokeWidth="150"
        strokeLinejoin="round"
      />
      {/* Stem descending off the bottom edge, tangent to the loop's left */}
      <path d="M210 620 L210 1080" stroke="url(#ribbon)" strokeWidth="150" />
      {/* The loop */}
      <circle cx="340" cy="630" r="205" fill="url(#ribbon)" />
      <circle cx="340" cy="630" r="130" fill="var(--color-paper)" />
      {/* Dotted ring in the counter, rotating extremely slowly */}
      <g
        className="animate-spin-slowest"
        style={{ transformOrigin: "340px 630px" }}
        fill="var(--color-purple)"
      >
        {ring.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={7} />
        ))}
      </g>
    </svg>
  );
}

/** Standalone dotted circle from the poster — rotates extremely slowly. */
export function DottedRing({
  className,
  dots = 22,
}: {
  className?: string;
  dots?: number;
}) {
  const points = Array.from({ length: dots }, (_, i) => {
    const a = (i / dots) * Math.PI * 2;
    return { x: 50 + 42 * Math.cos(a), y: 50 + 42 * Math.sin(a) };
  });
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={`${className ?? ""} animate-spin-slowest`}>
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.6} fill="currentColor" />
      ))}
    </svg>
  );
}
