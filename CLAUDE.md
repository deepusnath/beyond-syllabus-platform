@AGENTS.md

# Beyond Syllabus platform (capabilitycommons.com)

LIVE production site, mid-campaign. Push to main auto-deploys in ~1 min; verify before pushing.

## Commands
- Checks: `npx tsc --noEmit && npm run lint && npm run build` (read full lint output, not tails)
- Dev: `npm run dev` (port 3000); admin locally: `ADMIN_SECRET=test npm run dev`
- Deploy: push to main, or `vercel deploy --prod --yes`

## Architecture rules
- All content lives in `src/data/*` + `content/speakers.json`; pages read only via
  `src/lib/content.ts` (server-only). Client components must NOT import content.ts:
  use `@/lib/live`, `@/lib/speakers-store`, `@/lib/stakeholders` instead (bundle-size rule).
- Journey/event dates exist only in `src/data/events.ts`; everything derives from it.
- Admin publishing is git-as-CMS: commits to main via GitHub API (`src/lib/github-content.ts`).
  Speaker slugs are immutable once published.
- Campaign mark geometry: `src/lib/vitruvian.ts` is the single source for SVG, canvas
  badge, and the OG renderer (`/api/badge-og`, bundled Anton font in `src/fonts/`).
- Livestream URLs must be YouTube `/embed/<id>` form (watch pages refuse iframes).

## Content conventions
- No em dashes (—) in user-facing copy, ever (owner's rule). Restructure sentences.
- Never fabricate: real records only; future events get future-tense previews;
  worked examples carry `sample: true` ("Illustrative example" badge).
- Singular stakeholder labels for one person, plural for groups (`src/lib/stakeholders.ts`).
- Handles: X @ThePurpleMVMT, Instagram @tpm.live.

## Task state
See `.claude/handoff.md` for the current handoff (goals, decisions, next steps).
