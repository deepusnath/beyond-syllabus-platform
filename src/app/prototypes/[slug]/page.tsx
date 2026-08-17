import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getConversation, getIdea, getPrototype, getPrototypes, getTopic } from "@/lib/content";
import { Chip, Kicker, SampleBadge } from "@/components/ui";
import { IdeaStatusTrack } from "@/components/cards";

export function generateStaticParams() {
  return getPrototypes().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getPrototype(slug);
  if (!p) return {};
  return { title: `${p.title} — Prototype Lab`, description: p.hypothesis.slice(0, 160) };
}

const statusLabels = {
  research: "In research",
  building: "Building",
  piloting: "Piloting",
  results: "Results in",
  recommended: "Recommended",
} as const;

export default async function PrototypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prototype = getPrototype(slug);
  if (!prototype) notFound();

  const idea = prototype.ideaSlug ? getIdea(prototype.ideaSlug) : undefined;
  const conversations = prototype.conversationSlugs
    .map((c) => getConversation(c))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const topics = prototype.topicSlugs
    .map((t) => getTopic(t))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <article className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <Link
        href="/prototypes"
        className="condensed mb-8 inline-block text-xs font-semibold tracking-[0.16em] text-purple-deep underline-offset-4 hover:underline"
      >
        ← Prototype lab
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <Chip tone="mint">{statusLabels[prototype.status]}</Chip>
        {prototype.sample && <SampleBadge />}
      </div>
      <h1 className="display mt-6 text-5xl sm:text-7xl">{prototype.title}</h1>

      <div className="mt-12 space-y-12">
        <section className="grid gap-8 md:grid-cols-2">
          <div className="border-t-4 border-signal pt-4">
            <h2 className="kicker text-signal">The problem</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{prototype.problem}</p>
          </div>
          <div className="border-t-4 border-purple pt-4">
            <h2 className="kicker text-purple-deep">The hypothesis</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{prototype.hypothesis}</p>
          </div>
        </section>

        <section>
          <h2 className="kicker">The solution</h2>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-ink">{prototype.solution}</p>
        </section>

        <section>
          <h2 className="kicker">Implementation & current status</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">{prototype.implementation}</p>
          {prototype.results && (
            <div className="mt-6 border-l-4 border-mint bg-purple-soft/50 px-6 py-5">
              <h3 className="kicker">Results</h3>
              <p className="mt-2 leading-relaxed text-ink">{prototype.results}</p>
            </div>
          )}
        </section>

        <section>
          <h2 className="kicker">Research & evidence</h2>
          <ul className="mt-3 space-y-3">
            {prototype.evidence.map((e) => (
              <li key={e} className="border-l-2 border-purple-line pl-4 text-ink-soft">
                {e}
              </li>
            ))}
          </ul>
        </section>

        {(prototype.githubUrl || prototype.demoUrl) && (
          <section className="flex flex-wrap gap-4">
            {prototype.githubUrl && (
              <a
                href={prototype.githubUrl}
                className="condensed border-2 border-ink px-5 py-3 text-sm font-semibold tracking-[0.12em] hover:bg-ink hover:text-paper"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub →
              </a>
            )}
            {prototype.demoUrl && (
              <a
                href={prototype.demoUrl}
                className="condensed bg-ink px-5 py-3 text-sm font-semibold tracking-[0.12em] text-paper hover:bg-purple-deep"
                rel="noopener noreferrer"
                target="_blank"
              >
                Live demo →
              </a>
            )}
          </section>
        )}

        <section className="border-t-2 border-ink pt-8">
          <Kicker>Where this came from</Kicker>
          {idea && (
            <div className="mt-5 max-w-xl">
              <p className="font-semibold text-ink">
                Origin idea:{" "}
                <Link href="/ideas" className="text-purple-deep underline-offset-4 hover:underline">
                  {idea.title}
                </Link>
              </p>
              <div className="mt-3">
                <IdeaStatusTrack status={idea.status} />
              </div>
            </div>
          )}
          {conversations.length > 0 && (
            <ul className="mt-5 space-y-2">
              {conversations.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/conversations/${c.slug}`}
                    className="text-sm text-purple-deep underline-offset-4 hover:underline"
                  >
                    ↳ {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {topics.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {topics.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/commons/${t.slug}`}
                    className="condensed inline-block border border-ink px-3 py-1.5 text-xs font-medium tracking-[0.12em] hover:bg-purple-soft"
                  >
                    {t.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  );
}
