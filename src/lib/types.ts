/*
 * Beyond Syllabus content model.
 *
 * V1 runs from local structured data (src/data). Every interface here is
 * designed to map 1:1 onto a future CMS/database schema (Sanity, Strapi,
 * Supabase, Postgres) so the presentation layer never has to change.
 *
 * `sample: true` marks seed/sample content that must be visually
 * distinguished from confirmed content everywhere it renders.
 */

export type StakeholderGroup =
  | "students"
  | "educators"
  | "researchers"
  | "industry"
  | "policymakers"
  | "community"
  | "global";

export type EventStage = "listen" | "question" | "connect" | "build" | "act";

export interface Event {
  id: string;
  slug: string;
  stage: EventStage;
  stageNumber: string; // "01".."04", "FINAL"
  title: string;
  audience: string;
  question: string;
  /** ISO date with offset (IST). */
  start: string;
  end: string;
  dateLabel: string; // "AUG 15"
  format: "online" | "in-person" | "hybrid" | "relay";
  location?: string;
  description: string;
  isGlobalRelay?: boolean;
  confirmed: boolean;
}

export interface Session {
  id: string;
  eventId: string;
  title: string;
  start: string;
  end: string;
  speakerIds: string[];
  /** For the 24h relay: which region/leg this session belongs to. */
  region?: string;
  description?: string;
  sample?: boolean;
}

export interface Speaker {
  slug: string;
  name: string;
  role: string;
  organisation: string;
  category: StakeholderGroup;
  /** Optional until provided — never fabricated. */
  bio?: string;
  /** The one idea/contribution they bring — ideas over status. Optional until captured. */
  keyIdea?: string;
  photo?: string;
  sessionIds: string[];
  conversationSlugs: string[];
  videoTimestampUrl?: string;
  sample?: boolean;
}

export interface Conversation {
  slug: string;
  title: string;
  eventId: string;
  date: string;
  participantSlugs: string[];
  stakeholders: StakeholderGroup[];
  topicSlugs: string[];
  videoUrl?: string;
  summary: string;
  transcriptStatus: "available" | "in-progress" | "pending";
  transcriptExcerpt?: string;
  keyQuestions: string[];
  observations: string[];
  agreements: string[];
  disagreements: string[];
  proposedSolutions: string[];
  resources: DocumentResource[];
  sample?: boolean;
}

export interface Topic {
  slug: string;
  title: string;
  description: string;
  /** Slugs of related content aggregated under this theme. */
  conversationSlugs: string[];
  ideaSlugs: string[];
  prototypeSlugs: string[];
  quotes: { text: string; attribution: string; sample?: boolean }[];
}

export type IdeaStatus =
  | "idea"
  | "exploring"
  | "prototyping"
  | "testing"
  | "validated"
  | "recommended";

export interface Idea {
  slug: string;
  title: string;
  problem: string;
  intervention: string;
  originConversationSlug?: string;
  contributors: string[];
  stakeholders: StakeholderGroup[];
  evidence: string[];
  feasibility: "low" | "medium" | "high";
  status: IdeaStatus;
  topicSlugs: string[];
  sample?: boolean;
}

export type PrototypeStatus =
  | "research"
  | "building"
  | "piloting"
  | "results"
  | "recommended";

export interface Prototype {
  slug: string;
  title: string;
  problem: string;
  hypothesis: string;
  solution: string;
  team: string[];
  status: PrototypeStatus;
  implementation: string;
  results?: string;
  evidence: string[];
  githubUrl?: string;
  demoUrl?: string;
  conversationSlugs: string[];
  ideaSlug?: string;
  topicSlugs: string[];
  sample?: boolean;
}

export interface DocumentResource {
  id: string;
  title: string;
  kind: "summary" | "transcript" | "research" | "proposal" | "report" | "link";
  url?: string;
  /** Documents without a url are announced but not yet published. */
  status: "available" | "in-development";
  sample?: boolean;
}

export interface Partner {
  name: string;
  url?: string;
  logo?: string;
  sample?: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  url: string;
  /** Configurable livestream settings — swap per event, or via env. */
  live: {
    /** YouTube embed URL for the active/most recent broadcast. */
    streamUrl?: string;
    /** Manual override: force the LIVE state on/off regardless of clock. */
    forceLive?: boolean;
  };
  social: { label: string; url: string }[];
  registrationUrl?: string;
}
