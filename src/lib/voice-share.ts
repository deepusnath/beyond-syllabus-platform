/* Shared helpers for the personalised /voice share pages. */

/** Display-safe participant name from a URL parameter. Never trusted as markup. */
export function sanitizeName(raw: string | null | undefined): string {
  const cleaned = (raw ?? "").replace(/[^\p{L}\p{N} .'-]/gu, "").trim().slice(0, 40);
  return cleaned || "A new voice";
}
