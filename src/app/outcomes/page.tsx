import type { Metadata } from "next";
import Link from "next/link";
import { OutcomePipeline } from "@/components/OutcomePipeline";
import { SectionHeading, Chip } from "@/components/ui";

export const metadata: Metadata = {
  title: "Outcomes",
  description:
    "What we heard, what we learned, what we built, what we recommend — the December 2026 public record of Beyond Syllabus, submitted to the relevant Union Ministry.",
};

/*
 * The final report does not exist yet. Everything below states its
 * in-development status honestly — nothing is fabricated.
 */
const reportSections = [
  "Executive Summary",
  "Evidence",
  "Recommendations",
  "Working Prototypes",
  "Research References",
  "Contributors",
];

export default function OutcomesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="Policy & outcomes"
        title="The December record"
        lede="Beyond Syllabus ends in something you can hold: consolidated evidence, practical recommendations and working prototypes, submitted to the relevant Union Ministry in December 2026."
      />

      <OutcomePipeline />

      {/* The future report */}
      <section className="mt-20 bg-ink px-6 py-12 text-paper sm:px-10 lg:px-14">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="display text-4xl sm:text-5xl">The December 2026 Report</h2>
          <Chip tone="mint">In development</Chip>
        </div>
        <p className="mt-6 max-w-2xl leading-relaxed text-paper/80">
          The final report is being built in public across the four months — its evidence
          accumulates in the Capability Commons, its recommendations in the idea pipeline, and its
          prototypes in the lab. When it is complete, it will be downloadable here.
        </p>
        <ul className="mt-8 grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-3">
          {reportSections.map((s) => (
            <li key={s} className="bg-ink px-5 py-4">
              <p className="condensed text-sm font-semibold tracking-[0.14em] text-paper">{s}</p>
              <p className="condensed mt-1 text-[0.65rem] tracking-[0.16em] text-paper/50">
                In development
              </p>
            </li>
          ))}
        </ul>
        <p
          aria-disabled="true"
          className="condensed mt-10 inline-flex cursor-not-allowed items-center gap-3 border-2 border-dashed border-paper/40 px-7 py-4 text-base font-semibold tracking-[0.1em] text-paper/60"
        >
          Download the December 2026 report — in development
        </p>
      </section>

      <section className="mt-16 grid gap-8 border-t-2 border-ink pt-10 md:grid-cols-3">
        <p className="text-lg font-semibold text-ink md:col-span-1">
          Watch the record being built:
        </p>
        <div className="flex flex-wrap items-start gap-4 md:col-span-2">
          <Link href="/conversations" className="condensed border-2 border-ink px-5 py-3 text-sm font-semibold tracking-[0.12em] hover:bg-purple-soft">
            What we heard →
          </Link>
          <Link href="/commons" className="condensed border-2 border-ink px-5 py-3 text-sm font-semibold tracking-[0.12em] hover:bg-purple-soft">
            What we learned →
          </Link>
          <Link href="/prototypes" className="condensed border-2 border-ink px-5 py-3 text-sm font-semibold tracking-[0.12em] hover:bg-purple-soft">
            What we built →
          </Link>
        </div>
      </section>
    </div>
  );
}
