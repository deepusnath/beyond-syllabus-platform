import {
  VIT_INK,
  VIT_PURPLE,
  VIT_SIZE,
  vitruvian,
  vitruvianDots,
} from "@/lib/vitruvian";

/*
 * The Vitruvian Student as an inline SVG. Decorative by default; pass a
 * title for accessible contexts.
 */
export function VitruvianMark({
  className,
  title,
  stroke = 10,
}: {
  className?: string;
  title?: string;
  stroke?: number;
}) {
  const { square, head, circle } = vitruvian;
  return (
    <svg
      viewBox={`0 0 ${VIT_SIZE} ${VIT_SIZE}`}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect
        x={square.x}
        y={square.y}
        width={square.w}
        height={square.h}
        fill="none"
        stroke={VIT_INK}
        strokeWidth={stroke * 0.7}
      />
      {vitruvianDots().map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={circle.dotR} fill={VIT_PURPLE} />
      ))}
      <circle
        cx={head.cx}
        cy={head.cy}
        r={head.r}
        fill="none"
        stroke={VIT_INK}
        strokeWidth={stroke}
      />
      <g fill="none" stroke={VIT_INK} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        {vitruvian.inkPaths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="none" stroke={VIT_PURPLE} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
        {vitruvian.purplePaths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
