"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin/voices");
      router.refresh();
    } else {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Something went wrong — try again.");
    }
  }

  return (
    <main className="mx-auto max-w-sm py-16">
      <h1 className="display text-4xl">Organiser access</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Enter the organiser passcode to manage the Voices section.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="kicker">Passcode</span>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            autoFocus
            required
            className="mt-2 w-full border-2 border-ink bg-paper px-4 py-3 text-sm"
          />
        </label>
        {error && (
          <p role="alert" className="border-l-4 border-signal bg-signal/10 px-4 py-3 text-sm text-ink">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="condensed w-full bg-ink px-6 py-3.5 text-sm font-semibold tracking-[0.12em] text-paper transition-colors hover:bg-purple-deep disabled:opacity-50"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}
