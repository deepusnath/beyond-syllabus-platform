import Link from "next/link";
import type { Conversation, Idea, Prototype, Speaker } from "@/lib/types";
import { getEvent, stakeholderLabels } from "@/lib/content";
import { Chip, SampleBadge } from "@/components/ui";

export function ConversationCard({ conversation }: { conversation: Conversation }) {
  const event = getEvent(conversation.eventId);
  return (
    <article className="group flex flex-col border-2 border-ink bg-paper transition-colors hover:border-purple">
      <div className="flex items-start justify-between gap-3 border-b border-purple-line px-6 pb-4 pt-5">
        <p className="condensed text-xs font-semibold tracking-[0.2em] text-purple-deep">
          {event?.dateLabel} · {event?.title}
        </p>
        {conversation.sample && <SampleBadge />}
      </div>
      <div className="flex flex-1 flex-col px-6 py-5">
        <h3 className="display text-3xl text-ink group-hover:text-purple-deep">
          <Link href={`/conversations/${conversation.slug}`} className="focus-visible:outline-none">
            {conversation.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {conversation.summary}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {conversation.stakeholders.map((s) => (
            <span key={s} className="condensed text-[0.65rem] font-medium tracking-[0.16em] text-ink-soft">
              {stakeholderLabels[s]}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-purple-line px-6 py-3">
        <span className="condensed text-xs font-semibold tracking-[0.18em] text-purple-deep">
          Read the record →
        </span>
      </div>
    </article>
  );
}

const ideaStatusOrder = ["idea", "exploring", "prototyping", "testing", "validated", "recommended"] as const;

export function IdeaStatusTrack({ status }: { status: Idea["status"] }) {
  const activeIndex = ideaStatusOrder.indexOf(status);
  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-2" aria-label={`Status: ${status}`}>
      {ideaStatusOrder.map((s, i) => (
        <li key={s} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className={`h-px w-3 ${i <= activeIndex ? "bg-purple" : "bg-purple-line"}`} />}
          <span
            className={`condensed rounded-chip px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-[0.12em] ${
              i === activeIndex
                ? "bg-purple text-white"
                : i < activeIndex
                  ? "text-purple-deep"
                  : "text-ink-soft/50"
            }`}
          >
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <article className="flex flex-col gap-4 border-l-4 border-purple bg-purple-soft/50 px-6 py-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="display text-2xl text-ink sm:text-3xl">{idea.title}</h3>
        {idea.sample && <SampleBadge className="shrink-0" />}
      </div>
      <IdeaStatusTrack status={idea.status} />
      <dl className="grid gap-4 text-sm leading-relaxed sm:grid-cols-2">
        <div>
          <dt className="kicker text-signal">Problem</dt>
          <dd className="mt-2 text-ink-soft">{idea.problem}</dd>
        </div>
        <div>
          <dt className="kicker text-purple-deep">Intervention</dt>
          <dd className="mt-2 text-ink-soft">{idea.intervention}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
        <span className="condensed tracking-[0.14em]">Feasibility: {idea.feasibility}</span>
        {idea.originConversationSlug && (
          <Link
            href={`/conversations/${idea.originConversationSlug}`}
            className="condensed tracking-[0.14em] text-purple-deep underline-offset-4 hover:underline"
          >
            Origin conversation →
          </Link>
        )}
      </div>
    </article>
  );
}

const prototypeStatusLabels: Record<Prototype["status"], string> = {
  research: "In research",
  building: "Building",
  piloting: "Piloting",
  results: "Results in",
  recommended: "Recommended",
};

export function PrototypeCard({ prototype }: { prototype: Prototype }) {
  return (
    <article className="group border-2 border-ink bg-ink text-paper transition-colors hover:border-purple">
      <div className="flex items-start justify-between gap-3 px-6 pt-6">
        <Chip tone="mint">{prototypeStatusLabels[prototype.status]}</Chip>
        {prototype.sample && <SampleBadge className="border-paper/40 text-paper/70" />}
      </div>
      <div className="px-6 py-5">
        <h3 className="display text-3xl group-hover:text-purple-bright">
          <Link href={`/prototypes/${prototype.slug}`}>{prototype.title}</Link>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-paper/80">{prototype.problem}</p>
        <p className="mt-4 text-sm leading-relaxed">
          <span className="kicker text-purple-bright">Hypothesis</span>
          <span className="mt-2 block text-paper/90">{prototype.hypothesis}</span>
        </p>
      </div>
      <div className="border-t border-white/15 px-6 py-3">
        <span className="condensed text-xs font-semibold tracking-[0.18em] text-purple-bright">
          Open the lab notes →
        </span>
      </div>
    </article>
  );
}

export function VoiceCard({ speaker }: { speaker: Speaker }) {
  return (
    <article className="group flex flex-col border-b-2 border-ink pb-6 transition-colors hover:border-purple">
      <div className="flex aspect-square items-center justify-center bg-purple-soft">
        {speaker.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={speaker.photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden className="display text-6xl text-purple-line">
            {speaker.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="pt-4">
        {speaker.sample && <SampleBadge className="mb-2" />}
        <h3 className="display text-2xl text-ink group-hover:text-purple-deep">
          <Link href={`/voices/${speaker.slug}`}>{speaker.name}</Link>
        </h3>
        {/* Card content is deliberately uniform — key ideas and bios live on
            the profile page so the grid keeps its rhythm. */}
        <p className="mt-1 text-sm text-ink-soft">
          {speaker.role} · {speaker.organisation}
        </p>
        <p className="condensed mt-3 text-[0.65rem] font-medium tracking-[0.18em] text-ink-soft">
          {stakeholderLabels[speaker.category]}
        </p>
      </div>
    </article>
  );
}
