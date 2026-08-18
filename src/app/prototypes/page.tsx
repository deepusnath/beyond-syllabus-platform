import type { Metadata } from "next";
import { getPrototypes } from "@/lib/content";
import { SectionHeading, CtaLink } from "@/components/ui";
import { PrototypeCard } from "@/components/cards";

export const metadata: Metadata = {
  title: "Prototype Lab",
  description:
    "From protest to prototype — the solutions being developed during Beyond Syllabus, documented in public: problem, hypothesis, build, evidence, results.",
};

export default function PrototypesPage() {
  const prototypes = getPrototypes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="The prototype lab"
        title="From protest to prototype"
        lede="Talking about broken systems is easy. Building alternatives is harder. This is where solutions developed during the initiative are documented — problem, hypothesis, build, evidence and results, in public. The first real prototypes are selected at the November convergence; the worked example below (marked as illustrative) shows the documentation each one will carry."
      />
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {prototypes.map((p) => (
          <PrototypeCard key={p.slug} prototype={p} />
        ))}
      </div>
      <div className="mt-14 border-t-2 border-ink pt-10">
        <p className="max-w-xl text-lg text-ink">
          Prototypes grow out of the idea pipeline after the November convergence — and any team
          can propose one.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <CtaLink href="/participate" tone="purple">
            Propose a prototype
          </CtaLink>
          <CtaLink href="/ideas" tone="outline">
            See the idea pipeline
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
