import type { Idea } from "@/lib/types";

/*
 * ⚠ SAMPLE CONTENT — fictional seed ideas demonstrating how ideas are
 * captured and evolve through the status pipeline.
 */
export const ideas: Idea[] = [
  {
    slug: "portfolio-assessment",
    title: "Portfolio-based assessment, piloted alongside exams",
    problem:
      "High-stakes exams certify memory of covered content, not capability. Employers discount the signal; students optimise for the wrong target.",
    intervention:
      "Run a term-long pilot where a cohort maintains an evidenced portfolio of real work, assessed against a published rubric — alongside, not instead of, existing exams — and publish the comparison.",
    originConversationSlug: "what-needs-to-change",
    contributors: ["Student communities (Conversation 01)", "Industry voices (Conversation 03)"],
    stakeholders: ["students", "industry", "educators"],
    evidence: [
      "Consistent student demand across communities in Conversation 01.",
      "Industry participants in Conversation 03 named portfolios as their most-trusted hiring signal.",
    ],
    feasibility: "high",
    status: "prototyping",
    topicSlugs: ["assessment", "employability", "industry-academia-gap", "student-agency"],
    sample: true,
  },
  {
    slug: "open-curriculum-review",
    title: "A public, student-maintained curriculum review",
    problem:
      "Curricula lag the world they prepare students for, and there is no standing channel through which learners can flag the gap.",
    intervention:
      "A public review of the curriculum, maintained by student communities and updated every term — what is stale, what is missing, what deserves to exist — addressed to the bodies that own curriculum decisions.",
    originConversationSlug: "what-needs-to-change",
    contributors: ["Student communities (Conversation 01)"],
    stakeholders: ["students", "educators", "policymakers"],
    evidence: ["Proposed and seconded across multiple student communities in Conversation 01."],
    feasibility: "medium",
    status: "exploring",
    topicSlugs: ["curriculum", "student-agency"],
    sample: true,
  },
  {
    slug: "teacher-learning-circles",
    title: "Teacher-led learning circles inside the working week",
    problem:
      "Teacher development is treated as an occasional training event, not a working practice — so classrooms change slower than everything around them.",
    intervention:
      "Protected weekly time for teacher-led peer learning circles, modelled on the communities of practice that already work outside institutions.",
    originConversationSlug: "what-should-education-become",
    contributors: ["Educators (Conversation 02)", "Community leaders (Conversation 01)"],
    stakeholders: ["educators", "community", "policymakers"],
    evidence: ["Educator consensus in Conversation 02 that development time is the binding constraint."],
    feasibility: "medium",
    status: "idea",
    topicSlugs: ["teacher-development", "learning-communities"],
    sample: true,
  },
];
