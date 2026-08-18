import type { Metadata } from "next";
import { getIdeas } from "@/lib/content";
import { SectionHeading, CtaLink } from "@/components/ui";
import { IdeaCard } from "@/components/cards";

export const metadata: Metadata = {
  title: "Ideas",
  description:
    "Actionable ideas emerging from the Beyond Syllabus conversations, tracked in public as they move from idea to exploration, prototyping, testing, validation and recommendation.",
};

const statusOrder = ["recommended", "validated", "testing", "prototyping", "exploring", "idea"] as const;

export default function IdeasPage() {
  const ideas = [...getIdeas()].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="The idea pipeline"
        title="Ideas that evolve"
        lede="Every actionable idea surfaced in a conversation is captured here with its problem, its proposed intervention and its evidence — and tracked as it moves through the pipeline: idea, exploring, prototyping, testing, validated, recommended. Until the sessions produce their first real ideas, the worked examples below (marked as illustrative) show exactly how an idea will travel."
      />
      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        {ideas.map((idea) => (
          <IdeaCard key={idea.slug} idea={idea} />
        ))}
      </div>
      <div className="mt-14 border-t-2 border-ink pt-10">
        <p className="max-w-xl text-lg text-ink">
          Have an idea the conversations haven&apos;t surfaced yet?
        </p>
        <CtaLink href="/participate" tone="purple" className="mt-6">
          Submit an idea
        </CtaLink>
      </div>
    </div>
  );
}
