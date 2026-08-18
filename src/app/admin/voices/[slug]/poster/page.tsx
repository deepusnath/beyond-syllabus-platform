import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthoritativeSpeakers } from "@/lib/voices-admin";
import { getEvents } from "@/lib/content";
import { PosterGenerator } from "@/components/admin/PosterGenerator";

export const dynamic = "force-dynamic";

export default async function VoicePosterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const speaker = (await getAuthoritativeSpeakers()).find((s) => s.slug === slug);
  if (!speaker) notFound();

  return (
    <main>
      <Link href="/admin/voices" className="condensed text-xs font-semibold tracking-[0.14em] text-purple-deep underline-offset-4 hover:underline">
        ← All voices
      </Link>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Poster: {speaker.name}</h1>
      <div className="mt-10">
        <PosterGenerator speaker={speaker} events={getEvents()} />
      </div>
    </main>
  );
}
