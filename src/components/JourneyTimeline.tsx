import Link from "next/link";
import { getEvents } from "@/lib/content";
import { Chip } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { DottedRing } from "@/components/PosterMotif";

const stageVerbs: Record<string, string> = {
  listen: "Listen",
  question: "Question",
  connect: "Connect",
  build: "Build",
  act: "Act",
};

/*
 * The journey as an accumulating vertical timeline: a purple spine runs
 * down the page, and each stage carries the verbs of the stages before
 * it — ideas accumulating as the movement progresses.
 */
export function JourneyTimeline({ detailed = false }: { detailed?: boolean }) {
  const events = getEvents();

  return (
    <ol className="relative mt-16">
      {/* The spine */}
      <div aria-hidden className="absolute bottom-10 left-[1.3rem] top-0 w-1.5 ribbon-gradient" />
      {events.map((event, i) => {
        const accumulated = events.slice(0, i + 1).map((e) => stageVerbs[e.stage]);
        return (
          <li key={event.id} className="relative pb-16 pl-16 sm:pl-20">
            {/* Stage number on the spine */}
            <span
              aria-hidden
              className="absolute left-0 top-1 flex h-11 w-11 items-center justify-center rounded-full bg-purple text-sm font-bold text-white"
            >
              {event.stageNumber === "FINAL" ? "★" : event.stageNumber}
            </span>

            <Reveal className="lg:grid lg:grid-cols-[1fr_15rem] lg:gap-10">
              <div>
                <p className="condensed text-sm font-semibold tracking-[0.22em] text-ink-soft">
                  {event.dateLabel}
                </p>
                <h3 className="display mt-2 text-5xl text-ink sm:text-6xl lg:text-7xl">
                  {stageVerbs[event.stage]}
                </h3>
                <p className="condensed mt-3 text-base font-medium tracking-[0.08em] text-purple-deep">
                  {event.audience}
                </p>
                <p className="mt-3 max-w-xl text-xl font-semibold leading-snug text-ink sm:text-2xl">
                  “{event.question}”
                </p>
                {event.isGlobalRelay && (
                  <Chip tone="signal" className="mt-4">
                    24-hour global relay
                  </Chip>
                )}
                {event.format === "in-person" && (
                  <Chip tone="mint" className="mt-4">
                    In person · {event.location}
                  </Chip>
                )}
                {detailed && (
                  <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">{event.description}</p>
                )}
                {detailed && event.stage === "act" && (
                  <Link
                    href="/outcomes"
                    className="condensed mt-5 inline-block text-sm font-semibold tracking-[0.14em] text-purple-deep underline-offset-4 hover:underline"
                  >
                    Follow the outcomes →
                  </Link>
                )}
              </div>

              {/* Accumulation column: every stage carries the previous ones */}
              <div aria-hidden className="hidden select-none border-l-2 border-purple-line pl-6 lg:block">
                <p className="condensed text-xs font-medium tracking-[0.22em] text-ink-soft/70">
                  The movement carries
                </p>
                <p className="display mt-3 text-3xl leading-tight">
                  {accumulated.map((verb, j) => (
                    <span
                      key={verb}
                      className={`block ${j === accumulated.length - 1 ? "text-purple" : "text-purple-line"}`}
                    >
                      {verb}
                    </span>
                  ))}
                </p>
              </div>
            </Reveal>
          </li>
        );
      })}
      <li aria-hidden className="relative h-10 list-none">
        <DottedRing className="absolute -left-1 bottom-0 w-14 text-purple" />
      </li>
    </ol>
  );
}
