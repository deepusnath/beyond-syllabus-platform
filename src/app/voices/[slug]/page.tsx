import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { present } from "@/lib/util";
import {
  getConversation,
  getEvent,
  getSessions,
  getSpeaker,
  getSpeakers,
  stakeholderLabels,
} from "@/lib/content";
import { BackLink, Kicker, SampleBadge, Chip } from "@/components/ui";

export function generateStaticParams() {
  return getSpeakers().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const speaker = getSpeaker(slug);
  if (!speaker) return {};
  return {
    title: speaker.name,
    description: `${speaker.role}, ${speaker.organisation}${speaker.keyIdea ? ` — ${speaker.keyIdea}` : " — a voice of Beyond Syllabus"}`,
  };
}

export default async function VoicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const speaker = getSpeaker(slug);
  if (!speaker) notFound();

  const sessions = getSessions().filter((s) => speaker.sessionIds.includes(s.id));
  const conversations = present(speaker.conversationSlugs.map(getConversation));

  return (
    <article className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <BackLink href="/voices" label="All voices" className="mb-8" />
      {speaker.sample && <SampleBadge className="mb-6" />}
      <div className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Kicker>{stakeholderLabels[speaker.category]}</Kicker>
          <h1 className="display mt-4 text-6xl sm:text-7xl">{speaker.name}</h1>
          <p className="mt-3 text-lg text-ink-soft">
            {speaker.role} · {speaker.organisation}
          </p>
        </div>
        {speaker.photo && (
          // The framed headshot cropped to a circle: portrait + white ring,
          // purple corners trimmed away.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={speaker.photo}
            alt={`${speaker.name} — portrait`}
            width={208}
            height={208}
            className="h-40 w-40 shrink-0 rounded-full object-cover sm:h-52 sm:w-52"
          />
        )}
      </div>

      {/* The contribution comes first — ideas over status */}
      {speaker.keyIdea && (
        <blockquote className="mt-10 border-l-4 border-purple bg-purple-soft/60 px-6 py-6">
          <p className="kicker text-purple-deep">Key idea</p>
          <p className="mt-3 text-2xl font-semibold leading-snug text-ink sm:text-3xl">
            “{speaker.keyIdea}”
          </p>
        </blockquote>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_18rem]">
        <div>
          {speaker.bio ? (
            <>
              <h2 className="kicker">About</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{speaker.bio}</p>
            </>
          ) : (
            <p className="leading-relaxed text-ink-soft">
              {speaker.name} joins Beyond Syllabus as part of the conversation. Their
              contribution will be documented here — with the session record and transcript —
              as the archive grows.
            </p>
          )}

          {conversations.length > 0 && (
            <>
              <h2 className="kicker mt-10">Where this idea travels</h2>
              <ul className="mt-3 divide-y divide-purple-line border-y border-purple-line">
                {conversations.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/conversations/${c.slug}`} className="group block py-4">
                      <p className="font-semibold text-ink group-hover:text-purple-deep">{c.title}</p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {getEvent(c.eventId)?.dateLabel} · documentation & transcript
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {speaker.videoTimestampUrl && (
            <p className="mt-8">
              <a
                href={speaker.videoTimestampUrl}
                className="condensed text-sm font-semibold tracking-[0.14em] text-purple-deep underline-offset-4 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                Watch this contribution →
              </a>
            </p>
          )}
        </div>

        <aside>
          <h2 className="kicker">Sessions</h2>
          <ul className="mt-3 space-y-4">
            {sessions.length === 0 && (
              <li className="text-sm text-ink-soft">Sessions will be listed once confirmed.</li>
            )}
            {sessions.map((s) => {
              const event = getEvent(s.eventId);
              return (
                <li key={s.id} className="border-2 border-ink p-4">
                  <p className="condensed text-xs font-semibold tracking-[0.16em] text-purple-deep">
                    {event?.dateLabel}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">{s.title}</p>
                  {s.region && <Chip tone="signal" className="mt-2 text-[0.65rem]">{s.region}</Chip>}
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
      <p className="mt-16 border-t-2 border-ink pt-8">
        <BackLink href="/voices" label="All voices" />
      </p>
    </article>
  );
}
