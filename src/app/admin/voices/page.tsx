import Link from "next/link";
import { getSessions } from "@/lib/content";
import { getAuthoritativeSpeakers } from "@/lib/voices-admin";
import { AdminVoiceRow, LogoutButton } from "@/components/admin/AdminVoicesList";

export const dynamic = "force-dynamic";

export default async function AdminVoicesPage() {
  const speakers = (await getAuthoritativeSpeakers()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const sessions = getSessions();
  const sessionTitle = (id: string) => sessions.find((s) => s.id === id)?.title ?? id;

  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-4xl sm:text-5xl">Voices</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/voices/new"
            className="condensed bg-purple px-5 py-3 text-sm font-semibold tracking-[0.12em] text-white hover:bg-purple-deep"
          >
            + Add a voice
          </Link>
          <LogoutButton />
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-ink-soft">
        Everything here publishes straight to the public site — each change is a commit and goes
        live with the automatic deploy in about a minute.
      </p>

      <ul className="mt-10 divide-y divide-purple-line border-y border-purple-line">
        {speakers.map((s) => (
          <AdminVoiceRow key={s.slug} speaker={s} sessionTitle={sessionTitle(s.sessionIds[0] ?? "")} />
        ))}
      </ul>
    </main>
  );
}
