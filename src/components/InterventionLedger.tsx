"use client";

import Link from "next/link";
import { useState } from "react";
import type { InterventionStatus, InterventionUpdate } from "@/lib/types";
import { statusLabels } from "@/lib/intervention-status";

/*
 * The 2023 action model, grouped in its original five columns, with a
 * status filter and an accessible disclosure timeline per intervention.
 * Receives fully resolved display data as props; imports no content.
 */

export interface LedgerItem {
  slug: string;
  id: string; // display id, e.g. "U1"
  text: string;
  status: InterventionStatus;
  updates: InterventionUpdate[];
  related: { label: string; href: string }[];
}

export interface LedgerGroup {
  key: string;
  label: string;
  items: LedgerItem[];
}

const statusChip: Record<InterventionStatus, string> = {
  recorded: "border border-ink text-ink",
  "in-motion": "bg-purple text-white",
  adopted: "bg-mint text-ink",
  evolved: "bg-purple-soft text-purple-deep",
  stalled: "bg-signal text-white",
};

const FILTERS: ("all" | InterventionStatus)[] = [
  "all",
  "recorded",
  "in-motion",
  "adopted",
  "evolved",
  "stalled",
];

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function InterventionLedger({ groups }: { groups: LedgerGroup[] }) {
  const [filter, setFilter] = useState<"all" | InterventionStatus>("all");

  const visible = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => filter === "all" || i.status === filter),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div role="group" aria-label="Filter interventions by status" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`condensed px-4 py-2 text-xs font-semibold tracking-[0.14em] transition-colors ${
              filter === f ? "bg-ink text-paper" : "border border-ink text-ink hover:bg-purple-soft"
            }`}
          >
            {f === "all" ? "All" : statusLabels[f]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-12 max-w-xl text-ink-soft">
          No interventions carry this status yet. Statuses change as the organising team
          verifies progress.
        </p>
      ) : (
        <div className="mt-12 space-y-14">
          {visible.map((group) => (
            <section key={group.key} aria-label={group.label}>
              <h2 className="display border-b-2 border-ink pb-3 text-3xl">{group.label}</h2>
              <ul className="divide-y divide-purple-line">
                {group.items.map((item) => (
                  <li key={item.slug}>
                    <details className="group/item py-4">
                      <summary className="flex cursor-pointer list-none flex-wrap items-baseline gap-3 [&::-webkit-details-marker]:hidden">
                        <span className="condensed w-8 shrink-0 text-sm font-bold tracking-[0.1em] text-purple">
                          {item.id}
                        </span>
                        <span className="min-w-0 flex-1 text-ink">{item.text}</span>
                        <span
                          className={`condensed rounded-chip px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] ${statusChip[item.status]}`}
                        >
                          {statusLabels[item.status]}
                        </span>
                        <span
                          aria-hidden
                          className="text-purple transition-transform group-open/item:rotate-90"
                        >
                          →
                        </span>
                      </summary>
                      <div className="mt-4 border-l-2 border-purple-line pl-11">
                        {item.updates.length === 0 ? (
                          <p className="text-sm text-ink-soft">
                            Progress updates are being gathered. This intervention is on the
                            record from 2023.
                          </p>
                        ) : (
                          <ol className="space-y-4">
                            {item.updates.map((u) => (
                              <li key={`${u.date}-${u.note.slice(0, 20)}`}>
                                <p className="condensed text-xs font-semibold tracking-[0.14em] text-purple-deep">
                                  {formatDate(u.date)}
                                </p>
                                <p className="mt-1 text-sm leading-relaxed text-ink">{u.note}</p>
                                {u.sourceUrl && (
                                  <a
                                    href={u.sourceUrl}
                                    className="text-xs text-purple-deep underline-offset-4 hover:underline"
                                  >
                                    Evidence
                                  </a>
                                )}
                              </li>
                            ))}
                          </ol>
                        )}
                        {item.related.length > 0 && (
                          <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                            <span className="condensed font-semibold tracking-[0.14em]">
                              Continues in:
                            </span>
                            {item.related.map((r) => (
                              <Link
                                key={r.href + r.label}
                                href={r.href}
                                className="border border-ink px-2 py-0.5 text-ink hover:bg-purple-soft"
                              >
                                {r.label}
                              </Link>
                            ))}
                          </p>
                        )}
                      </div>
                    </details>
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
