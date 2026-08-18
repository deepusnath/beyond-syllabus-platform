import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Speaker, StakeholderGroup } from "@/lib/types";
import { getSessions } from "@/lib/content";
import { CONTENT_REPO, contentToken } from "@/lib/github-content";
import { isStakeholderGroup } from "@/lib/stakeholders";
import { slugify } from "@/lib/util";

/*
 * Shared server-side logic for the organiser Voices API: reading the
 * authoritative speaker list and validating submitted records.
 *
 * The authoritative list is read from the repo HEAD (GitHub) when the
 * content token is configured, NOT from the bundled build-time copy —
 * otherwise two publishes inside one deploy window would clobber each
 * other.
 */

export async function getAuthoritativeSpeakers(): Promise<Speaker[]> {
  const token = contentToken();
  if (token) {
    const { owner, repo, branch } = CONTENT_REPO;
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/content/speakers.json?ref=${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.raw+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      },
    );
    if (!res.ok) throw new Error(`Could not read current speakers (GitHub ${res.status}).`);
    return (await res.json()) as Speaker[];
  }
  const raw = await readFile(path.join(process.cwd(), "content/speakers.json"), "utf-8");
  return JSON.parse(raw) as Speaker[];
}

export interface SpeakerInput {
  slug: string;
  name: string;
  role: string;
  organisation: string;
  category: StakeholderGroup;
  sessionId: string;
  bio?: string;
  keyIdea?: string;
}

export function parseSpeakerInput(form: FormData): SpeakerInput {
  const text = (key: string, max: number, required = true): string => {
    const value = String(form.get(key) ?? "").trim();
    if (required && !value) throw new Error(`"${key}" is required.`);
    if (value.length > max) throw new Error(`"${key}" is too long (max ${max} characters).`);
    return value;
  };

  const name = text("name", 80);
  const slugRaw = text("slug", 60, false) || slugify(name);
  if (!/^[a-z0-9-]+$/.test(slugRaw)) {
    throw new Error("Slug may only contain lowercase letters, numbers and hyphens.");
  }
  const categoryRaw = text("category", 20);
  if (!isStakeholderGroup(categoryRaw)) throw new Error("Unknown stakeholder category.");
  const category: StakeholderGroup = categoryRaw;

  const sessionId = text("sessionId", 40);
  if (!getSessions().some((s) => s.id === sessionId)) throw new Error("Unknown session.");

  return {
    slug: slugRaw,
    name,
    role: text("role", 120),
    organisation: text("organisation", 120),
    category,
    sessionId,
    bio: text("bio", 1200, false) || undefined,
    keyIdea: text("keyIdea", 200, false) || undefined,
  };
}

export function toSpeaker(input: SpeakerInput, existing?: Speaker): Speaker {
  return {
    slug: input.slug,
    name: input.name,
    role: input.role,
    organisation: input.organisation,
    category: input.category,
    bio: input.bio,
    keyIdea: input.keyIdea,
    photo: existing?.photo ?? `/voices/${input.slug}.jpg`,
    sessionIds: [input.sessionId],
    conversationSlugs: existing?.conversationSlugs ?? [],
  };
}

export function serializeSpeakers(speakers: Speaker[]): string {
  return JSON.stringify(speakers, null, 2) + "\n";
}
