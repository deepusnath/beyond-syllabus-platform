import type { Session } from "@/lib/types";

/*
 * Session 1 is confirmed. Entries flagged `sample: true` are placeholder
 * schedule used to develop the live experience; confirmed schedules
 * replace them per event.
 */
export const sessions: Session[] = [
  // Confirmed: Session 1, per the official speaker announcements.
  {
    id: "s-listen-1",
    eventId: "listen",
    title: "Session 1: Students & Student Communities Shaping the Future",
    start: "2026-08-15T15:00:00+05:30",
    end: "2026-08-15T18:00:00+05:30",
    speakerIds: [
      "claire-c-john",
      "nino-k-m",
      "aparna-rajesh",
      "fathima-basheer",
      "prakhar-sharma",
      "diya-bhatt",
      "aromal-m",
      "kavya",
      "parvathy-v-nair",
      "salahudheen-thajudheen",
      "vedha-mahadevan",
      "arthalal-c",
      "bhavya-sunil",
      "akshat-pradeep",
      "arundhathi-krishna",
    ],
    description:
      "Students and student communities open the journey — the generation experiencing the education system directly sets the agenda.",
  },
  {
    id: "s-question-1",
    eventId: "question",
    title: "What should education become?",
    start: "2026-09-05T15:00:00+05:30",
    end: "2026-09-05T18:00:00+05:30",
    speakerIds: [],
    description: "Academics and policymakers respond to the student conversation.",
    sample: true,
  },
  {
    id: "s-connect-1",
    eventId: "connect",
    title: "Relay leg: Asia-Pacific",
    start: "2026-10-02T09:00:00+05:30",
    end: "2026-10-02T17:00:00+05:30",
    speakerIds: [],
    region: "Asia-Pacific",
    description: "The relay opens with industry and practitioners across Asia-Pacific.",
    sample: true,
  },
  {
    id: "s-connect-2",
    eventId: "connect",
    title: "Relay leg: Europe, Middle East & Africa",
    start: "2026-10-02T17:00:00+05:30",
    end: "2026-10-03T01:00:00+05:30",
    speakerIds: [],
    region: "Europe, Middle East & Africa",
    description: "The conversation follows the sun into EMEA.",
    sample: true,
  },
  {
    id: "s-connect-3",
    eventId: "connect",
    title: "Relay leg: The Americas",
    start: "2026-10-03T01:00:00+05:30",
    end: "2026-10-03T09:00:00+05:30",
    speakerIds: [],
    region: "The Americas",
    description: "The final eight hours close the loop across the Americas.",
    sample: true,
  },
  {
    id: "s-build-1",
    eventId: "build",
    title: "Convergence working sessions",
    start: "2026-11-14T09:30:00+05:30",
    end: "2026-11-14T17:00:00+05:30",
    speakerIds: [],
    description: "All stakeholders in one room, turning ideas into buildable proposals.",
    sample: true,
  },
];
