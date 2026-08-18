# Handoff: Beyond Syllabus platform (capabilitycommons.com)

Written for a reader with zero memory of prior sessions. Checkpoint commit: `8d8a688`.

## Goal

Public platform for **Beyond Syllabus (Bridge The Gap 4.0)**, The Purple Movement's
six-month journey (Aug 2026 to Jan 2027) to redesign education, run by Deepu S Nath
(deepu@fayausa.com, GitHub/Vercel: deepusnath). The site documents six stakeholder
sessions in public, hosts a Capability Commons archive, an idea pipeline, a prototype
lab, an organiser admin, and a viral participation campaign. Everything culminates in
a handover of documentation + working prototypes to decision makers on Republic Day,
Jan 26 2027. The larger frame is Deepu's Capability Commons framework
(Access → Agency → Capability → Contribution); see the Claude memory directory and
his essay "The Fishbowl Is Not the Future" (medium.com/@deepusnath).

Live at **https://capabilitycommons.com** (Vercel project `beyond-syllabus`,
alias beyond-syllabus-pearl.vercel.app). Repo: github.com/deepusnath/beyond-syllabus-platform.
Push to `main` = auto-deploy to production (~1 min). The site is LIVE mid-campaign:
never push unverified work.

## Hard constraints

- **No em dashes (—) in any user-facing copy.** Deepu's explicit rule; reads as
  AI-generated. Restructure sentences instead. Code comments exempt.
- **Never fabricate content.** Real records carry real data; future events get
  future-tense previews; worked examples carry `sample: true` and render an
  "Illustrative example" badge. No invented speakers, quotes, reports, or URLs.
- **Design system is derived from the printed poster**: paper #fdfcfb, ink #16121a,
  purple #9c34d0 (poster text purple #9c2df4), mint #56efaa, signal #ff4b2b,
  Anton display / Oswald condensed / Inter body. Don't drift from it.
- **Client components must not import `src/lib/content.ts`** (pulls the whole
  archive into the global bundle; this was a real 48KB-on-every-page bug).
  Client-safe slices: `@/lib/live`, `@/lib/speakers-store`, `@/lib/stakeholders`.
- **Speaker slugs are immutable after publish** (public URLs exist).
- **X handle is @ThePurpleMVMT, Instagram is @tpm.live** (not @purplemovement).
- Journey dates and event data live only in `src/data/events.ts`; DateStrip and
  everything else derive from it. Do not hardcode dates elsewhere.

## Files that matter

- `src/data/*.ts` + `content/speakers.json`: ALL site content. speakers.json is the
  machine-writable store behind the admin (validated at build by
  `src/lib/speakers-store.ts`; malformed JSON fails the build on purpose).
- `src/lib/content.ts`: server-only content access layer (CMS swap point).
- `src/lib/live.ts`: live-status logic; the only content module client nav imports.
- `src/lib/vitruvian.ts`: THE campaign mark geometry (Vitruvian Student: ink limbs
  fit the square/syllabus, purple limbs reach the dotted circle). Single source for
  `src/components/VitruvianMark.tsx` (SVG), the canvas badge, and the OG renderer.
- `src/components/JoinTheConversation.tsx`: participation form (3 questions with
  Tab-to-adopt example placeholders), mailto delivery, canvas badge, share panel
  (auto-copy per-network captions, via= tracking).
- `src/app/voice/page.tsx` + `src/app/api/badge-og/route.tsx`: personalised share
  links; OG image is the participant's badge (ImageResponse, bundled Anton font in
  `src/fonts/`, OFL licence alongside). Voice pages are noindexed.
- Admin: `src/app/admin/**`, `src/app/api/admin/**`, `src/lib/admin-auth.ts`
  (HMAC cookie from ADMIN_SECRET), `src/lib/github-content.ts` (git-as-CMS: publish
  = atomic commit to main via GitHub API), `src/lib/voices-frame.ts` (sharp pipeline
  rendering uploads into the template headshot), `src/lib/voices-admin.ts`.
- `src/components/admin/PosterGenerator.tsx` + `public/poster-template/poster-base.png`:
  client-canvas poster generator; base is a blanked original poster. Poster geometry:
  portrait circle centre (1259.5, 1425) r=325 in 2000×2503; headshot files have their
  photo circle at (330,330) r=300 in a 660 box.
- `.claude/launch.json`: dev server config (port 3000).
- `README.md`: organiser guide + operations (env vars, token scoping, rotation).

## Decisions made (and why)

- **Git-as-CMS over a database**: every content change is a public, versioned commit;
  zero new infrastructure; repo stays the single source of truth. Fine-grained PAT
  (`GITHUB_CONTENT_TOKEN`, contents:write on this repo only) held server-side.
- **Shared organiser passcode** (`ADMIN_SECRET`) with derived HMAC session cookie:
  right size for a small trusted team; rotation = change env + redeploy. Security
  review passed; static-token trade-off documented in repo issue #8.
- **Link-first sharing** (the Spotify-Wrapped pattern): personalised /voice URLs
  whose OG image is the badge, because share intents cannot attach files on
  X/LinkedIn/Facebook. Native share sheet (files attached) on mobile.
- **Auto-copy captions on network click**: LinkedIn/Facebook open empty composers;
  users otherwise don't know what to type (user tested and hit exactly this).
- **The Vitruvian Student** as campaign mark (user rejected box/kite/staircase/
  fishbowl/ribbon sketches; chose the Leonardo direction). Option A (geometric,
  in-code) for all digital surfaces NOW; **Option B (authentic Vitruvian Man,
  public domain, purple ring composite) reserved for the December report cover**.
  A concept file exists at the session scratchpad but B is NOT to be built yet.
- **Dec 10 (Human Rights Day, 7-9 PM IST) and Jan 26 (Republic Day)** added as
  stages five and six; journey is "six-month", six verbs: Listen Question Connect
  Build Act Deliver.
- Singular stakeholder labels when describing one person, plural for groups
  (`stakeholderSingular` vs `stakeholderLabels` in `src/lib/stakeholders.ts`).
- Participation delivery via prefilled mailto to `participateEmail` in
  `src/data/site.ts` (currently deepu@fayausa.com) until a backend exists.

## Ruled out

- Attaching images via web share intents (platform-impossible; hence link-first).
- A separate CMS/database now (architecture is CMS-ready via content.ts when needed).
- Per-person OAuth for organisers (overkill for team size; upgrade path documented).
- Redrawn "Da Vinci style" figure by AI/code for option B (pastiche risk; use the
  authentic public-domain drawing instead, later).
- Regenerating posters server-side with satori for the poster generator (fonts and
  fidelity; client canvas with site fonts chosen instead).
- mulearn.org/r/* short links in the live player iframe (YouTube blocks watch pages
  in iframes; always resolve to youtube.com/embed/VIDEOID).

## Done so far (verifiable)

- Full site live: home, journey (6 stages), live player (auto LIVE state from event
  times; Oct 2 gets a timezone-aware relay UI), voices (15 real Session 1 speakers +
  Deepu), conversations (Session 1 real record with recording; 5 future-tense
  previews), commons (12 themes, real Fishbowl quotes), ideas/prototypes
  (illustrative, badged), outcomes (honest "in development"), participate
  (3-question form + badge + share), search, about; sitemap/robots/OG/JSON-LD.
- Organiser admin shipped (Sprint 1, milestone closed, repo issues #1-#9): add/edit/
  remove speakers from the web with template-exact headshot cropping; publish =
  commit; E2E verified in production including the GitHub write path.
- Poster generator with event selector (defaults to next upcoming event; session
  block, date, IST time auto-populate).
- Campaign package (commit 8d8a688) verified in production: /voice pages, badge-og
  endpoint (200, image/png), share panel.
- Housekeeping done: zero em dashes on all 11 pages (verified live), architecture
  refactor (bundle hygiene; homepage no longer ships the archive), social links in
  footer, alphabetical voices with clickable photos and back-links everywhere.

## Next steps (ordered, act-on-cold)

1. **Session 2 speakers**: waiting on Deepu for names/roles/orgs/photos (no files in
   Drive yet as of Aug 18; the Session-2 discussion doc exists in Drive folder
   1whlcaPi77dmirS365ehFu3ACycc1IxqB). When they arrive: organisers add via
   /admin/voices, or bulk-add by editing content/speakers.json + public/voices/*.jpg
   (crop pipeline in src/lib/voices-frame.ts expectations: 660px framed jpg).
2. **Session 2 poster base**: when the Sep 5 poster design exists, blank one poster
   (portrait circle + text blocks, coordinates above) into
   public/poster-template/ and extend PosterGenerator to pick a base per event.
3. **After Sep 5 session**: attach the real recording to the
   what-should-education-become conversation record (videoUrl, embed form), flip its
   summary to past tense, add documentation as it lands. Same pattern as Session 1.
4. **December report cover**: build Option B from the authentic Vitruvian Man
   (public domain, Wikimedia file Da_Vinci_Vitruve_Luc_Viatour.jpg) + purple dotted
   ring + plaque; add credit "after Leonardo da Vinci, c. 1490".
5. Consider: participation backend (replace mailto), reciprocity-rate metric in
   analytics, Sen citation in the outcomes/about copy (Deepu was advised, agreed in
   spirit; not yet in site copy).

## Commands

- Dev: `npm run dev` (or preview via .claude/launch.json, port 3000). Admin locally:
  `ADMIN_SECRET=test npm run dev`, passcode `test`; without GITHUB_CONTENT_TOKEN,
  admin publishes write to the working tree (dev fallback).
- Checks: `npx tsc --noEmit && npm run lint && npm run build` (lint via truncation
  has bitten before; read full output).
- Deploy: push to main (auto), or `vercel deploy --prod --yes` from repo root.
- Env (Vercel, production): NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_LIVE_STREAM_URL
  (YouTube /embed/ form only), NEXT_PUBLIC_FORCE_LIVE, ADMIN_SECRET,
  GITHUB_CONTENT_TOKEN. Organiser passcode: `vercel env pull` from repo root or
  Vercel dashboard (never printed here).
- Prod smoke: `curl -s https://capabilitycommons.com/api/badge-og?n=Test | head -c50`,
  check /voices, /participate, /voice?n=Test render 200.
