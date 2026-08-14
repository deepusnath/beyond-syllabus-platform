"use client";

import Link from "next/link";
import { PosterMotif } from "@/components/PosterMotif";
import { CtaLink, DateStrip } from "@/components/ui";
import { useLiveStatus } from "@/components/useLiveStatus";

export function Hero() {
  const { status: live } = useLiveStatus();
  const isLive = live?.state === "live";
  const hasArchive = live?.state === "between";

  return (
    <section className="relative overflow-hidden border-b border-purple-line">
      {/* Poster motif: the purple ribbon-P entering from the top edge */}
      <div className="pointer-events-none absolute bottom-11 right-0 top-0 hidden w-[42%] lg:block" aria-hidden="true">
        <PosterMotif className="absolute -right-10 top-0 h-full w-auto" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 md:pb-28 md:pt-24">
        <p className="kicker text-ink-soft">The Purple Movement presents</p>
        <p className="condensed mt-6 text-xl font-semibold tracking-[0.14em] text-ink sm:text-2xl">
          Bridge the Gap 4.0
        </p>

        <h1 className="display mt-2 text-[clamp(4.2rem,16vw,13rem)] text-ink">
          Beyond
          <br />
          Syllabus
        </h1>

        <p className="mt-8 max-w-md text-xl font-medium leading-snug text-ink sm:text-2xl">
          A four-month journey to redesign education for the next generation.
        </p>

        <DateStrip linked className="mt-8 block" />

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <CtaLink href="/participate" tone="purple">
            Enter the conversation
          </CtaLink>
          <CtaLink href="/live" tone={isLive ? "ink" : "outline"}>
            {isLive ? (
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="live-dot h-2 w-2 rounded-full bg-signal" />
                Live now
              </span>
            ) : hasArchive ? (
              "Watch the latest session"
            ) : (
              "Watch live"
            )}
          </CtaLink>
        </div>

        <p className="condensed mt-14 max-w-xs text-lg font-medium leading-snug tracking-[0.06em] text-purple-deep sm:text-xl">
          A generation that questions.
          <br />A generation that builds.
        </p>

        {/* Below lg: compact motif below content instead of shrinking the desktop one */}
        <div className="relative mt-12 h-56 overflow-hidden sm:h-72 lg:hidden" aria-hidden="true">
          <PosterMotif className="absolute -right-8 -top-4 h-[300%] w-auto" />
        </div>
      </div>

      {/* Bottom strip echoing the poster footer line */}
      <div className="ribbon-gradient">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <p className="condensed text-xs font-semibold tracking-[0.2em] text-white sm:text-sm">
            From protest to prototype. From problems to possibilities.
          </p>
          <Link
            href="/about"
            className="condensed text-xs font-semibold tracking-[0.2em] text-white/90 underline-offset-4 hover:underline"
          >
            Why this exists →
          </Link>
        </div>
      </div>
    </section>
  );
}
