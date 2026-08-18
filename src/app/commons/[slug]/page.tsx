import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { present } from "@/lib/util";
import {
  getConversation,
  getIdea,
  getPrototype,
  getTopic,
  getTopics,
  getEvent,
} from "@/lib/content";
import { BackLink, Kicker, SampleBadge } from "@/components/ui";
import { IdeaCard, PrototypeCard } from "@/components/cards";

export function generateStaticParams() {
  return getTopics().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  return { title: `${topic.title} — Capability Commons`, description: topic.description };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) notFound();

  const conversations = present(topic.conversationSlugs.map(getConversation));
  const ideas = present(topic.ideaSlugs.map(getIdea));
  const prototypes = present(topic.prototypeSlugs.map(getPrototype));

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <BackLink href="/commons" label="All themes" className="mb-8" />
      <Kicker>Capability Commons</Kicker>
      <h1 className="display mt-4 text-6xl sm:text-8xl">{topic.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">{topic.description}</p>

      {topic.quotes.length > 0 && (
        <section aria-label="Quotes" className="mt-14 space-y-6">
          {topic.quotes.map((q) => (
            <blockquote key={q.text} className="max-w-3xl border-l-4 border-purple pl-6">
              <p className="display text-2xl leading-tight text-ink sm:text-3xl">“{q.text}”</p>
              <footer className="mt-3 flex items-center gap-3 text-sm text-ink-soft">
                {q.attribution}
                {q.sample && <SampleBadge />}
              </footer>
            </blockquote>
          ))}
        </section>
      )}

      <section className="mt-16">
        <h2 className="kicker">Discussions & evidence</h2>
        {conversations.length === 0 ? (
          <p className="mt-4 text-ink-soft">Records land here as conversations touch this theme.</p>
        ) : (
          <ul className="mt-4 divide-y divide-purple-line border-y border-purple-line">
            {conversations.map((c) => (
              <li key={c.slug}>
                <Link href={`/conversations/${c.slug}`} className="group flex flex-wrap items-baseline justify-between gap-2 py-5">
                  <div>
                    <p className="text-lg font-semibold text-ink group-hover:text-purple-deep">
                      {c.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {getEvent(c.eventId)?.dateLabel} · summary, transcript & documentation
                    </p>
                  </div>
                  <span aria-hidden className="text-purple">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {ideas.length > 0 && (
        <section className="mt-16">
          <h2 className="kicker">Ideas in this theme</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {ideas.map((i) => (
              <IdeaCard key={i.slug} idea={i} />
            ))}
          </div>
        </section>
      )}

      {prototypes.length > 0 && (
        <section className="mt-16">
          <h2 className="kicker">Prototypes in this theme</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {prototypes.map((p) => (
              <PrototypeCard key={p.slug} prototype={p} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-16 border-t-2 border-ink pt-8">
        <BackLink href="/commons" label="All themes" />
      </p>
    </div>
  );
}
