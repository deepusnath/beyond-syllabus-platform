# Beyond Syllabus — Digital Platform

The public platform for **Beyond Syllabus (Bridge The Gap 4.0)**, a four-month initiative by
**The Purple Movement** to redesign education for the next generation: documented public
conversations, livestreamed events, a knowledge commons, an idea pipeline, a prototype lab,
and the December 2026 outcomes record.

**From protest to prototype. From problems to possibilities. From conversation to action.**

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Quality checks:

```bash
npm run lint
npx tsc --noEmit
```

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css` under `@theme`)
- No other runtime dependencies

## Where everything lives

| Path | What it is |
| --- | --- |
| `src/app/globals.css` | Design tokens (colors, type, motion) derived from the poster |
| `src/lib/types.ts` | Content model: Event, Session, Speaker, Conversation, Topic, Idea, Prototype, Document, Partner |
| `src/data/*` | **The content.** Local structured data for V1 — edit these files to update the site |
| `src/lib/content.ts` | Content access layer — pages only import from here, so swapping in a CMS later touches one file |
| `src/lib/search.ts` | Global search index built from the content layer |
| `src/lib/analytics.ts` | Analytics abstraction (no tracking installed by default) |
| `src/components/*` | Reusable components (Hero, JourneyTimeline, LivePlayer, cards, …) |
| `src/app/*` | Routes: `/`, `/journey`, `/live`, `/voices[/slug]`, `/conversations[/slug]`, `/commons[/slug]`, `/ideas`, `/prototypes[/slug]`, `/outcomes`, `/participate`, `/about`, `/search` |
| `public/poster/`, `public/brand/` | The supplied poster and Purple Movement logo |

## Updating content

Everything renders from `src/data/`:

- **Events / journey dates** — `src/data/events.ts` (confirmed structure of the initiative)
- **Schedules & relay legs** — `src/data/sessions.ts`
- **Speakers** — `src/data/speakers.ts` (add a `photo` path under `public/` when available)
- **Conversation records** — `src/data/conversations.ts` (video URL, summary, transcript status, agreements/disagreements, resources)
- **Capability Commons themes** — `src/data/topics.ts`
- **Ideas** — `src/data/ideas.ts` (statuses: idea → exploring → prototyping → testing → validated → recommended)
- **Prototypes** — `src/data/prototypes.ts`
- **Site config & social links** — `src/data/site.ts`

### Illustrative examples

Entries carrying `sample: true` render a dashed **“Illustrative example”** badge everywhere they
appear — worked examples showing what a section will hold (ideas, prototypes) until the journey
produces real records. Replace them and remove the flag as real content lands. Future sessions
carry future-tense preview records, not fabricated ones.

### Livestream

The live experience is configuration driven:

```bash
NEXT_PUBLIC_LIVE_STREAM_URL="https://www.youtube.com/embed/<id>"  # embed URL
NEXT_PUBLIC_FORCE_LIVE=true                                        # optional manual override
```

Without a URL, `/live` shows a "stream will appear here" panel. The LIVE state otherwise flips
automatically from the event start/end times in `src/data/events.ts` (checked client-side every
30 seconds). On October 2 the page renders the 24-hour relay timeline, timezone-aware, from the
region legs in `src/data/sessions.ts`.

### Environment

```bash
NEXT_PUBLIC_SITE_URL=...           # canonical URL for metadata/sitemap
NEXT_PUBLIC_LIVE_STREAM_URL=...    # current/latest broadcast embed
NEXT_PUBLIC_FORCE_LIVE=true|false  # manual live override
ADMIN_SECRET=...                   # organiser passcode for /admin
GITHUB_CONTENT_TOKEN=...           # fine-grained PAT for publishing from the admin
```

## Organiser admin (`/admin/voices`)

Organisers manage the Voices section from the web — no developer needed.

**Getting in.** Open `/admin/voices` and enter the organiser passcode. Ask the site owner
for it. Sessions last 7 days per browser.

**Adding a voice.** *Add a voice* → fill name, role, organisation, stakeholder group and
session → choose a photo (a clear face shot, at least 600px wide, works best) → drag and
zoom until the face sits in the ring the way you want it — what you see is exactly the
published headshot → *Publish this voice*. The change goes live automatically in about a
minute. Bio and key idea are optional; leave them empty rather than guessing.

**Fixing mistakes.** Every voice has *Edit* (photo re-crop optional) and *Remove* (asks
for confirmation). The page address (slug) can't change after publishing.

**How it works (git-as-CMS).** Publishing commits `content/speakers.json` and the processed
headshot to `main` in one atomic commit via the GitHub API; the normal auto-deploy does the
rest. Every content change is therefore versioned and publicly attributable — in keeping
with the initiative's public-record ethos. The server needs `GITHUB_CONTENT_TOKEN`, a
**fine-grained PAT** (GitHub → Settings → Developer settings → Fine-grained tokens) scoped
to **only this repository** with **Contents: Read and write** — nothing else. Rotate it any
time; publishing fails safely with a clear error when it's missing. In local development
without the token, publishes write to the working tree instead.

**Secret rotation.** Change `ADMIN_SECRET` in Vercel env settings and redeploy — every
organiser session is invalidated immediately (the session cookie is derived from it).
Threat model note: the admin is a single-privilege gate for a small trusted team; the
session cookie is HTTP-only, never logged, and grants only what the passcode grants.
If the team grows beyond a shared passcode, per-person GitHub OAuth is the upgrade path.

## Architecture notes

- **CMS-ready**: pages never import `src/data` directly — only `src/lib/content.ts`. Point those
  accessors at Sanity/Strapi/Supabase/Postgres later without touching the presentation layer.
- **Admin-ready**: every managed surface (speakers, events, schedules, livestream URLs,
  documentation, transcripts, ideas, prototypes, reports) is a typed collection with stable slugs.
- **Search**: `buildSearchIndex()` flattens all content into typed records; move it behind an API
  route or hosted index when content outgrows the client.
- **Analytics**: `track()` in `src/lib/analytics.ts` is a no-op abstraction — wire a
  privacy-preserving provider there.
- **Participation forms** render fully but submit to a local acknowledgement (clearly labelled)
  until a backend is connected.
- **Accessibility**: semantic landmarks, keyboard-reachable filters/menu, visible focus states,
  `prefers-reduced-motion` respected, WCAG-AA contrast tokens.
- **SEO**: per-route metadata + OpenGraph, JSON-LD EventSeries on the homepage, `sitemap.xml`
  and `robots.txt` generated from the content layer.

## Honesty rules baked in

- No fabricated reports: `/outcomes` shows **IN DEVELOPMENT** until the December report exists.
- No invented speakers, partners, endorsements, quotes or URLs — illustrative examples are
  clearly labelled and never impersonate real records.
