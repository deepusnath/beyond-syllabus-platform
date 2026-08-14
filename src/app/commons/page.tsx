import type { Metadata } from "next";
import Link from "next/link";
import { getTopics } from "@/lib/content";
import { SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Knowledge Commons",
  description:
    "The public intellectual archive of Beyond Syllabus — discussions, quotes, evidence, research, proposals, videos, transcripts and prototypes, organised by theme.",
};

export default function CommonsPage() {
  const topics = getTopics();
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="The public intellectual archive"
        title="Knowledge Commons"
        lede="Every conversation leaves evidence. Every idea remains accessible. The archive is organised by theme — each theme aggregates the discussions, quotes, research, proposals and prototypes that touch it."
      />
      <ul className="mt-14 grid gap-px border border-ink bg-ink sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic, i) => {
          const count =
            topic.conversationSlugs.length + topic.ideaSlugs.length + topic.prototypeSlugs.length;
          return (
            <Reveal as="li" key={topic.slug} delay={(i % 3) * 80} className="bg-paper">
              <Link href={`/commons/${topic.slug}`} className="group flex h-full flex-col p-7">
                <h2 className="display text-3xl text-ink group-hover:text-purple-deep">
                  {topic.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                  {topic.description}
                </p>
                <p className="condensed mt-5 text-[0.65rem] font-semibold tracking-[0.18em] text-purple-deep">
                  {count} linked record{count === 1 ? "" : "s"} →
                </p>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}
