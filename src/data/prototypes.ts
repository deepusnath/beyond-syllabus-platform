import type { Prototype } from "@/lib/types";

/*
 * ⚠ SAMPLE CONTENT — a fictional seed prototype demonstrating the
 * documentation format: problem → hypothesis → build → evidence.
 */
export const prototypes: Prototype[] = [
  {
    slug: "portfolio-pilot",
    title: "The Portfolio Pilot",
    problem:
      "Employers say they trust evidence of real work over marks — but no institution in the room offers students a structured way to produce and certify that evidence.",
    hypothesis:
      "If a cohort maintains an evidenced portfolio against a published capability rubric for one term, external reviewers will rate it a stronger hiring signal than the same cohort's marksheets.",
    solution:
      "A lightweight portfolio protocol: a public rubric, a review cadence, and an evidence format any student community can adopt without institutional permission.",
    team: ["Volunteer working group (sample)"],
    status: "building",
    implementation:
      "Rubric v0 drafted from the capability demands surfaced in Conversation 03. First cohort to be drawn from participating student communities after the November convergence.",
    evidence: [
      "Origin: portfolio-assessment idea (Conversations 01 and 03).",
      "Rubric dimensions derived from industry statements in the global relay.",
    ],
    conversationSlugs: ["what-needs-to-change", "capabilities-the-future-demands"],
    ideaSlug: "portfolio-assessment",
    topicSlugs: ["assessment", "employability", "industry-academia-gap"],
    sample: true,
  },
];
