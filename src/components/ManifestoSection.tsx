import { CtaLink, DateStrip } from "@/components/ui";
import { DottedRing } from "@/components/PosterMotif";
import { Reveal } from "@/components/Reveal";

export function ManifestoSection() {
  return (
    <section className="relative overflow-x-clip bg-ink text-paper">
      <DottedRing
        className="pointer-events-none absolute -right-20 top-12 w-72 text-purple/40"
      />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-36">
        <Reveal>
          <h2 className="display max-w-5xl text-[clamp(2.6rem,7.5vw,6.5rem)]">
            What if the future of education is not something we{" "}
            <span className="text-gradient-purple">wait for?</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="display mt-10 text-[clamp(2.2rem,6vw,5rem)] text-mint">
            What if we build it?
          </p>
        </Reveal>
        <Reveal delay={250}>
          <div className="mt-12">
            <CtaLink href="/participate" tone="purple">
              Join the movement
            </CtaLink>
          </div>
        </Reveal>
        <DateStrip className="mt-16 text-purple-soft" />
      </div>
    </section>
  );
}
