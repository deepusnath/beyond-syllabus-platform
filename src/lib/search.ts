import {
  getConversations,
  getEvents,
  getIdeas,
  getPrototypes,
  getTopics,
} from "@/lib/content";

/*
 * Global search index. Built once from the content layer at module load;
 * consumed by the /search client component. When content moves to a
 * CMS/database this becomes an API route or hosted search index with the
 * same record shape.
 */

export type SearchRecordType =
  | "event"
  | "voice"
  | "conversation"
  | "topic"
  | "idea"
  | "prototype";

export interface SearchRecord {
  type: SearchRecordType;
  title: string;
  href: string;
  snippet: string;
  /** Lower-cased haystack for matching. */
  text: string;
  sample?: boolean;
}

export function buildSearchIndex(): SearchRecord[] {
  const records: SearchRecord[] = [];

  for (const e of getEvents()) {
    records.push({
      type: "event",
      title: `${e.dateLabel} — ${e.title}`,
      href: "/journey",
      snippet: e.description,
      text: [e.title, e.audience, e.question, e.description].join(" ").toLowerCase(),
    });
  }
  // Voices are excluded from search while the section is hidden (sample
  // content only) — restore this block alongside the nav entry.
  // for (const s of getSpeakers()) { ... }
  for (const c of getConversations()) {
    records.push({
      type: "conversation",
      title: c.title,
      href: `/conversations/${c.slug}`,
      snippet: c.summary,
      text: [
        c.title,
        c.summary,
        ...c.keyQuestions,
        ...c.observations,
        ...c.proposedSolutions,
      ]
        .join(" ")
        .toLowerCase(),
      sample: c.sample,
    });
  }
  for (const t of getTopics()) {
    records.push({
      type: "topic",
      title: t.title,
      href: `/commons/${t.slug}`,
      snippet: t.description,
      text: [t.title, t.description, ...t.quotes.map((q) => q.text)].join(" ").toLowerCase(),
    });
  }
  for (const i of getIdeas()) {
    records.push({
      type: "idea",
      title: i.title,
      href: "/ideas",
      snippet: i.problem,
      text: [i.title, i.problem, i.intervention].join(" ").toLowerCase(),
      sample: i.sample,
    });
  }
  for (const p of getPrototypes()) {
    records.push({
      type: "prototype",
      title: p.title,
      href: `/prototypes/${p.slug}`,
      snippet: p.problem,
      text: [p.title, p.problem, p.hypothesis, p.solution].join(" ").toLowerCase(),
      sample: p.sample,
    });
  }

  return records;
}
