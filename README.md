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

### Sample content

Seed entries carry `sample: true` and render a dashed **“Sample content”** badge everywhere they
appear. Replace them with confirmed records as the initiative progresses; remove the flag and the
badge disappears.

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
```

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
- No invented speakers, partners, endorsements or URLs — sample data is fictional and labelled.
