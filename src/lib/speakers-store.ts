import speakersJson from "../../content/speakers.json";
import type { Speaker, StakeholderGroup } from "@/lib/types";

/*
 * Speaker records live in content/speakers.json so the admin write path
 * (see /api/admin) can update them programmatically. This module is the
 * only reader: it validates the JSON at build/module-load time and fails
 * loudly — a malformed file must break the build, never silently drop
 * a person.
 */

const groups: StakeholderGroup[] = [
  "students",
  "educators",
  "researchers",
  "industry",
  "policymakers",
  "community",
  "global",
];

function fail(index: number, message: string): never {
  throw new Error(`content/speakers.json entry ${index}: ${message}`);
}

function validateSpeaker(raw: unknown, index: number): Speaker {
  if (typeof raw !== "object" || raw === null) fail(index, "not an object");
  const s = raw as Record<string, unknown>;

  for (const field of ["slug", "name", "role", "organisation", "category"] as const) {
    if (typeof s[field] !== "string" || (s[field] as string).trim() === "") {
      fail(index, `missing or empty required field "${field}"`);
    }
  }
  if (!/^[a-z0-9-]+$/.test(s.slug as string)) fail(index, `invalid slug "${s.slug}"`);
  if (!groups.includes(s.category as StakeholderGroup)) {
    fail(index, `unknown category "${s.category}"`);
  }
  for (const field of ["bio", "keyIdea", "photo", "videoTimestampUrl"] as const) {
    if (s[field] !== undefined && typeof s[field] !== "string") {
      fail(index, `field "${field}" must be a string when present`);
    }
  }
  for (const field of ["sessionIds", "conversationSlugs"] as const) {
    const v = s[field];
    if (!Array.isArray(v) || v.some((x) => typeof x !== "string")) {
      fail(index, `field "${field}" must be an array of strings`);
    }
  }
  return s as unknown as Speaker;
}

function load(): Speaker[] {
  if (!Array.isArray(speakersJson)) {
    throw new Error("content/speakers.json: root must be an array");
  }
  const list = speakersJson.map(validateSpeaker);
  const slugs = new Set<string>();
  for (const s of list) {
    if (slugs.has(s.slug)) throw new Error(`content/speakers.json: duplicate slug "${s.slug}"`);
    slugs.add(s.slug);
  }
  return list;
}

export const speakers: Speaker[] = load();
