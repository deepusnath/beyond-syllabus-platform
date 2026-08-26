import type { Metadata } from "next";
import Link from "next/link";
import { getIdea, getInterventions, getTopic } from "@/lib/content";
import { SectionHeading, CtaLink } from "@/components/ui";
import { InterventionLedger, type LedgerGroup } from "@/components/InterventionLedger";
import type { InterventionCategory, InterventionStatus } from "@/lib/types";
import { present } from "@/lib/util";

export const metadata: Metadata = {
  title: "Interventions",
  description:
    "The intervention ledger: every recommendation from the 2023 Bridge The Gap action model, tracked in public until each is adopted, evolved, or honestly acknowledged as stalled.",
};

const categoryLabels: Record<InterventionCategory, string> = {
  government: "Government policy changes",
  university: "University interventions",
  industry: "Industrial interventions",
  faculty: "Faculty orientation",
  platform: "Platform enablement",
};

const summaryLabels: Record<InterventionStatus, string> = {
  recorded: "recorded in 2023",
  "in-motion": "in motion",
  adopted: "adopted",
  evolved: "evolved",
  stalled: "stalled",
};

const categoryOrder: InterventionCategory[] = [
  "government",
  "university",
  "industry",
  "faculty",
  "platform",
];

export default function InterventionsPage() {
  const interventions = getInterventions();

  const groups: LedgerGroup[] = categoryOrder.map((category) => ({
    key: category,
    label: categoryLabels[category],
    items: interventions
      .filter((i) => i.category === category)
      .map((i) => ({
        slug: i.slug,
        id: i.slug.toUpperCase(),
        text: i.text,
        status: i.status,
        updates: [...i.updates].sort((a, b) => b.date.localeCompare(a.date)),
        related: [
          ...present(i.relatedTopicSlugs.map(getTopic)).map((t) => ({
            label: t.title,
            href: `/commons/${t.slug}`,
          })),
          ...present(i.relatedIdeaSlugs.map(getIdea)).map((idea) => ({
            label: idea.title,
            href: "/ideas",
          })),
        ],
      })),
  }));

  const counts = interventions.reduce<Record<InterventionStatus, number>>(
    (acc, i) => {
      acc[i.status] += 1;
      return acc;
    },
    { recorded: 0, "in-motion": 0, adopted: 0, evolved: 0, stalled: 0 },
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="Bridge The Gap · since 2023"
        title="The intervention ledger"
        lede="In 2023, the first Bridge The Gap symposium produced an intervention action model: concrete recommendations for government, universities, industry, faculty, and the platform. This page tracks every one of them, in public, until each is adopted, evolved, or honestly acknowledged as stalled. Statuses come from the organising team. Recorded means no verified progress information yet."
      />

      {/* Lineage: only editions with documents in hand */}
      <div className="mt-10 grid gap-px border border-ink bg-ink sm:grid-cols-2">
        <div className="bg-paper p-6">
          <p className="condensed text-xs font-semibold tracking-[0.2em] text-purple-deep">
            Bridge The Gap 1.0 · 2023
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Fostering Future Skills in Education: the symposium whose panel and breakout
            discussions produced this action model.
          </p>
        </div>
        <div className="bg-paper p-6">
          <p className="condensed text-xs font-semibold tracking-[0.2em] text-purple-deep">
            Bridge The Gap 4.0 · 2026
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Beyond Syllabus: the six-month journey that carries this work forward to the
            Republic Day handover.{" "}
            <Link href="/journey" className="font-semibold text-purple-deep underline-offset-4 hover:underline">
              See the journey
            </Link>
          </p>
        </div>
      </div>

      {/* Status summary, rendered from data */}
      <p className="condensed mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold tracking-[0.1em] text-ink">
        {(Object.keys(counts) as InterventionStatus[])
          .filter((s) => counts[s] > 0)
          .map((s) => (
            <span key={s}>
              <span className="text-purple">{counts[s]}</span> {summaryLabels[s]}
            </span>
          ))}
      </p>

      <div className="mt-10">
        <InterventionLedger groups={groups} />
      </div>

      <div className="mt-16 border-t-2 border-ink pt-10">
        <p className="max-w-xl text-lg text-ink">
          The 2026 journey carries this work forward, and the January handover inherits this
          ledger.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <CtaLink href="/journey" tone="ink">
            Explore the journey
          </CtaLink>
          <CtaLink href="/participate" tone="purple">
            Add your voice
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
