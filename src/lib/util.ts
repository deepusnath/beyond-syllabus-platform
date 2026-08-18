/** Drops undefined lookups: present(slugs.map(getThing)) — typed, in one place. */
export function present<T>(items: (T | undefined | null)[]): T[] {
  return items.filter((item): item is T => item !== undefined && item !== null);
}

/** URL-safe slug from a display name. Shared by server validation and form UI. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Points evenly spaced on a circle, at fixed precision so SSR and client renders match. */
export function ringPoints(
  count: number,
  cx: number,
  cy: number,
  r: number,
): { x: string; y: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return { x: (cx + r * Math.cos(a)).toFixed(2), y: (cy + r * Math.sin(a)).toFixed(2) };
  });
}
