import type { Conversation } from "@/lib/types";

/*
 * ⚠ SAMPLE CONTENT — these conversation records are fictional seed data
 * demonstrating the documentation format. Real records are published
 * after each event.
 */
export const conversations: Conversation[] = [
  {
    slug: "what-needs-to-change",
    title: "What needs to change?",
    eventId: "listen",
    date: "2026-08-15",
    participantSlugs: ["sample-student-voice", "sample-community-voice"],
    stakeholders: ["students", "community"],
    topicSlugs: ["student-agency", "assessment", "curriculum", "learning-communities"],
    summary:
      "The opening conversation of Beyond Syllabus. Students and student communities describe where the system loses them: assessment that rewards memory over capability, curricula that lag the world by a decade, and the absence of any channel through which learners can shape what they learn.",
    transcriptStatus: "in-progress",
    keyQuestions: [
      "Why does learning stop when the syllabus ends?",
      "Who is assessment actually for?",
      "What would students build if they could change one thing tomorrow?",
    ],
    observations: [
      "Students describe peer communities, not classrooms, as where their most useful learning happens.",
      "The gap is not motivation — it is the absence of legitimate alternatives to marks.",
    ],
    agreements: [
      "Assessment reform is the highest-priority demand across every student community present.",
      "Students want a permanent feedback channel into curriculum decisions.",
    ],
    disagreements: [
      "Whether change should come through the existing system or by building parallel structures alongside it.",
    ],
    proposedSolutions: [
      "A student-maintained public review of the curriculum, updated every term.",
      "Portfolio-based assessment piloted alongside — not instead of — existing exams.",
    ],
    resources: [
      {
        id: "doc-listen-summary",
        title: "Session summary (PDF)",
        kind: "summary",
        status: "in-development",
        sample: true,
      },
      {
        id: "doc-listen-transcript",
        title: "Full transcript",
        kind: "transcript",
        status: "in-development",
        sample: true,
      },
    ],
    sample: true,
  },
  {
    slug: "what-should-education-become",
    title: "What should education become?",
    eventId: "question",
    date: "2026-09-05",
    participantSlugs: ["sample-educator-voice", "sample-researcher-voice", "sample-policy-voice"],
    stakeholders: ["educators", "researchers", "policymakers"],
    topicSlugs: ["teacher-development", "assessment", "higher-education", "policy"],
    summary:
      "Academics and policymakers respond to the student conversation. The discussion moves from diagnosis to design: if the constraint is assessment, what would credible alternatives look like — and what would it take for policy to permit them at scale?",
    transcriptStatus: "pending",
    keyQuestions: [
      "What should education optimise for when content is freely available?",
      "What evidence would convince a regulator to permit alternative assessment?",
    ],
    observations: [
      "Educators and students converge on the same diagnosis from opposite directions.",
      "Policy participants stress that pilots with honest measurement move faster than mandates.",
    ],
    agreements: [
      "Teacher development is under-invested relative to its leverage.",
      "Pilots need published results — success or failure — to build policy credibility.",
    ],
    disagreements: [
      "How much standardisation is compatible with genuine learner agency.",
    ],
    proposedSolutions: [
      "Teacher-led learning circles with dedicated time inside the working week.",
      "A published evidence protocol for every Beyond Syllabus pilot.",
    ],
    resources: [
      {
        id: "doc-question-summary",
        title: "Session summary (PDF)",
        kind: "summary",
        status: "in-development",
        sample: true,
      },
    ],
    sample: true,
  },
  {
    slug: "capabilities-the-future-demands",
    title: "What capabilities will the future demand?",
    eventId: "connect",
    date: "2026-10-02",
    participantSlugs: ["sample-industry-voice", "sample-global-voice", "sample-community-voice"],
    stakeholders: ["industry", "global", "community"],
    topicSlugs: ["employability", "skills", "future-of-work", "ai-and-education", "industry-academia-gap"],
    summary:
      "Across the 24-hour relay, industry leaders and global communities compare what they hire for against what systems certify. A consistent picture emerges: evidence of real work — portfolios, contributions, shipped projects — is the signal employers trust most and education produces least.",
    transcriptStatus: "pending",
    keyQuestions: [
      "What do employers actually verify before they hire?",
      "Which capabilities survive contact with AI-assisted work?",
    ],
    observations: [
      "Every region reports the same degree-to-capability gap in different accents.",
      "Communities of practice repeatedly appear as the bridge institutions haven't built.",
    ],
    agreements: [
      "Portfolios of real work are a stronger signal than transcripts of covered content.",
    ],
    disagreements: [
      "Whether industry should co-design curriculum or simply publish its capability demands.",
    ],
    proposedSolutions: [
      "A shared, public capability framework that any learner can evidence against.",
    ],
    resources: [
      {
        id: "doc-connect-summary",
        title: "Relay documentation",
        kind: "summary",
        status: "in-development",
        sample: true,
      },
    ],
    sample: true,
  },
];
