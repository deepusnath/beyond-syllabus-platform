import {
  getConversations,
  getEvents,
  getIdeas,
  getInterventions,
  getPrototypes,
  getSpeakers,
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
  | "intervention"
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
      title: `${e.dateLabel} · ${e.title}`,
      href: "/journey",
      snippet: e.description,
      text: [e.title, e.audience, e.question, e.description].join(" ").toLowerCase(),
    });
  }
  for (const s of getSpeakers()) {
    records.push({
      type: "voice",
      title: s.name,
      href: `/voices/${s.slug}`,
      snippet: s.keyIdea ?? `${s.role} · ${s.organisation}`,
      text: [s.name, s.role, s.organisation, s.bio ?? "", s.keyIdea ?? ""]
        .join(" ")
        .toLowerCase(),
      sample: s.sample,
    });
  }
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
  for (const iv of getInterventions()) {
    records.push({
      type: "intervention",
      title: `${iv.slug.toUpperCase()}: ${iv.text}`,
      href: "/interventions",
      snippet: `From the 2023 Bridge The Gap action model. Status: ${iv.status}.`,
      text: [iv.slug, iv.text, iv.status, ...iv.updates.map((u) => u.note)]
        .join(" ")
        .toLowerCase(),
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
