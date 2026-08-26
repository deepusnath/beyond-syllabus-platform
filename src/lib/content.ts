import { events } from "@/data/events";
import { sessions } from "@/data/sessions";
import { speakers } from "@/lib/speakers-store";
import { conversations } from "@/data/conversations";
import { topics } from "@/data/topics";
import { ideas } from "@/data/ideas";
import { prototypes } from "@/data/prototypes";
import { interventions } from "@/data/interventions";
import type {
  Conversation,
  Event,
  Idea,
  Intervention,
  Prototype,
  Session,
  Speaker,
  Topic,
} from "@/lib/types";

/*
 * Single content-access layer for SERVER components and build-time code.
 * Pages import from here, never from src/data directly — so swapping
 * local data for a CMS/database later only touches this file.
 *
 * ⚠ Client components must NOT import this module: it pulls the entire
 * content dataset into the bundle. Client-safe slices live in:
 *   - @/lib/live         (events, sessions, site, live status)
 *   - @/lib/speakers-store (speaker records)
 *   - @/lib/stakeholders (group labels)
 */

export const getEvents = (): Event[] => events;
export const getEvent = (id: string): Event | undefined => events.find((e) => e.id === id);

export const getSessions = (): Session[] => sessions;

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

export const getInterventions = (): Intervention[] => interventions;
export const getPrototype = (slug: string): Prototype | undefined =>
  prototypes.find((p) => p.slug === slug);

// Re-exports so existing server-side imports keep one entry point.
export { getSite, getSessionsForEvent, getLiveStatus, type LiveStatus } from "@/lib/live";
export { stakeholderLabels } from "@/lib/stakeholders";
