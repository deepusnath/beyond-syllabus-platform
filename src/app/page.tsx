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
    title: "Beyond Syllabus",
    tone: "text-ink",
    copy: "Learning begins where the syllabus ends.",
  },
  {
    title: "Beyond Gatekeepers",
    tone: "text-signal",
    copy: "Opportunity that doesn't ask permission.",
  },
  {
    title: "Beyond Borders",
    tone: "text-purple-deep",
    copy: "One generation, connected beyond geography.",
  },
];

/* Structured data: the initiative as an EventSeries. */
function eventSeriesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Beyond Syllabus (Bridge The Gap 4.0)",
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
          lede="Stakeholder conversations, held in the open from August 2026 to Republic Day 2027. Conversations leave evidence. Evidence becomes ideas. Ideas become prototypes. And on January 26, all of it lands in the hands of the decision makers of every stakeholder group."
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

      {/* Legacy: this did not start today */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <p className="condensed text-xs font-semibold tracking-[0.2em] text-mint">
            Since 2023 · Bridge The Gap
          </p>
          <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">
            Today&apos;s noise? We saw it coming in 2023.
          </h2>
          <p className="mt-6 max-w-2xl leading-relaxed text-paper/80">
            Beyond Syllabus is the fourth edition of Bridge The Gap, not a reaction to this
            year&apos;s headlines. Back in 2023, before the current debate about skills, AI and
            employability went mainstream, the first symposium brought government, universities,
            industry, faculty and platform builders around one table and wrote an intervention
            action model for exactly the shifts unfolding now. That model is reviewed and
            updated every year, and it moves things: after industry asked for it, KTU approved
            the six month internship. Now it is industry&apos;s turn to make those opportunities
            available at scale.
          </p>
          <p className="mt-6 max-w-2xl leading-relaxed text-paper/80">
            Every recommendation from that model is tracked in public, until each one is
            adopted, evolved, or honestly acknowledged as stalled.
          </p>
          <CtaLink href="/interventions" tone="white" className="mt-10">
            See the intervention ledger
          </CtaLink>
        </div>
      </section>

      {/* The journey */}
      <section className="border-y border-purple-line bg-purple-soft/40">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <SectionHeading
            kicker="The journey · Aug 2026 to Jan 2027"
            title="Listen. Question. Connect. Build. Act. Deliver."
            lede="Six stages, each adding a stakeholder group and carrying forward everything gathered before it, ending in a handover on Republic Day."
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
          lede="Major discussions are documented and published: video, summaries, transcripts, agreements and disagreements alike."
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
