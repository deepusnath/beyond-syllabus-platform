import type { Metadata } from "next";
import Link from "next/link";
import { LivePlayer } from "@/components/LivePlayer";
import { Kicker } from "@/components/ui";

export const metadata: Metadata = {
  title: "Live",
  description:
    "Watch Beyond Syllabus live. Every conversation is streamed in public. When nothing is live, the latest broadcast and full schedule are here.",
};

export default function LivePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="display text-6xl sm:text-7xl">
        Live<span className="text-purple">.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Every Beyond Syllabus conversation happens in public. Watch here live, or catch the
        latest broadcast when nothing is on air.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <LivePlayer />
        <aside className="space-y-8">
          <div className="border-2 border-ink p-6">
            <Kicker>Context</Kicker>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Beyond Syllabus is a six-month journey: six stages, each adding a stakeholder
              group. What is said on this stream becomes part of the public record.
            </p>
            <Link
              href="/journey"
              className="condensed mt-4 inline-block text-xs font-semibold tracking-[0.16em] text-purple-deep underline-offset-4 hover:underline"
            >
              See the journey →
            </Link>
          </div>
          <div className="border-2 border-ink p-6">
            <Kicker>Useful links</Kicker>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/conversations" className="text-purple-deep underline-offset-4 hover:underline">
                  Documented conversations
                </Link>
              </li>
              <li>
                <Link href="/voices" className="text-purple-deep underline-offset-4 hover:underline">
                  Who is speaking
                </Link>
              </li>
              <li>
                <Link href="/participate" className="text-purple-deep underline-offset-4 hover:underline">
                  Join the conversation
                </Link>
              </li>
            </ul>
          </div>
          <div className="bg-purple-soft p-6">
            <Kicker>Discussion</Kicker>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Live discussion runs alongside each stream. The link is posted with each broadcast
              announcement at <span className="font-semibold text-ink">@purplemovement</span>.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
