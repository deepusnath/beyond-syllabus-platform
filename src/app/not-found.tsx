import Link from "next/link";
import { DottedRing } from "@/components/PosterMotif";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 py-32 sm:px-6">
      <DottedRing className="absolute right-8 top-16 w-32 text-purple/30" />
      <p className="kicker">404</p>
      <h1 className="display mt-4 text-6xl sm:text-8xl">
        Beyond the map<span className="text-purple">.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-soft">
        This page isn&apos;t part of the record. The conversation, however, is very much findable.
      </p>
      <Link
        href="/"
        className="condensed mt-10 inline-flex items-center gap-3 bg-ink px-7 py-4 text-base font-semibold tracking-[0.1em] text-paper hover:bg-purple-deep"
      >
        Back to the start <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
