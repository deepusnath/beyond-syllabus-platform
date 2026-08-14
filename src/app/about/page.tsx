import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading, CtaLink, DateStrip } from "@/components/ui";
import { DottedRing } from "@/components/PosterMotif";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Beyond Syllabus exists — Bridge The Gap 4.0, an initiative of The Purple Movement to move education from protest to prototype.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="About · Bridge The Gap 4.0"
        title="Why this exists"
        lede="Beyond Syllabus is a four-month initiative by The Purple Movement focused on reimagining education for the next generation. It is not another discussion about what is wrong with education. It is a structured attempt to build credible alternatives."
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-8 text-lg leading-relaxed text-ink-soft">
          <p>
            Between August and December 2026, Beyond Syllabus brings each stakeholder group into a
            documented public conversation — students first, then academics and policymakers, then
            industry and the global community, then everyone in one room.
          </p>
          <p>
            Everything is recorded, summarised and published. Agreements and disagreements alike.
            Ideas are captured and tracked as they mature; the strongest become working prototypes;
            and in December, the evidence, recommendations and prototypes are consolidated and
            submitted to the relevant Union Ministry.
          </p>
          <p className="display text-3xl leading-tight text-ink sm:text-4xl">
            From protest to prototype.
            <br />
            From problems to possibilities.
            <br />
            <span className="text-gradient-purple">From conversation to action.</span>
          </p>
          <p>
            The Purple Movement&apos;s framing is simple: red plus blue makes purple — energy plus
            wisdom, questioning plus building. Beyond gatekeepers, beyond borders, beyond syllabus.
          </p>
        </div>

        <aside className="space-y-8">
          <figure className="border-2 border-ink p-3">
            <Image
              src="/poster/beyond-syllabus-2026.jpg"
              alt="Bridge The Gap 4.0 — Beyond Syllabus poster: a symposium for the future of education, 5 September 2026, online live session."
              width={1278}
              height={1600}
              className="h-auto w-full"
            />
            <figcaption className="condensed mt-3 px-1 text-[0.65rem] font-medium tracking-[0.16em] text-ink-soft">
              The Bridge The Gap 4.0 poster — the visual identity this platform extends.
            </figcaption>
          </figure>
          <div className="relative border-2 border-ink p-6">
            <DottedRing className="absolute -right-6 -top-6 w-16 text-purple" />
            <p className="kicker">The journey</p>
            <DateStrip className="mt-4" linked />
          </div>
        </aside>
      </div>

      <div className="mt-20 border-t-2 border-ink pt-10">
        <p className="display max-w-3xl text-3xl sm:text-4xl">
          A generation that questions. A generation that builds.
        </p>
        <CtaLink href="/participate" tone="purple" className="mt-8">
          Join the movement
        </CtaLink>
      </div>
    </div>
  );
}
