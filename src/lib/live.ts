import { events } from "@/data/events";
import { sessions } from "@/data/sessions";
import { site } from "@/data/site";
import type { Event, Session } from "@/lib/types";

/*
 * Live-status logic and the data it needs — and nothing else.
 *
 * This module is imported by client components that render on every page
 * (Nav, Hero, LivePlayer), so it must only pull in the small events/
 * sessions/site datasets. The full content layer (conversations, topics,
 * ideas, prototypes) lives in content.ts and must never be imported from
 * here, or the whole archive ships in the global client bundle again.
 */

export const getSite = () => site;
export const getSessionsForEvent = (eventId: string): Session[] =>
  sessions.filter((s) => s.eventId === eventId);

export type LiveStatus =
  | { state: "live"; event: Event; session?: Session }
  | { state: "upcoming"; event: Event; startsInDays: number }
  | { state: "between"; nextEvent?: Event; lastEvent?: Event };

/** Clock-driven live state with a manual override (site.live.forceLive). */
export function getLiveStatus(now: Date = new Date()): LiveStatus {
  const t = now.getTime();

  const liveEvent = events.find((e) => t >= Date.parse(e.start) && t <= Date.parse(e.end));
  if (site.live.forceLive || liveEvent) {
    const event = liveEvent ?? upcomingOrLast(t);
    const session = sessions.find(
      (s) => s.eventId === event.id && t >= Date.parse(s.start) && t <= Date.parse(s.end),
    );
    return { state: "live", event, session };
  }

  const next = events.find((e) => Date.parse(e.start) > t);
  if (next) {
    const days = Math.ceil((Date.parse(next.start) - t) / 86_400_000);
    return { state: "upcoming", event: next, startsInDays: days };
  }

  const last = [...events].reverse().find((e) => Date.parse(e.end) < t);
  return { state: "between", lastEvent: last };
}

function upcomingOrLast(t: number): Event {
  return events.find((e) => Date.parse(e.end) >= t) ?? events[events.length - 1];
}
