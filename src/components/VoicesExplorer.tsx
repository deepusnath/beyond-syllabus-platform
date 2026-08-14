"use client";

import { useState } from "react";
import { getSpeakers, stakeholderLabels } from "@/lib/content";
import type { StakeholderGroup } from "@/lib/types";
import { VoiceCard } from "@/components/cards";

const filters: (StakeholderGroup | "all")[] = [
  "all",
  "students",
  "educators",
  "researchers",
  "industry",
  "policymakers",
  "community",
  "global",
];

export function VoicesExplorer() {
  const [active, setActive] = useState<StakeholderGroup | "all">("all");
  const speakers = getSpeakers().filter((s) => active === "all" || s.category === active);

  return (
    <div>
      <div role="group" aria-label="Filter voices by stakeholder group" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(f)}
            aria-pressed={active === f}
            className={`condensed px-4 py-2 text-xs font-semibold tracking-[0.14em] transition-colors ${
              active === f
                ? "bg-ink text-paper"
                : "border border-ink text-ink hover:bg-purple-soft"
            }`}
          >
            {f === "all" ? "All voices" : stakeholderLabels[f]}
          </button>
        ))}
      </div>

      {speakers.length === 0 ? (
        <p className="mt-12 max-w-xl text-ink-soft">
          No voices announced in this group yet — they will appear here as sessions are confirmed.
        </p>
      ) : (
        <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {speakers.map((s) => (
            <li key={s.slug}>
              <VoiceCard speaker={s} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
