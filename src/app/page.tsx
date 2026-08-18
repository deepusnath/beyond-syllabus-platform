import Link from "next/link";
import { Hero } from "@/components/Hero";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { ManifestoSection } from "@/components/ManifestoSection";
import { OutcomePipeline } from "@/components/OutcomePipeline";
import { Reveal } from "@/components/Reveal";
import { SectionHeading, CtaLink, Kicker } from "@/components/ui";
import { ConversationCard, IdeaCard, PrototypeCard } from "@/components/cards";
import { getConversations, getIdeas, getPrototypes } from "@/lib/content";

/* The poster's three "Beyond" pillars — the movement's framing. */
const pillars = [
  {
    title: "Beyond Gatekeepers",
    tone: "text-signal",
    copy: "Making opportunity more accessible.",
  },
  {
    title: "Beyond Borders",
    tone: "text-purple-deep",
    copy: "Connecting people beyond geography and institutions.",
  },
  {
    title: "Beyond Syllabus",
    tone: "text-ink",
    copy: "Treating formal education as the beginning of learning rather than its boundary.",
  },
];

/* Structured data: the initiative as an EventSeries. */
function eventSeriesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Beyond Syllabus — Bridge The Gap 4.0",
    description:
      "A six-month stakeholder initiative to redesign education for the next generation, ending in recommendations and working prototypes handed to decision makers.",
    organizer: { "@type": "Organization", name: "The Purple Movement" },
    startDate: "2026-08-15",
    endDate: "2027-01-26",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
  };
}

export default function HomePage() {
  const conversations = getConversations().slice(0, 3);
  const idea = getIdeas().find((i) => i.status === "prototyping") ?? getIdeas()[0];
  const prototype = getPrototypes()[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSeriesJsonLd()) }}
      />
      <Hero />

      {/* Not another conference: what this actually is */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          kicker="This is not a conference"
          title="A public process, documented in the open"
          lede="Beyond Syllabus is a structured series of stakeholder conversations running from August 2026 to Republic Day 2027. Every conversation leaves evidence. Evidence becomes ideas, ideas become prototypes — and on January 26, the documentation and working prototypes are handed to the decision makers of every stakeholder group."
        />
        <div className="mt-14 grid gap-px bg-ink sm:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 100} className="bg-paper p-8">
              <h3 className={`display text-3xl ${p.tone}`}>{p.title}</h3>
              <p className="mt-4 leading-relaxed text-ink-soft">{p.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The journey */}
      <section className="border-y border-purple-line bg-purple-soft/40">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <SectionHeading
            kicker="The journey · Aug 2026 — Jan 2027"
            title="Listen. Question. Connect. Build. Act. Deliver."
            lede="Six stages, each adding a stakeholder group and carrying forward everything gathered before it — ending in a handover on Republic Day."
          />
          <JourneyTimeline />
          <CtaLink href="/journey" tone="ink" className="mt-6">
            Explore the full journey
          </CtaLink>
        </div>
      </section>

      {/* The record so far */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          kicker="The public record"
          title="Every conversation leaves evidence"
          lede="Major discussions are documented and published — video, summaries, transcripts, agreements and disagreements alike."
        />
        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {conversations.map((c) => (
            <li key={c.slug}>
              <ConversationCard conversation={c} />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-4">
          <CtaLink href="/conversations" tone="outline">
            All conversations
          </CtaLink>
          <CtaLink href="/commons" tone="outline">
            Capability Commons
          </CtaLink>
        </div>
      </section>

      {/* Ideas → prototypes: the action layer */}
      <section className="border-y border-purple-line">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <SectionHeading
            kicker="From protest to prototype"
            title="Ideas that go somewhere"
            lede="Talking about broken systems is easy. Building alternatives is harder. Ideas from the conversations are tracked in public as they move toward working prototypes."
          />
          <div className="mt-14 grid items-start gap-8 lg:grid-cols-2">
            {idea && (
              <div>
                <Kicker className="mb-4">An idea in motion</Kicker>
                <IdeaCard idea={idea} />
              </div>
            )}
            {prototype && (
              <div>
                <Kicker className="mb-4">In the prototype lab</Kicker>
                <PrototypeCard prototype={prototype} />
              </div>
            )}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <CtaLink href="/ideas" tone="outline">
              Browse ideas
            </CtaLink>
            <CtaLink href="/prototypes" tone="ink">
              Enter the prototype lab
            </CtaLink>
          </div>
        </div>
      </section>

      {/* Outcomes pipeline */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <SectionHeading
          kicker="Where it all lands"
          title="The handover"
          lede="On Human Rights Day (Dec 10) the Global Action Network hears what was built. On Republic Day (Jan 26) the documentation and working prototypes pass into the hands of the decision makers of every stakeholder group."
        />
        <OutcomePipeline />
        <p className="mt-8">
          <Link
            href="/outcomes"
            className="condensed text-sm font-semibold tracking-[0.16em] text-purple-deep underline-offset-4 hover:underline"
          >
            Follow the outcomes →
          </Link>
        </p>
      </section>

      <ManifestoSection />
    </>
  );
}
