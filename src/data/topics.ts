import type { Topic } from "@/lib/types";

/*
 * Capability Commons themes. The themes themselves are the confirmed
 * structure of the archive; aggregated content within them is sample
 * seed data until real documentation lands.
 */
export const topics: Topic[] = [
  {
    slug: "curriculum",
    title: "Curriculum",
    description: "What is taught, who decides, and how fast it can change.",
    conversationSlugs: ["what-needs-to-change"],
    ideaSlugs: ["open-curriculum-review"],
    prototypeSlugs: [],
    quotes: [],
  },
  {
    slug: "assessment",
    title: "Assessment",
    description: "How learning is measured — and how measurement shapes learning.",
    conversationSlugs: ["what-needs-to-change", "what-should-education-become"],
    ideaSlugs: ["portfolio-assessment"],
    prototypeSlugs: ["portfolio-pilot"],
    quotes: [
      {
        text: "Assessment is the hidden curriculum — change it and everything moves.",
        attribution: "Learning sciences researcher, Conversation 02",
        sample: true,
      },
    ],
  },
  {
    slug: "employability",
    title: "Employability",
    description: "The distance between graduation and the first real job.",
    conversationSlugs: ["capabilities-the-future-demands"],
    ideaSlugs: ["portfolio-assessment"],
    prototypeSlugs: ["portfolio-pilot"],
    quotes: [],
  },
  {
    slug: "ai-and-education",
    title: "AI & Education",
    description: "What machine intelligence changes about what humans should learn.",
    conversationSlugs: ["capabilities-the-future-demands"],
    ideaSlugs: [],
    prototypeSlugs: [],
    quotes: [],
  },
  {
    slug: "teacher-development",
    title: "Teacher Development",
    description: "The people the system depends on, and how they grow.",
    conversationSlugs: ["what-should-education-become"],
    ideaSlugs: ["teacher-learning-circles"],
    prototypeSlugs: [],
    quotes: [
      {
        text: "Reform the teacher's experience first; the classroom follows.",
        attribution: "Professor of Education, Conversation 02",
        sample: true,
      },
    ],
  },
  {
    slug: "student-agency",
    title: "Student Agency",
    description: "Learners as co-designers of their own education, not recipients of it.",
    conversationSlugs: ["what-needs-to-change"],
    ideaSlugs: ["portfolio-assessment", "open-curriculum-review"],
    prototypeSlugs: [],
    quotes: [
      {
        text: "Why does learning stop when the syllabus ends?",
        attribution: "Student organiser, Conversation 01",
        sample: true,
      },
    ],
  },
  {
    slug: "skills",
    title: "Skills",
    description: "Capabilities the future demands — named, practised, and evidenced.",
    conversationSlugs: ["capabilities-the-future-demands"],
    ideaSlugs: [],
    prototypeSlugs: [],
    quotes: [],
  },
  {
    slug: "higher-education",
    title: "Higher Education",
    description: "Universities between their past shape and their future role.",
    conversationSlugs: ["what-should-education-become"],
    ideaSlugs: [],
    prototypeSlugs: [],
    quotes: [],
  },
  {
    slug: "industry-academia-gap",
    title: "Industry–Academia Gap",
    description: "Bridging the two systems that keep failing to meet.",
    conversationSlugs: ["capabilities-the-future-demands"],
    ideaSlugs: ["portfolio-assessment"],
    prototypeSlugs: ["portfolio-pilot"],
    quotes: [],
  },
  {
    slug: "policy",
    title: "Policy",
    description: "How evidence becomes recommendation, and recommendation becomes rule.",
    conversationSlugs: ["what-should-education-become"],
    ideaSlugs: [],
    prototypeSlugs: [],
    quotes: [],
  },
  {
    slug: "future-of-work",
    title: "Future of Work",
    description: "The moving target education is supposed to prepare people for.",
    conversationSlugs: ["capabilities-the-future-demands"],
    ideaSlugs: [],
    prototypeSlugs: [],
    quotes: [],
  },
  {
    slug: "learning-communities",
    title: "Learning Communities",
    description: "Peer structures that teach what institutions don't.",
    conversationSlugs: ["what-needs-to-change", "capabilities-the-future-demands"],
    ideaSlugs: ["teacher-learning-circles"],
    prototypeSlugs: [],
    quotes: [
      {
        text: "Communities of practice are education infrastructure.",
        attribution: "Learning community founder, Conversation 01",
        sample: true,
      },
    ],
  },
];
