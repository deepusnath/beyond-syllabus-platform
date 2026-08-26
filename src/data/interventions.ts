import type { Intervention } from "@/lib/types";

/*
 * The Intervention / Action Model from "Bridging the Gap: Fostering Future
 * Skills in Education" (Bridge The Gap 1.0, 2023), transcribed faithfully
 * with spelling normalised only.
 *
 * HONESTY RULE: statuses and updates are set by the organising team, never
 * inferred or invented. "recorded" means: on the record since 2023, no
 * verified progress information yet. The 2026-08-25 updates come from a
 * public-evidence review approved by the organising team; every update
 * cites its source, flags evidence that predates the 2023 model (which is
 * never claimed as an outcome), and carries critical notes where progress
 * is thinner than it looks.
 */
export const interventions: Intervention[] = [
  /* ---- Government policy changes ---- */
  {
    slug: "g1",
    category: "government",
    text: "Acknowledge platform-based learning as equivalent to MOOC.",
    status: "in-motion",
    updates: [
      {
        date: "2023-04-10",
        note: "UGC notified the National Credit Framework, which creditises learning from any platform duly recognised by the concerned regulatory body, including edTech courses. KTU's 2024 regulations similarly accept MOOCs from agencies its academic council approves. Honest reading: the policy door is open, but no order yet names a community platform as MOOC equivalent. The recommendation stays open until one walks through.",
        sourceUrl: "https://www.ugc.gov.in/pdfnews/0493222_Final-SOP_for_operationalization_of_NCrF_in_HEI.pdf",
      },
    ],
    relatedTopicSlugs: ["policy"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "g2",
    category: "government",
    text: "Involve industry leaders in academic bodies.",
    status: "in-motion",
    updates: [
      {
        date: "2026-08-25",
        note: "KTU's B.Tech Regulations 2024 created an Industry Linked Board of Studies and gave industry a formal role in designing elective content. Critical note: that is one university body, not the wider statutory involvement this recommendation asked for. No public order names industry leaders on syndicates or academic councils.",
        sourceUrl: "http://me.cet.ac.in/downloads/26-09-2025/B.Tech%20Academic%20Regulations%20KTU%202024%20Scheme.pdf",
      },
    ],
    relatedTopicSlugs: ["policy", "industry-academia-gap"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "g3",
    category: "government",
    text: "Creation of a workforce bench.",
    status: "in-motion",
    updates: [
      {
        date: "2025-03-25",
        note: "Kerala already runs a state talent bench: the Knowledge Economy Mission's Digital Workforce Management System, launched in 2021, before this model was written. The ledger does not claim it as an outcome. The post-2023 development is MuLearn 4.0, launched by the Chief Minister in March 2025 with the stated aim of a future ready talent bank for the state.",
        sourceUrl: "https://www.theweek.in/wire-updates/national/2025/03/25/mes12-kl-skill-summit.html",
      },
    ],
    relatedTopicSlugs: ["policy", "employability"],
    relatedIdeaSlugs: [],
  },

  /* ---- University interventions ---- */
  {
    slug: "u1",
    category: "university",
    text: "Integrate platform-based self-learning into regular courses, with credits (sessional etc.).",
    status: "in-motion",
    updates: [
      {
        date: "2026-08-25",
        note: "KTU's 2024 curriculum embeds credited MOOCs in the regular scheme, and Kerala's four year UG programme lets universities count online course credits. Critical view: credits flow to approved MOOC providers, not yet to community platform learning. No public order counts μLearn karma toward KTU activity points, which is the specific integration this recommendation implies.",
        sourceUrl: "https://www.nssce.ac.in/pdf/KTU_B.%20Tech_%20Curriculum_%202024.pdf",
      },
    ],
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
    status: "in-motion",
    updates: [
      {
        date: "2024-09-07",
        note: "KTU conferred autonomous status, with own curriculum and evaluation, on four affiliated colleges (order U.O.No. 2474/2024). Its 2024 regulations also shift weight toward faculty conducted internal evaluation and mandate outcome mapping. Honest scale check: four colleges out of roughly 150 is a beginning, not decentralisation.",
        sourceUrl: "https://sjcetpalai.ac.in/wp-content/uploads/2025/05/UO-No.2474-2024-KTU-Conferring-autonomous-status-to-4-colleges-3.pdf",
      },
    ],
    relatedTopicSlugs: ["assessment"],
    relatedIdeaSlugs: ["portfolio-assessment"],
  },
  {
    slug: "u4",
    category: "university",
    text: "Professors by Practice.",
    status: "in-motion",
    updates: [
      {
        date: "2025-06-04",
        note: "CUSAT implemented Professor of Practice through Syndicate orders issued between September 2024 and June 2025, including an industry sponsored category. Two honest caveats: the national UGC guidelines behind it date from 2022 and predate this model, and one university has acted. No KTU wide adoption order was found.",
        sourceUrl: "https://iqac.cusat.ac.in/initiatives/Professor%20of%20Practice.pdf",
      },
    ],
    relatedTopicSlugs: ["teacher-development"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "u5",
    category: "university",
    text: "Board of Studies to have participation by industry experts.",
    status: "adopted",
    updates: [
      {
        date: "2026-08-25",
        note: "KTU's B.Tech Regulations 2024 establish an Industry Linked Board of Studies that reviews and approves industry designed electives, with industry playing a pivotal role in course content, in force from academic year 2024-25. This adopts the letter of the recommendation; its worth now depends on how actively the body is used, and no notification yet names its industry members.",
        sourceUrl: "http://me.cet.ac.in/downloads/26-09-2025/B.Tech%20Academic%20Regulations%20KTU%202024%20Scheme.pdf",
      },
    ],
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
  // Added by the organising team on 2026-08-25 through the yearly review
  // cycle; the KTU order itself is the evidence.
  {
    slug: "u7",
    category: "university",
    text: "Six month internships during the degree, without a break of study.",
    status: "adopted",
    updates: [
      {
        date: "2023-11-25",
        note: "KTU issued order U.O.No. 3068/2023/KTU revising the B.Tech internship norms: students can undertake a long term internship of four to six months in the eighth semester without a break of study. Industry asked for it and the university acted. The next move belongs to industry: making internship opportunities like this available at scale.",
        sourceUrl: "/documents/3068-2023-KTU.pdf",
      },
    ],
    relatedTopicSlugs: ["employability", "industry-academia-gap"],
    relatedIdeaSlugs: [],
  },

  /* ---- Industrial interventions ---- */
  {
    slug: "i1",
    category: "industry",
    text: "Industrial bodies to contribute: validate and calibrate, curate the platform content, guide learning.",
    status: "in-motion",
    updates: [
      {
        date: "2024-04-30",
        note: "Launchpad Kerala runs on μLearn with companies supplying problem statements and assessment tasks across its levels, from web and mobile to AI and cybersecurity. Honest caveat: the formal industry curation framework, GTech's Academia and Technology Focus Group, dates from the platform's 2021 launch, so much of the structure predates this model.",
        sourceUrl: "https://www.onmanorama.com/career-and-campus/top-news/2024/04/30/kerala-it-firms-unveil-launchpad-for-fresh-talent-recruitment.html",
      },
    ],
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
        date: "2024-04-30",
        note: "Launchpad Kerala, run on μLearn for final year students, produced 80 job offers in its 2023 edition and drew over 100 IT firms in 2024, and μLearn Career Labs runs a live internship board with named GTech companies. With KTU's six month internship approved (see U7), the remaining test is scale: opportunities for every student who is ready, not only the top of the rank list.",
        sourceUrl: "https://www.onmanorama.com/career-and-campus/top-news/2024/04/30/kerala-it-firms-unveil-launchpad-for-fresh-talent-recruitment.html",
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
    status: "in-motion",
    updates: [
      {
        date: "2026-08-25",
        note: "Mentoring by industry professionals is built into μLearn: companies are invited to contribute expertise at no cost and Launchpad supplies domain mentors. What is still missing is the formal employer side arrangement this recommendation asked for, companies officially allotting employee time to skilling rather than relying on volunteers.",
        sourceUrl: "https://mulearn.org/be-a-part/company",
      },
    ],
    relatedTopicSlugs: ["industry-academia-gap"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "i5",
    category: "industry",
    text: "Recruit from the bench for short-term needs and proper hire.",
    status: "in-motion",
    updates: [
      {
        date: "2026-08-25",
        note: "μLearn's karma ranked pool of over 60,000 members now works as a hiring bench: gigs for short term needs, and Launchpad rank lists feeding regular hires into more than 100 companies. Critical note: the bench exists, but hiring from it still happens mainly through annual events rather than as routine industry practice.",
        sourceUrl: "https://launchpad.mulearn.org/",
      },
    ],
    relatedTopicSlugs: ["employability"],
    relatedIdeaSlugs: [],
  },
  {
    slug: "i6",
    category: "industry",
    text: "Recruit-Train-Hire model to be adopted.",
    status: "in-motion",
    updates: [
      {
        date: "2023-01-23",
        note: "Kerala Skills Express, launched by the Knowledge Economy Mission with GTech in January 2023, committed to knowledge economy job opportunities on a train and deploy model. Critical note: the programme's own site is no longer online and no public follow up reports its results. That silence is exactly what this ledger exists to surface.",
        sourceUrl: "https://gtechindia.org/events/kerala-skills-express",
      },
    ],
    relatedTopicSlugs: ["employability", "skills"],
    relatedIdeaSlugs: [],
  },

  /* ---- Faculty orientation ---- */
  {
    slug: "f1",
    category: "faculty",
    text: "Activity-based, mentor-model teaching using the platform.",
    status: "in-motion",
    updates: [
      {
        date: "2026-08-25",
        note: "μLearn's campus chapter model requires an anchor faculty mentor and formal faculty Enablers, more than 80 colleges have adopted it, and named faculty run award winning chapters at colleges including MBCET. Honest boundary: this pedagogy lives in the co-curricular chapter. It has not yet been shown reaching regular classrooms, which is what the recommendation ultimately asks.",
        sourceUrl: "https://mulearn.org/be-a-part/campus",
      },
    ],
    relatedTopicSlugs: ["teacher-development"],
    relatedIdeaSlugs: ["teacher-learning-circles"],
  },
  {
    slug: "f2",
    category: "faculty",
    text: "Faculty sabbatical at industry, and lead live student group projects.",
    status: "in-motion",
    updates: [
      {
        date: "2024-02-24",
        note: "KTU's Vice Chancellor publicly committed to faculty industry immersion in partnership with GTech and CII, and AICTE's national Industry Fellowship now places faculty in industry for a paid year. Honest reading: a stated commitment and a national scheme are motion, not a Kerala implementation. No KTU order exists yet.",
        sourceUrl: "https://hybiz.tv/gtech-organises-mulearn-seminar-at-technopark/",
      },
    ],
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
    status: "adopted",
    updates: [
      {
        date: "2025-03-25",
        note: "The platform grew from roughly 17,000 members in 2022 to more than 60,000, serving four stakeholder tracks: learners, mentors, campuses and companies. After 2023 it added Top 100 Coders with Kerala Startup Mission, Launchpad, Permute and, in March 2025, MuLearn 4.0, launched by the Chief Minister with the aim of a future ready talent bank. The strengthening this recommendation asked for has happened; the test now is converting scale into the outcomes the rest of this ledger tracks.",
        sourceUrl: "https://www.theweek.in/wire-updates/national/2025/03/25/mes12-kl-skill-summit.html",
      },
    ],
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
    status: "in-motion",
    updates: [
      {
        date: "2026-08-25",
        note: "Every μLearn member carries a unique μID with karma tracked on public leaderboards, and universities sit inside the platform's founding framework. Two honest caveats: most of this predates 2023, and the integration the model actually implies, karma recognised inside university systems such as KTU activity points, has no public order behind it. That is the unfinished half.",
        sourceUrl: "https://mulearn.org/",
      },
    ],
    relatedTopicSlugs: [],
    relatedIdeaSlugs: [],
  },
  {
    slug: "p4",
    category: "platform",
    text: "Platform provision for Professors by Practice and sabbatical experts.",
    status: "in-motion",
    updates: [
      {
        date: "2026-08-25",
        note: "Mentors are a core role on μLearn, with an in app mentor directory and industry experts contributing at no cost. Critical note: no dedicated, named provision for Professors by Practice or sabbatical experts exists on the platform yet, so this remains a general mentoring capability rather than the specific mechanism recommended.",
        sourceUrl: "https://mulearn.org/",
      },
    ],
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
