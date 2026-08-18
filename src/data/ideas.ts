import type { Idea } from "@/lib/types";

/*
 * The idea pipeline. Until the documented conversations produce their
 * first real ideas, the pipeline holds ILLUSTRATIVE EXAMPLES (sample:
 * true — rendered with a visible badge): worked examples, grounded in
 * the movement's published thinking, that show how an idea travels from
 * conversation to recommendation. Each is replaced by real records as
 * they emerge.
 */
export const ideas: Idea[] = [
  {
    slug: "portfolio-assessment",
    title: "Portfolio-based assessment, piloted alongside exams",
    problem:
      "High-stakes examinations concentrate enormous consequence behind a narrow gate: they certify memory of covered content rather than demonstrated capability, and too much of a learner's future rides on too little evidence.",
    intervention:
      "A term-long pilot in which a cohort maintains an evidenced portfolio of real work, assessed against a published rubric, run alongside existing exams rather than replacing them, with the comparison published either way.",
    contributors: ["Illustrative example, drawn from the movement's published positions"],
    stakeholders: ["students", "industry", "educators"],
    evidence: [
      "A central argument of the movement's published thinking. See “The Fishbowl Is Not the Future”.",
      "Evidence from the documented conversations will be linked here as it accumulates.",
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
      "Curricula lag the world they prepare students for, and there is no standing channel through which learners can flag the gap to the bodies that own curriculum decisions.",
    intervention:
      "A public review of the curriculum, maintained by student communities and updated every term (what is stale, what is missing, what deserves to exist) and addressed openly to curriculum bodies.",
    contributors: ["Illustrative example, the kind of idea the student sessions are designed to surface"],
    stakeholders: ["students", "educators", "policymakers"],
    evidence: ["Evidence from the documented conversations will be linked here as it accumulates."],
    feasibility: "medium",
    status: "exploring",
    topicSlugs: ["curriculum", "student-agency"],
    sample: true,
  },
  {
    slug: "teacher-learning-circles",
    title: "Teacher-led learning circles inside the working week",
    problem:
      "Teacher development is treated as an occasional training event rather than a working practice, so classrooms change slower than everything around them.",
    intervention:
      "Protected weekly time for teacher-led peer learning circles, modelled on the communities of practice that already work outside institutions.",
    contributors: ["Illustrative example, the kind of idea the educator sessions are designed to surface"],
    stakeholders: ["educators", "community", "policymakers"],
    evidence: ["Evidence from the documented conversations will be linked here as it accumulates."],
    feasibility: "medium",
    status: "idea",
    topicSlugs: ["teacher-development", "learning-communities"],
    sample: true,
  },
];
