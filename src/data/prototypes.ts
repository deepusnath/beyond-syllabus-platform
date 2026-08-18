import type { Prototype } from "@/lib/types";

/*
 * The prototype lab. Real prototypes emerge from the idea pipeline after
 * the November convergence; until then the lab holds one ILLUSTRATIVE
 * EXAMPLE (sample: true — rendered with a visible badge) showing the
 * documentation every prototype will carry.
 */
export const prototypes: Prototype[] = [
  {
    slug: "portfolio-pilot",
    title: "The Portfolio Pilot",
    problem:
      "Employers say they trust evidence of real work over marks — but few institutions offer students a structured way to produce and certify that evidence.",
    hypothesis:
      "If a cohort maintains an evidenced portfolio against a published capability rubric for one term, external reviewers will rate it a stronger hiring signal than the same cohort's marksheets.",
    solution:
      "A lightweight portfolio protocol: a public rubric, a review cadence, and an evidence format any student community can adopt without institutional permission.",
    team: ["To be formed after the November convergence"],
    status: "research",
    implementation:
      "Nothing is being built yet — this illustrative example shows the documentation each prototype will carry in public: the problem it attacks, its testable hypothesis, the build log, the evidence behind it, and its honest results. The first real prototypes are selected from the idea pipeline at the November 14 convergence and developed toward the January 26 handover.",
    evidence: [
      "Grounded in the assessment arguments of the movement's published thinking.",
      "Evidence from the documented conversations will be linked here as prototypes become real.",
    ],
    conversationSlugs: ["what-needs-to-change", "capabilities-the-future-demands"],
    ideaSlug: "portfolio-assessment",
    topicSlugs: ["assessment", "employability", "industry-academia-gap"],
    sample: true,
  },
];
