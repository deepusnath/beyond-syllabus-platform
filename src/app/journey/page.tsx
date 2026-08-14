import type { Metadata } from "next";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { SectionHeading, CtaLink, DateStrip } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Journey",
  description:
    "Five stages from August to December 2026 — Listen, Question, Connect, Build, Act. How Beyond Syllabus moves from conversation to recommendations and working prototypes.",
};

export default function JourneyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="The journey · Aug — Dec 2026"
        title="From conversation to action"
        lede="The objective is not another discussion about what is wrong with education. The objective is to build credible alternatives. Each stage adds a stakeholder group — and carries forward everything gathered before it."
      />
      <DateStrip className="mt-8" />
      <JourneyTimeline detailed />
      <div className="mt-16 flex flex-wrap gap-4 border-t-2 border-ink pt-10">
        <CtaLink href="/participate" tone="purple">
          Enter the conversation
        </CtaLink>
        <CtaLink href="/live" tone="outline">
          Watch live
        </CtaLink>
      </div>
    </div>
  );
}
