"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Speaker } from "@/lib/types";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
      }}
      className="condensed border-2 border-ink px-4 py-3 text-sm font-semibold tracking-[0.12em] hover:bg-purple-soft"
    >
      Log out
    </button>
  );
}

export function AdminVoiceRow({ speaker, sessionTitle }: { speaker: Speaker; sessionTitle: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/voices/${speaker.slug}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Could not remove — try again.");
      setConfirming(false);
    }
  }

  return (
    <li className="flex flex-wrap items-center gap-4 py-4">
      {speaker.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={speaker.photo} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
      ) : (
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-soft text-lg font-bold text-purple">
          {speaker.name.charAt(0)}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{speaker.name}</p>
        <p className="truncate text-sm text-ink-soft">
          {speaker.role} · {speaker.organisation}
        </p>
        <p className="condensed mt-0.5 text-[0.65rem] tracking-[0.14em] text-purple-deep">{sessionTitle}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/voices/${speaker.slug}`}
          className="condensed px-3 py-2 text-xs font-semibold tracking-[0.12em] text-purple-deep underline-offset-4 hover:underline"
        >
          View
        </Link>
        <Link
          href={`/admin/voices/${speaker.slug}/edit`}
          className="condensed border-2 border-ink px-3 py-2 text-xs font-semibold tracking-[0.12em] hover:bg-purple-soft"
        >
          Edit
        </Link>
        <Link
          href={`/admin/voices/${speaker.slug}/poster`}
          className="condensed border-2 border-purple px-3 py-2 text-xs font-semibold tracking-[0.12em] text-purple-deep hover:bg-purple hover:text-white"
        >
          Poster
        </Link>
        {confirming ? (
          <span className="flex items-center gap-2">
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="condensed bg-signal px-3 py-2 text-xs font-semibold tracking-[0.12em] text-white disabled:opacity-50"
            >
              {busy ? "Removing…" : "Confirm remove"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="condensed px-2 py-2 text-xs tracking-[0.12em] text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="condensed border-2 border-signal px-3 py-2 text-xs font-semibold tracking-[0.12em] text-signal hover:bg-signal hover:text-white"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p role="alert" className="w-full text-sm text-signal">{error}</p>}
    </li>
  );
}
