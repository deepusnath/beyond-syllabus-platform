import { events } from "@/data/events";
import { sessions } from "@/data/sessions";
import { speakers } from "@/lib/speakers-store";
import { conversations } from "@/data/conversations";
import { topics } from "@/data/topics";
import { ideas } from "@/data/ideas";
import { prototypes } from "@/data/prototypes";
import { site } from "@/data/site";
import type {
  Conversation,
  Event,
  Idea,
  Prototype,
  Session,
  Speaker,
  StakeholderGroup,
  Topic,
} from "@/lib/types";

/*
 * Single content-access layer. Pages import from here, never from
 * src/data directly — so swapping local data for a CMS/database later
 * only touches this file.
 */

export const getEvents = (): Event[] => events;
export const getEvent = (id: string): Event | undefined => events.find((e) => e.id === id);

export const getSessions = (): Session[] => sessions;
export const getSessionsForEvent = (eventId: string): Session[] =>
  sessions.filter((s) => s.eventId === eventId);

export const getSpeakers = (): Speaker[] => speakers;
export const getSpeaker = (slug: string): Speaker | undefined =>
  speakers.find((s) => s.slug === slug);

export const getConversations = (): Conversation[] => conversations;
export const getConversation = (slug: string): Conversation | undefined =>
  conversations.find((c) => c.slug === slug);

export const getTopics = (): Topic[] => topics;
export const getTopic = (slug: string): Topic | undefined =>
  topics.find((t) => t.slug === slug);

export const getIdeas = (): Idea[] => ideas;
export const getIdea = (slug: string): Idea | undefined => ideas.find((i) => i.slug === slug);

export const getPrototypes = (): Prototype[] => prototypes;
export const getPrototype = (slug: string): Prototype | undefined =>
  prototypes.find((p) => p.slug === slug);

export const getSite = () => site;

export const stakeholderLabels: Record<StakeholderGroup, string> = {
  students: "Students",
  educators: "Educators",
  researchers: "Researchers",
  industry: "Industry",
  policymakers: "Policymakers",
  community: "Community Leaders",
  global: "Global Voices",
};

/* ---------------- Live status ---------------- */

export type LiveStatus =
  | { state: "live"; event: Event; session?: Session }
  | { state: "upcoming"; event: Event; startsInDays: number }
  | { state: "between"; nextEvent?: Event; lastEvent?: Event };

/**
 * Clock-driven live state with a manual override (site.live.forceLive).
 * Every stage now has a concrete broadcast window, including the Dec 10
 * Global Action Network update and the Jan 26 handover.
 */
export function getLiveStatus(now: Date = new Date()): LiveStatus {
  const broadcastEvents = events;
  const t = now.getTime();

  const liveEvent = broadcastEvents.find(
    (e) => t >= Date.parse(e.start) && t <= Date.parse(e.end),
  );
  if (site.live.forceLive || liveEvent) {
    const event = liveEvent ?? upcomingOrLast(broadcastEvents, t);
    const session = sessions.find(
      (s) => s.eventId === event.id && t >= Date.parse(s.start) && t <= Date.parse(s.end),
    );
    return { state: "live", event, session };
  }

  const next = broadcastEvents.find((e) => Date.parse(e.start) > t);
  if (next) {
    const days = Math.ceil((Date.parse(next.start) - t) / 86_400_000);
    return { state: "upcoming", event: next, startsInDays: days };
  }

  const last = [...broadcastEvents].reverse().find((e) => Date.parse(e.end) < t);
  return { state: "between", lastEvent: last };
}

function upcomingOrLast(list: Event[], t: number): Event {
  return list.find((e) => Date.parse(e.end) >= t) ?? list[list.length - 1];
}
