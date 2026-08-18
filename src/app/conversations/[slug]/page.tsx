import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { present } from "@/lib/util";
import {
  getConversation,
  getConversations,
  getEvent,
  getSpeaker,
  getTopic,
  stakeholderLabels,
} from "@/lib/content";
import { BackLink, Chip, SampleBadge } from "@/components/ui";

export function generateStaticParams() {
  return getConversations().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getConversation(slug);
  if (!c) return {};
  return { title: c.title, description: c.summary.slice(0, 160) };
}

function RecordList({ title, items, tone }: { title: string; items: string[]; tone?: string }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className={`kicker ${tone ?? ""}`}>{title}</h2>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item} className="border-l-2 border-purple-line pl-4 leading-relaxed text-ink-soft">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const conversation = getConversation(slug);
  if (!conversation) notFound();

  const event = getEvent(conversation.eventId);
  const participants = present(conversation.participantSlugs.map(getSpeaker));
  const topics = present(conversation.topicSlugs.map(getTopic));

  return (
    <article className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <BackLink href="/conversations" label="All conversations" className="mb-8" />
      <div className="flex flex-wrap items-center gap-3">
        <Chip tone="purple">{event?.dateLabel}</Chip>
        <p className="condensed text-sm font-semibold tracking-[0.16em] text-ink-soft">
          {event?.title}
        </p>
        {conversation.sample && <SampleBadge />}
      </div>
      <h1 className="display mt-6 text-5xl sm:text-7xl">{conversation.title}</h1>

      {/* Video */}
      <div className="mt-10 border-2 border-ink">
        {conversation.videoUrl ? (
          <div className="aspect-video w-full bg-ink">
            <iframe
              src={conversation.videoUrl}
              title={`${conversation.title} — recording`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-purple-soft/60 px-6 text-center">
            <p className="condensed text-sm font-semibold tracking-[0.18em] text-purple-deep">
              Recording publishes here after the session
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-12 md:grid-cols-[1fr_16rem]">
        <div className="space-y-12">
          <section>
            <h2 className="kicker">Summary</h2>
            <p className="mt-3 text-lg leading-relaxed text-ink">{conversation.summary}</p>
          </section>

          <RecordList title="Key questions" items={conversation.keyQuestions} />
          <RecordList title="Important observations" items={conversation.observations} />

          {(conversation.agreements.length > 0 || conversation.disagreements.length > 0) && (
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="border-t-4 border-mint pt-4">
                <RecordList title="Where we agreed" items={conversation.agreements} />
              </div>
              <div className="border-t-4 border-signal pt-4">
                <RecordList title="Where we disagreed" items={conversation.disagreements} tone="text-signal" />
              </div>
            </div>
          )}

          <RecordList title="Proposed solutions" items={conversation.proposedSolutions} tone="text-purple-deep" />

          <section>
            <h2 className="kicker">Transcript</h2>
            {conversation.transcriptStatus === "available" && conversation.transcriptExcerpt ? (
              <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">
                {conversation.transcriptExcerpt}
              </p>
            ) : (
              <p className="mt-3 text-ink-soft">
                {conversation.transcriptStatus === "in-progress"
                  ? "The transcript is being prepared and will be published here."
                  : "The transcript will be published here after the session."}
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-10">
          <section>
            <h2 className="kicker">Participants</h2>
            <ul className="mt-3 space-y-3">
              {participants.map((p) => (
                <li key={p.slug}>
                  <Link href={`/voices/${p.slug}`} className="group block">
                    <p className="font-semibold text-ink group-hover:text-purple-deep">{p.name}</p>
                    <p className="text-xs text-ink-soft">{stakeholderLabels[p.category]}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="kicker">Topics</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {topics.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/commons/${t.slug}`}
                    className="condensed inline-block border border-ink px-3 py-1.5 text-xs font-medium tracking-[0.12em] text-ink hover:bg-purple-soft"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {conversation.resources.length > 0 && (
          <section>
            <h2 className="kicker">Documentation</h2>
            <ul className="mt-3 space-y-3">
              {conversation.resources.map((r) => (
                <li key={r.id} className="border-2 border-ink p-3">
                  {r.url && r.status === "available" ? (
                    <a
                      href={r.url}
                      className="text-sm font-semibold text-purple-deep underline-offset-4 hover:underline"
                    >
                      {r.title} ↓
                    </a>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-ink">{r.title}</p>
                      <p className="condensed mt-1 text-[0.65rem] font-medium tracking-[0.16em] text-ink-soft">
                        In development
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
          )}
        </aside>
      </div>
    </article>
  );
}
