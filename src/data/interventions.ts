import type { Intervention } from "@/lib/types";

/*
 * The Intervention / Action Model from "Bridging the Gap: Fostering Future
 * Skills in Education" (Bridge The Gap 1.0, 2023), transcribed faithfully
 * with spelling normalised only.
 *
 * HONESTY RULE: statuses and updates are set by the organising team, never
 * inferred or invented. "recorded" means: on the record since 2023, no
 * verified progress information yet. The single seeded update (P2) states
 * a fact this site itself makes true.
 */
export const interventions: Intervention[] = [
  /* ---- Government policy changes ---- */
  {
    slug: "g1",
    category: "government",
    text: "Acknowledge platform-based learning as equivalent to MOOC.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["policy"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "g2",
    category: "government",
    text: "Involve industry leaders in academic bodies.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["policy", "industry-academia-gap"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "g3",
    category: "government",
    text: "Creation of a workforce bench.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["policy", "employability"],
    relatedIdeaSlugs: [],
  },

  /* ---- University interventions ---- */
  {
    slug: "u1",
    category: "university",
    text: "Integrate platform-based self-learning into regular courses, with credits (sessional etc.).",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["assessment"],
    relatedIdeaSlugs: ["portfolio-assessment"],
  },
  {
    slug: "u2",
    category: "university",
    text: "Changes in course delivery: hybrid model.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["curriculum"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "u3",
    category: "university",
    text: "Decentralised evaluations with broad outlines to be adopted: faculty driven, outcome based, individual oriented.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["assessment"],
    relatedIdeaSlugs: ["portfolio-assessment"],
  },
  {
    slug: "u4",
    category: "university",
    text: "Professors by Practice.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["teacher-development"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "u5",
    category: "university",
    text: "Board of Studies to have participation by industry experts.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["industry-academia-gap"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "u6",
    category: "university",
    text: "Interns and persons on sabbatical can be part of the workforce bench.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["employability"],
    relatedIdeaSlugs: [],
  },

  /* ---- Industrial interventions ---- */
  {
    slug: "i1",
    category: "industry",
    text: "Industrial bodies to contribute: validate and calibrate, curate the platform content, guide learning.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["industry-academia-gap"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "i2",
    category: "industry",
    text: "Accept interns while they are still at college (remote or regular).",
    status: "in-motion",
    updates: [
      {
        date: "2026-08-25",
        note: "KTU approved the six month internship as an after effect of this discussion. Industry asked for it and the university acted. The next move belongs to industry: making internship opportunities like this available at scale.",
      },
    ],
    relatedTopicSlugs: ["employability"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "i3",
    category: "industry",
    text: "Provision for sabbatical for experts while retaining them as employees.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["industry-academia-gap"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "i4",
    category: "industry",
    text: "Formally allow subject experts to participate in the skilling process.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["industry-academia-gap"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "i5",
    category: "industry",
    text: "Recruit from the bench for short-term needs and proper hire.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["employability"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "i6",
    category: "industry",
    text: "Recruit-Train-Hire model to be adopted.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["employability", "skills"],
    relatedIdeaSlugs: [],
  },

  /* ---- Faculty orientation ---- */
  {
    slug: "f1",
    category: "faculty",
    text: "Activity-based, mentor-model teaching using the platform.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["teacher-development"],
    relatedIdeaSlugs: ["teacher-learning-circles"],
  },
  {
    slug: "f2",
    category: "faculty",
    text: "Faculty sabbatical at industry, and lead live student group projects.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["industry-academia-gap"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "f3",
    category: "faculty",
    text: "Faculty to be trained in individual development models rather than compliance models.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["teacher-development"],
    relatedIdeaSlugs: ["teacher-learning-circles"],
  },
  {
    slug: "f4",
    category: "faculty",
    text: "Shadow faculty at university for the internal processes.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["teacher-development"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "f5",
    category: "faculty",
    text: "Faculty to volunteer leading projects using the work bench.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["learning-communities"],
    relatedIdeaSlugs: [],
  },

  /* ---- Platform enablement ---- */
  {
    slug: "p1",
    category: "platform",
    text: "Strengthen the platform to enable various stakeholders.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: [],
    relatedIdeaSlugs: [],
  },
  {
    slug: "p2",
    category: "platform",
    text: "Track and display progress.",
    status: "in-motion",
    updates: [
      {
        date: "2026-08-25",
        note: "This page went live on capabilitycommons.com, delivering the intervention it belongs to: the movement's own recommendations, tracked and displayed in public.",
        sourceUrl: "https://capabilitycommons.com/interventions",
      },
    ],
    relatedTopicSlugs: [],
    relatedIdeaSlugs: [],
  },
  {
    slug: "p3",
    category: "platform",
    text: "Unique IDs for all students with the ability to track and monitor; integration with university systems.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: [],
    relatedIdeaSlugs: [],
  },
  {
    slug: "p4",
    category: "platform",
    text: "Platform provision for Professors by Practice and sabbatical experts.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: [],
    relatedIdeaSlugs: [],
  },
  {
    slug: "p5",
    category: "platform",
    text: "Provision for learning and reskilling for the bench; introduce the bench to freelancing.",
    status: "recorded",
    updates: [],
    relatedTopicSlugs: ["skills"],
    relatedIdeaSlugs: [],
  },
];
