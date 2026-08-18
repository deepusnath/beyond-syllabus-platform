import type { Metadata } from "next";
import { VitruvianMark } from "@/components/VitruvianMark";
import { CtaLink } from "@/components/ui";
import { isStakeholderGroup, stakeholderSingular } from "@/lib/stakeholders";
import { sanitizeName } from "@/lib/voice-share";
import { vitruvian } from "@/lib/vitruvian";

/*
 * Personalised share landing: every participant's share link points here,
 * and the page's OG image is their server-rendered badge, so the badge
 * shows on every platform's link card. The page itself recruits: a
 * friend's badge leads straight into joining.
 *
 * Infinite name-parameter variants exist, so the page is noindexed.
 */

type Params = { searchParams: Promise<{ n?: string; as?: string }> };

export async function generateMetadata({ searchParams }: Params): Promise<Metadata> {
  const { n, as: asParam } = await searchParams;
  const name = sanitizeName(n);
  const query = new URLSearchParams();
  if (n) query.set("n", n);
  if (asParam) query.set("as", asParam);
  return {
    title: `${name} is part of the conversation`,
    description:
      "Beyond Syllabus is a six-month public journey to redesign education for the next generation. The record is built from voices. Add yours.",
    robots: { index: false, follow: true },
    openGraph: {
      images: [{ url: `/api/badge-og?${query.toString()}`, width: 1200, height: 630 }],
    },
  };
}

export default async function VoicePage({ searchParams }: Params) {
  const { n, as: asParam } = await searchParams;
  const name = sanitizeName(n);
  const role = isStakeholderGroup(asParam) ? stakeholderSingular[asParam] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
      <VitruvianMark className="mx-auto w-64 sm:w-80" />
      <p className="kicker mt-8 justify-center">
        {role ? `A ${role.toLowerCase()} voice of the movement` : "A voice of the movement"}
      </p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">
        {name} is part of
        <br />
        <span className="text-purple">the conversation.</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
        Beyond Syllabus is a six-month public journey to redesign education for the next
        generation. The record is built from voices like this one. Are you in it yet?
      </p>
      <p className="mt-6 font-serif text-lg italic text-ink-soft">{vitruvian.tagline}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <CtaLink href="/participate" tone="purple">
          Add my voice
        </CtaLink>
        <CtaLink href="/conversations" tone="outline">
          Explore the record
        </CtaLink>
      </div>
    </div>
  );
}
