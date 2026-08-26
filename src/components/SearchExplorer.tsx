"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchRecord, SearchRecordType } from "@/lib/search";
import { SampleBadge } from "@/components/ui";

const typeLabels: Record<SearchRecordType, string> = {
  event: "Event",
  voice: "Voice",
  conversation: "Conversation",
  topic: "Topic",
  idea: "Idea",
  intervention: "Intervention",
  prototype: "Prototype",
};

export function SearchExplorer({ index }: { index: SearchRecord[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];
    return index.filter((r) => terms.every((t) => r.text.includes(t)));
  }, [query, index]);

  const grouped = useMemo(() => {
    const map = new Map<SearchRecordType, SearchRecord[]>();
    for (const r of results) {
      map.set(r.type, [...(map.get(r.type) ?? []), r]);
    }
    return map;
  }, [results]);

  return (
    <div>
      <label className="block max-w-2xl">
        <span className="sr-only">Search everything</span>
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “assessment”: sessions, voices, ideas, prototypes, topics…"
          className="w-full border-b-4 border-ink bg-transparent py-4 text-2xl font-medium placeholder:text-ink-soft/50 focus:border-purple focus:outline-none sm:text-3xl"
        />
      </label>

      {query.trim() === "" ? (
        <p className="mt-8 max-w-xl text-ink-soft">
          One search across the whole public record: events, voices, conversations, transcript
          references, Capability Commons topics, ideas and prototypes.
        </p>
      ) : results.length === 0 ? (
        <p className="mt-8 max-w-xl text-ink-soft">
          Nothing in the record matches “{query}” yet. The archive grows after every conversation.
        </p>
      ) : (
        <div className="mt-10 space-y-10">
          {[...grouped.entries()].map(([type, records]) => (
            <section key={type} aria-label={typeLabels[type]}>
              <h2 className="kicker">{typeLabels[type]}s</h2>
              <ul className="mt-3 divide-y divide-purple-line border-y border-purple-line">
                {records.map((r) => (
                  <li key={`${r.type}-${r.href}-${r.title}`}>
                    <Link href={r.href} className="group block py-4">
                      <p className="flex items-center gap-3 font-semibold text-ink group-hover:text-purple-deep">
                        {r.title}
                        {r.sample && <SampleBadge />}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{r.snippet}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
