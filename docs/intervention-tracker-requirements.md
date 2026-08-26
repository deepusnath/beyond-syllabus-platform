# Requirements: Intervention Tracker (Bridge The Gap Action Model)

Status: DRAFT for approval. No implementation until sign-off.
Source document: "Bridging the Gap: Fostering Future Skills in Education (Symposium)",
Bridge The Gap first edition, 2023.

## 1. Purpose and framing

Bridge The Gap 1.0 (2023) ended the way most symposiums end: with a document. That
document contained an Intervention / Action Model, a five-column matrix of concrete
recommendations for government, universities, industry, faculty, and the platform.

This feature adds a public page that puts every one of those interventions on the
record and tracks what has happened to each since 2023, edition over edition, into
the current Beyond Syllabus (4.0) journey and toward the January 26 handover.

The framing is accountability: the movement's own recommendations, tracked with the
same honesty it asks of institutions. The page also closes a loop: the 2023 model's
own Platform Enablement column requested "Track and display progress." This page is
that intervention, delivered.

## 2. Hard constraints

- **No fabricated progress.** Claude/implementers do not know the real-world status
  of any 2023 intervention. Every status and every update entry must come from the
  organising team. The page ships with all interventions in a neutral initial state
  ("Recorded 2023, progress updates being gathered") until the team supplies real
  statuses via the checklist in section 8.
- **Faithful transcription.** Intervention text is transcribed from the 2023 document,
  lightly normalised for spelling only. The original five-column structure is preserved
  as the page's grouping, because it is the historical artifact being tracked.
- House rules apply: no em dashes in copy, design system unchanged, client components
  do not import `content.ts`, all data behind the content layer.

## 3. Data model

New types in `src/lib/types.ts`:

```ts
type InterventionCategory = "government" | "university" | "industry" | "faculty" | "platform";

type InterventionStatus =
  | "recorded"      // transcribed from 2023; no verified progress information yet
  | "in-motion"     // verified activity is underway somewhere
  | "adopted"       // implemented by at least one institution/body (updates say where)
  | "evolved"       // absorbed into a newer intervention/idea (updates say which)
  | "stalled";      // attempted and honestly acknowledged as not progressing

interface InterventionUpdate {
  date: string;            // ISO date
  note: string;            // what happened, plain language
  sourceUrl?: string;      // optional evidence link
}

interface Intervention {
  slug: string;
  category: InterventionCategory;
  text: string;            // faithful 2023 wording, normalised spelling only
  status: InterventionStatus;
  updates: InterventionUpdate[];          // newest first in display
  relatedTopicSlugs: string[];            // Capability Commons themes it maps to
  relatedIdeaSlugs: string[];             // current idea-pipeline continuations
}
```

Data lives in `src/data/interventions.ts`, read through `src/lib/content.ts`
(`getInterventions()`), consistent with every other collection. Updating is by
repo edit (organiser cadence for this data is monthly at most); an admin editor is
explicitly out of scope for v1 (section 7).

Edition metadata (a small `editions` constant) records the lineage the page can
honestly document today: 1.0 (2023, the source symposium) and 4.0 (2026, Beyond
Syllabus). Editions 2.0 and 3.0 are NOT included until their documents are provided
(open question Q2).

## 4. The seeded interventions (faithful transcript, 25 items)

Grouped by the original matrix columns. Initial status for ALL items: `recorded`.

Government Policy changes
- G1: Acknowledge platform-based learning as equivalent to MOOC.
- G2: Involve industry leaders in academic bodies.
- G3: Creation of a workforce bench.

University Interventions
- U1: Integrate platform-based self-learning into regular courses, with credits (sessional etc.).
- U2: Changes in course delivery: hybrid model.
- U3: Decentralised evaluations with broad outlines: faculty driven, outcome based, individual oriented.
- U4: Professors by Practice.
- U5: Board of Studies to have participation by industry experts.
- U6: Interns and persons on sabbatical can be part of the workforce bench.

Industrial interventions
- I1: Industrial bodies to contribute: validate and calibrate, curate platform content, guide learning.
- I2: Accept interns while they are still at college (remote or regular).
- I3: Provision for sabbatical for experts while retaining them as employees.
- I4: Formally allow subject experts to participate in the skilling process.
- I5: Recruit from the bench for short-term needs and proper hire.
- I6: Recruit-Train-Hire model to be adopted.

Faculty orientation
- F1: Activity-based, mentor-model teaching using the platform.
- F2: Faculty sabbatical at industry; lead live student group projects.
- F3: Faculty to be trained in individual development models rather than compliance models.
- F4: Shadow faculty at university for the internal processes.
- F5: Faculty to volunteer leading projects using the work bench.

Platform enablement
- P1: Strengthen the platform to enable various stakeholders.
- P2: Track and display progress.
- P3: Unique IDs for all students with ability to track and monitor; integration with university systems.
- P4: Platform provision for Professors by Practice and sabbatical experts.
- P5: Provision for learning and reskilling for the bench; introduce the bench to freelancing.

Related-theme mapping (editorial, links only, no status claims), proposed:
assessment (U1, U3), employability (I2, I5, I6, G3), industry-academia-gap
(G2, U5, I1, I3, I4, F2), teacher-development (F1, F3, F4, U4), skills (I6, P5),
policy (G1, G2, G3), learning-communities (F5), curriculum (U2). Related ideas:
portfolio-assessment (U1, U3), teacher-learning-circles (F1, F3).

Special note on P2: its first update entry, dated to this feature's launch date,
reads that this page itself delivers the intervention. That is a true, verifiable
statement and the only update the implementation may seed itself.

## 5. Page requirements

Route: `/interventions` (working name; see Q3). Static (SSG), no client data needs
beyond a small filter.

Structure, top to bottom:
1. Header. Kicker "Bridge The Gap · since 2023". Title: "The intervention ledger".
   Lede explains: the 2023 symposium produced an action model; this page tracks
   every recommendation in it, honestly, until each is adopted, evolved, or
   acknowledged as stalled. States plainly that statuses come from the organising
   team and that "recorded" means no verified progress information yet.
2. Lineage strip: BTG 1.0 (2023) and BTG 4.0 (2026, links to /journey), with the
   source document named. No invented editions.
3. Summary strip: counts by status, rendered from data (e.g. "25 recorded",
   growing into "3 adopted, 7 in motion..." as the team verifies).
4. The model, grouped in the five original columns (rendered as stacked sections
   on mobile, five-column reference preserved in labels). Each intervention row:
   ID chip (G1...), faithful text, status chip, and a native disclosure
   (<details>/<summary> or equivalent accessible toggle) opening the dated update
   timeline plus related theme/idea links. No per-intervention routes in v1.
5. Status filter (client component, small): All / each status. Filtering is the
   only interactivity.
6. Footer CTA: connect to the present. "The 2026 journey continues this work" with
   links to /journey and /participate.

Status chip colours use the existing token palette (mint for adopted, purple for
in-motion, ink outline for recorded, soft for evolved, signal for stalled).

## 6. Integration requirements

- Nav: add "Interventions" to the secondary nav row (Conversations, Ideas, ...).
- Search: interventions indexed in `buildSearchIndex()` (type "intervention",
  href to /interventions).
- Outcomes page: one sentence + link, because the ledger is part of what the
  January handover inherits.
- Sitemap: add /interventions.
- Metadata: title, description, OG (standard pattern).

## 7. Non-goals for v1 (explicit)

- No admin UI for interventions (repo-edited data; revisit if update cadence grows).
- No per-intervention detail pages.
- No BTG 2.0/3.0 content until source documents are provided.
- No automatic status inference from anywhere. Humans set statuses.
- Panel member names from the 2023 document are not displayed until approved (Q4).

## 8. Required input from the organising team (blocking full value, not launch)

A status pass over the 25 items: for each, either "recorded" (default, fine) or a
status + one dated update line + optional evidence link. Example format:
"U1: in-motion. 2025-xx-xx: <what happened>. <link>". The page launches with all
items "recorded" and zero invented updates; it becomes powerful as real statuses land.

## 9. Open questions (answer before or after approval)

- Q1: Approve the route and name: /interventions, "The intervention ledger"?
  Alternatives: /action-model, /progress.
- Q2: Do BTG 2.0 and 3.0 produce documents like the 2023 one? If yes, share them
  and the lineage strip and model gain those editions.
- Q3: Should the secondary nav label be "Interventions" or "Action Model"?
- Q4: May the page credit the 2023 panel members by name (they appear in the
  source document)? Real names are displayed only with your approval.

## 10. Acceptance criteria

1. /interventions renders all 25 interventions, grouped in the five original
   columns, each with faithful text and an ID.
2. All statuses ship as "recorded" except updates explicitly supplied by the team;
   P2 carries the single self-referential launch update.
3. Status filter works; disclosure timelines are keyboard accessible.
4. Interventions appear in global search; nav, sitemap, outcomes link in place.
5. Zero em dashes; light and dark themes render correctly; build, lint, tsc clean.
6. Data flows through content.ts; no client import of the content layer.
