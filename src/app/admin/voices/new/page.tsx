import Link from "next/link";
import { getSessions } from "@/lib/content";
import { VoiceForm } from "@/components/admin/VoiceForm";

export default function NewVoicePage() {
  return (
    <main>
      <Link href="/admin/voices" className="condensed text-xs font-semibold tracking-[0.14em] text-purple-deep underline-offset-4 hover:underline">
        ← All voices
      </Link>
      <h1 className="display mt-3 text-4xl sm:text-5xl">Add a voice</h1>
      <div className="mt-10">
        <VoiceForm sessions={getSessions()} />
      </div>
    </main>
  );
}
