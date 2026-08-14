"use client";

import Link from "next/link";
import { getSessionsForEvent, getSite, getSpeaker } from "@/lib/content";
import type { Event, Session } from "@/lib/types";
import { Chip, SampleBadge } from "@/components/ui";
import { useLiveStatus } from "@/components/useLiveStatus";

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}

function StreamFrame({ title }: { title: string }) {
  const { live } = getSite();
  if (live.streamUrl) {
    return (
      <div className="aspect-video w-full bg-ink">
        <iframe
          src={live.streamUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-ink px-6 text-center">
      <span aria-hidden className="display text-5xl text-purple">▸</span>
      <p className="condensed text-sm font-semibold tracking-[0.18em] text-paper">
        The stream will appear here
      </p>
      <p className="max-w-sm text-sm text-paper/70">
        The livestream link is published shortly before each session. Follow @purplemovement for the announcement.
      </p>
    </div>
  );
}

function SessionRow({ session, state }: { session: Session; state: "past" | "now" | "next" | "later" }) {
  const speakers = session.speakerIds
    .map((id) => getSpeaker(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  return (
    <li
      className={`grid gap-2 border-t border-purple-line px-4 py-4 sm:grid-cols-[8.5rem_1fr] sm:gap-6 ${
        state === "now" ? "bg-purple-soft" : state === "past" ? "opacity-50" : ""
      }`}
    >
      <div>
        <p className="condensed text-sm font-semibold tracking-[0.12em] text-ink">
          {fmtTime(session.start)} – {fmtTime(session.end)}
        </p>
        {state === "now" && (
          <Chip tone="signal" className="mt-2 text-xs">
            <span aria-hidden className="live-dot h-1.5 w-1.5 rounded-full bg-white" />
            On now
          </Chip>
        )}
        {state === "next" && (
          <Chip tone="mint" className="mt-2 text-xs">
            Up next
          </Chip>
        )}
      </div>
      <div>
        <p className="font-semibold text-ink">{session.title}</p>
        {session.region && (
          <p className="condensed mt-1 text-xs font-medium tracking-[0.16em] text-purple-deep">
            {session.region}
          </p>
        )}
        {session.description && <p className="mt-1 text-sm text-ink-soft">{session.description}</p>}
        {speakers.length > 0 && (
          <p className="mt-2 text-sm text-ink-soft">
            {speakers.map((s, i) => (
              <span key={s.slug}>
                {i > 0 && " · "}
                <Link href={`/voices/${s.slug}`} className="text-purple-deep underline-offset-4 hover:underline">
                  {s.name}
                </Link>
              </span>
            ))}
          </p>
        )}
        {session.sample && <SampleBadge className="mt-2" />}
      </div>
    </li>
  );
}

function Schedule({ event, now }: { event: Event; now: number }) {
  const sessions = getSessionsForEvent(event.id);
  if (sessions.length === 0) {
    return (
      <p className="mt-4 border-t border-purple-line pt-4 text-sm text-ink-soft">
        The detailed schedule for this session is published closer to the date.
      </p>
    );
  }
  const nextIndex = sessions.findIndex((s) => Date.parse(s.start) > now);
  return (
    <ol className="mt-4">
      {sessions.map((s, i) => {
        const state =
          now >= Date.parse(s.start) && now <= Date.parse(s.end)
            ? "now"
            : Date.parse(s.end) < now
              ? "past"
              : i === nextIndex
                ? "next"
                : "later";
        return <SessionRow key={s.id} session={s} state={state} />;
      })}
    </ol>
  );
}

function RelayStrip({ event, now }: { event: Event; now: number }) {
  const legs = getSessionsForEvent(event.id).filter((s) => s.region);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <section aria-label="Global relay timeline" className="mt-8 border-2 border-ink">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-ink px-4 py-3">
        <p className="condensed text-sm font-semibold tracking-[0.18em] text-paper">
          24-hour global relay · following the sun
        </p>
        <p className="condensed text-xs tracking-[0.14em] text-paper/70">
          Times shown in your timezone ({tz})
        </p>
      </div>
      <ol className="grid sm:grid-cols-3">
        {legs.map((leg) => {
          const active = now >= Date.parse(leg.start) && now <= Date.parse(leg.end);
          const upcoming = Date.parse(leg.start) > now;
          return (
            <li
              key={leg.id}
              className={`border-t border-purple-line px-4 py-4 sm:border-l sm:border-t-0 sm:first:border-l-0 ${
                active ? "bg-purple text-white" : ""
              }`}
            >
              <p className="condensed text-sm font-semibold tracking-[0.14em]">{leg.region}</p>
              <p className={`mt-1 text-xs ${active ? "text-white/80" : "text-ink-soft"}`}>
                {fmtDate(leg.start)}, {fmtTime(leg.start)} – {fmtTime(leg.end)}
              </p>
              <p className="condensed mt-2 text-[0.65rem] font-semibold tracking-[0.16em]">
                {active ? "● Live in this region" : upcoming ? "Upcoming" : "Completed"}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function LivePlayer() {
  const { status, now } = useLiveStatus();

  if (!status) {
    return <div className="aspect-video w-full animate-pulse bg-purple-soft" aria-hidden />;
  }

  if (status.state === "live") {
    const { event, session } = status;
    const speakers = (session?.speakerIds ?? [])
      .map((id) => getSpeaker(id))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    return (
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Chip tone="signal" className="text-base">
            <span aria-hidden className="live-dot h-2.5 w-2.5 rounded-full bg-white" />
            Live now
          </Chip>
          <p className="condensed text-sm font-semibold tracking-[0.16em] text-ink">
            {event.dateLabel} · {event.title}
          </p>
        </div>
        <div className="mt-5 border-2 border-ink">
          <StreamFrame title={`${event.title} — live`} />
        </div>
        {session && (
          <div className="mt-5 border-l-4 border-signal bg-purple-soft/60 px-5 py-4">
            <p className="kicker text-signal">On stage now</p>
            <p className="mt-2 text-xl font-semibold text-ink">{session.title}</p>
            {speakers.length > 0 && (
              <p className="mt-1 text-sm text-ink-soft">
                {speakers.map((s) => s.name).join(" · ")}
              </p>
            )}
          </div>
        )}
        {event.isGlobalRelay && <RelayStrip event={event} now={now} />}
        <h2 className="display mt-10 text-3xl">Schedule</h2>
        <Schedule event={event} now={now} />
      </div>
    );
  }

  if (status.state === "upcoming") {
    const { event, startsInDays } = status;
    return (
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Chip tone="mint" className="text-base">Next broadcast</Chip>
          <p className="condensed text-sm font-semibold tracking-[0.16em] text-ink">
            {event.dateLabel} · {event.title}
          </p>
        </div>
        <div className="mt-5 border-2 border-ink">
          <StreamFrame title={`${event.title} — upcoming`} />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="border-t-2 border-ink pt-3">
            <p className="kicker">Starts</p>
            <p className="mt-1 font-semibold">{fmtDate(event.start)}</p>
            <p className="text-sm text-ink-soft">
              {fmtTime(event.start)} – {fmtTime(event.end)} · in {startsInDays} day{startsInDays === 1 ? "" : "s"}
            </p>
          </div>
          <div className="border-t-2 border-ink pt-3">
            <p className="kicker">Who</p>
            <p className="mt-1 font-semibold">{event.audience}</p>
          </div>
          <div className="border-t-2 border-ink pt-3">
            <p className="kicker">The question</p>
            <p className="mt-1 font-semibold">“{event.question}”</p>
          </div>
        </div>
        {event.isGlobalRelay && <RelayStrip event={event} now={now} />}
        <h2 className="display mt-10 text-3xl">Schedule</h2>
        <Schedule event={event} now={now} />
      </div>
    );
  }

  // Between/after events: the page becomes an archive of the latest broadcast.
  const last = status.lastEvent;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Chip tone="ink" className="text-base">Latest broadcast</Chip>
        {last && (
          <p className="condensed text-sm font-semibold tracking-[0.16em] text-ink">
            {last.dateLabel} · {last.title}
          </p>
        )}
      </div>
      <div className="mt-5 border-2 border-ink">
        <StreamFrame title={last ? `${last.title} — recording` : "Latest broadcast"} />
      </div>
      {last && (
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft">{last.description}</p>
      )}
      <p className="mt-4 text-sm">
        <Link href="/conversations" className="condensed font-semibold tracking-[0.14em] text-purple-deep underline-offset-4 hover:underline">
          Browse the documented conversations →
        </Link>
      </p>
    </div>
  );
}
