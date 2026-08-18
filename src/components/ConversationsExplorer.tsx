"use client";

import { useMemo, useState } from "react";
import { getConversations, getEvents, getTopics } from "@/lib/content";
import { stakeholderLabels } from "@/lib/stakeholders";
import type { StakeholderGroup } from "@/lib/types";
import { ConversationCard } from "@/components/cards";

export function ConversationsExplorer() {
  const [query, setQuery] = useState("");
  const [stakeholder, setStakeholder] = useState<StakeholderGroup | "all">("all");
  const [eventId, setEventId] = useState<string>("all");
  const [topic, setTopic] = useState<string>("all");

  const conversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return getConversations().filter((c) => {
      if (stakeholder !== "all" && !c.stakeholders.includes(stakeholder)) return false;
      if (eventId !== "all" && c.eventId !== eventId) return false;
      if (topic !== "all" && !c.topicSlugs.includes(topic)) return false;
      if (q) {
        const hay = [c.title, c.summary, ...c.keyQuestions, ...c.proposedSolutions]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, stakeholder, eventId, topic]);

  const selectClass =
    "condensed border-2 border-ink bg-paper px-3 py-2 text-xs font-semibold tracking-[0.12em] text-ink";

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex-1 basis-64">
          <span className="kicker">Search the record</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. assessment"
            className="mt-2 w-full border-2 border-ink bg-paper px-4 py-2.5 text-sm placeholder:text-ink-soft/60"
          />
        </label>
        <label>
          <span className="sr-only">Filter by stakeholder</span>
          <select value={stakeholder} onChange={(e) => setStakeholder(e.target.value as StakeholderGroup | "all")} className={selectClass}>
            <option value="all">All stakeholders</option>
            {Object.entries(stakeholderLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by event</span>
          <select value={eventId} onChange={(e) => setEventId(e.target.value)} className={selectClass}>
            <option value="all">All events</option>
            {getEvents().map((e) => (
              <option key={e.id} value={e.id}>{e.dateLabel} — {e.title}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectClass}>
            <option value="all">All topics</option>
            {getTopics().map((t) => (
              <option key={t.slug} value={t.slug}>{t.title}</option>
            ))}
          </select>
        </label>
      </div>

      {conversations.length === 0 ? (
        <p className="mt-12 max-w-xl text-ink-soft">
          Nothing in the record matches that yet. Conversations are documented and published after each event.
        </p>
      ) : (
        <ul className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {conversations.map((c) => (
            <li key={c.slug}>
              <ConversationCard conversation={c} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
