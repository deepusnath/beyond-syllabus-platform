import type { Event } from "@/lib/types";

/*
 * The Beyond Syllabus journey — confirmed structure of the initiative.
 * Times are IST (+05:30). The September 5 session details match the
 * Bridge The Gap 4.0 poster (3:00–6:00 PM, online live session).
 */
export const events: Event[] = [
  {
    id: "listen",
    slug: "students",
    stage: "listen",
    stageNumber: "01",
    title: "Students and Student Communities",
    audience: "Students + Student Communities",
    question: "What needs to change?",
    start: "2026-08-15T15:00:00+05:30",
    end: "2026-08-15T18:00:00+05:30",
    dateLabel: "AUG 15",
    format: "online",
    description:
      "The journey begins with the generation experiencing the education system directly. Students and student communities set the agenda: what is broken, what is missing, and what deserves to exist.",
    confirmed: true,
  },
  {
    id: "question",
    slug: "academics-policymakers",
    stage: "question",
    stageNumber: "02",
    title: "Academics and Policymakers",
    audience: "Academics + Policymakers",
    question: "What should education become?",
    start: "2026-09-05T15:00:00+05:30",
    end: "2026-09-05T18:00:00+05:30",
    dateLabel: "SEP 05",
    format: "online",
    description:
      "Educators, researchers and policymakers join the conversation — responding to what students said, and interrogating what education should become rather than what it has been.",
    confirmed: true,
  },
  {
    id: "connect",
    slug: "global-relay",
    stage: "connect",
    stageNumber: "03",
    title: "Industry + Global Community",
    audience: "Industry + Global Community",
    question: "What capabilities will the future demand?",
    start: "2026-10-02T09:00:00+05:30",
    end: "2026-10-03T09:00:00+05:30",
    dateLabel: "OCT 02",
    format: "relay",
    isGlobalRelay: true,
    description:
      "A 24-hour global relay following the sun — industry leaders, practitioners and international communities connecting region by region on the capabilities the future will demand.",
    confirmed: true,
  },
  {
    id: "build",
    slug: "convergence",
    stage: "build",
    stageNumber: "04",
    title: "Stakeholder Convergence",
    audience: "All Stakeholders",
    question: "What can we actually build?",
    start: "2026-11-14T09:30:00+05:30",
    end: "2026-11-14T17:00:00+05:30",
    dateLabel: "NOV 14",
    format: "in-person",
    location: "Kerala, India",
    description:
      "An in-person gathering bringing the different perspectives together — students, educators, researchers, industry, policymakers and communities in one room, working on what can actually be built.",
    confirmed: true,
  },
  {
    id: "act",
    slug: "global-action-network",
    stage: "act",
    stageNumber: "05",
    title: "Global Action Network Update",
    audience: "The Global Action Network",
    question: "What have we built together?",
    start: "2026-12-10T15:00:00+05:30",
    end: "2026-12-10T18:00:00+05:30",
    dateLabel: "DEC 10",
    format: "online",
    description:
      "On Human Rights Day, the movement reports back to the Global Action Network: the evidence gathered, the ideas advanced, and the working prototypes taking shape — education, examined as a human right.",
    confirmed: true,
  },
  {
    id: "deliver",
    slug: "the-handover",
    stage: "deliver",
    stageNumber: "FINAL",
    title: "The Handover",
    audience: "Decision makers of every stakeholder group",
    question: "What will you carry forward?",
    start: "2027-01-26T10:00:00+05:30",
    end: "2027-01-26T17:00:00+05:30",
    dateLabel: "JAN 26",
    format: "in-person",
    description:
      "On Republic Day, the documentation and the working prototypes are formally handed over to the decision makers of every stakeholder group — including the relevant Union Ministry. The conversation becomes their mandate.",
    confirmed: true,
  },
];
