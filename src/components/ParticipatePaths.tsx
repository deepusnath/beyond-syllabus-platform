"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { participateEmail } from "@/data/site";

/*
 * Stakeholder-first participation. Submissions POST to /api/participate,
 * which records each one as a commit on the submissions branch. If that
 * fails (offline, endpoint down), the form falls back to composing an
 * email to the organising team (participateEmail) so nothing is lost.
 */

const paths = [
  { id: "student", label: "I'm a student", detail: "The system is about you. Start by being heard." },
  { id: "educator", label: "I'm an educator", detail: "You hold the classroom. Help redesign it." },
  { id: "researcher", label: "I'm a researcher", detail: "Bring evidence the room can't argue with." },
  { id: "industry", label: "I'm from industry", detail: "Say what capability actually looks like." },
  { id: "policymaker", label: "I'm a policymaker", detail: "Help ideas survive contact with policy." },
  { id: "community", label: "I lead a community", detail: "Communities are education infrastructure." },
] as const;

const actions = [
  "Attend a session",
  "Submit an idea",
  "Share research / evidence",
  "Volunteer",
  "Nominate a speaker",
  "Propose a prototype",
  "Join a working group",
];

export function ParticipatePaths() {
  const [selected, setSelected] = useState<(typeof paths)[number] | null>(null);
  const [action, setAction] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<false | "server" | "mailto">(false);
  const [sending, setSending] = useState(false);
  const [failReason, setFailReason] = useState<string | null>(null);

  return (
    <div>
      {/* Step 1: who are you */}
      <ol className="grid gap-px border border-ink bg-ink sm:grid-cols-2 lg:grid-cols-3">
        {paths.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => {
                setSelected(p);
                setSubmitted(false);
                setAction(null);
              }}
              aria-pressed={selected?.id === p.id}
              className={`flex h-full w-full flex-col p-7 text-left transition-colors ${
                selected?.id === p.id ? "bg-purple text-white" : "bg-paper hover:bg-purple-soft"
              }`}
            >
              <span className="display text-2xl sm:text-3xl">{p.label}</span>
              <span className={`mt-3 text-sm ${selected?.id === p.id ? "text-white/85" : "text-ink-soft"}`}>
                {p.detail}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {/* Step 2: how you contribute */}
      {selected && (
        <section aria-label="Choose how to contribute" className="mt-12">
          <h2 className="kicker">How do you want to contribute?</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => {
                  setAction(a);
                  setSubmitted(false);
                }}
                aria-pressed={action === a}
                className={`condensed px-4 py-2.5 text-xs font-semibold tracking-[0.12em] transition-colors ${
                  action === a ? "bg-ink text-paper" : "border-2 border-ink hover:bg-purple-soft"
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Step 3: the form */}
          {action && !submitted && (
            <form
              className="mt-10 max-w-2xl border-2 border-ink p-6 sm:p-8"
              onSubmit={async (e) => {
                e.preventDefault();
                if (sending) return;
                track({
                  name: "participation_submission",
                  stakeholder: selected.id,
                  action,
                });
                const data = new FormData(e.currentTarget);
                const fields = {
                  name: String(data.get("name") || ""),
                  email: String(data.get("email") || ""),
                  organisation: String(data.get("organisation") || ""),
                  message: String(data.get("message") || ""),
                  website: String(data.get("website") || ""),
                };
                setSending(true);
                try {
                  const res = await fetch("/api/participate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      form: "participate",
                      stakeholder: selected.id,
                      action,
                      ...fields,
                    }),
                  });
                  if (res.ok) {
                    setSubmitted("server");
                    return;
                  }
                  setFailReason(`server answered ${res.status}`);
                } catch {
                  setFailReason("the request could not be sent");
                } finally {
                  setSending(false);
                }
                const subject = `[Beyond Syllabus] ${action} | ${selected.label}`;
                const body = [
                  `Name: ${fields.name}`,
                  `Email: ${fields.email}`,
                  `Organisation/community: ${fields.organisation || "-"}`,
                  `Path: ${selected.label}`,
                  `Action: ${action}`,
                  "",
                  fields.message,
                ].join("\n");
                window.location.href = `mailto:${participateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                setSubmitted("mailto");
              }}
            >
              <p className="display text-2xl">
                {action} <span className="text-purple">·</span>{" "}
                <span className="text-ink-soft">{selected.label.toLowerCase()}</span>
              </p>
              <div className="mt-6 grid gap-5">
                {/* Honeypot: hidden from people, filled by naive bots. */}
                <label className="hidden" aria-hidden="true">
                  Website
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>
                <label className="block">
                  <span className="kicker">Name</span>
                  <input required name="name" type="text" autoComplete="name" className="mt-2 w-full border-2 border-ink bg-paper px-4 py-2.5 text-sm" />
                </label>
                <label className="block">
                  <span className="kicker">Email</span>
                  <input required name="email" type="email" autoComplete="email" className="mt-2 w-full border-2 border-ink bg-paper px-4 py-2.5 text-sm" />
                </label>
                <label className="block">
                  <span className="kicker">Organisation / community (optional)</span>
                  <input name="organisation" type="text" className="mt-2 w-full border-2 border-ink bg-paper px-4 py-2.5 text-sm" />
                </label>
                <label className="block">
                  <span className="kicker">
                    {action === "Submit an idea"
                      ? "The idea: what problem, what intervention?"
                      : action === "Propose a prototype"
                        ? "The prototype: what would you build, and why?"
                        : action === "Nominate a speaker"
                          ? "Who are they, and what idea do they bring?"
                          : "Anything we should know?"}
                  </span>
                  <textarea name="message" rows={5} className="mt-2 w-full border-2 border-ink bg-paper px-4 py-2.5 text-sm" />
                </label>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="condensed mt-8 inline-flex items-center gap-3 bg-ink px-7 py-4 text-base font-semibold tracking-[0.1em] text-paper transition-colors hover:bg-purple-deep disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send it"} <span aria-hidden>→</span>
              </button>
              <p className="mt-4 text-xs text-ink-soft">
                Your submission goes straight to the organising team. We only use your email to
                follow up on what you send.
              </p>
            </form>
          )}

          {submitted === "server" && (
            <div role="status" className="mt-10 max-w-2xl border-l-4 border-mint bg-purple-soft/60 p-6">
              <p className="display text-2xl">Received. You&apos;re in the conversation.</p>
              <p className="mt-2 text-sm text-ink-soft">
                Your submission is recorded with the organising team. If you want to add anything,
                email us at <span className="font-semibold">{participateEmail}</span>, or just show
                up on the next live date.
              </p>
            </div>
          )}
          {submitted === "mailto" && (
            <div role="status" className="mt-10 max-w-2xl border-l-4 border-mint bg-purple-soft/60 p-6">
              <p className="display text-2xl">Almost there. Press send.</p>
              <p className="mt-2 text-sm text-ink-soft">
                We couldn&apos;t reach the server, so your email app should have opened with your
                details addressed to the organising team ({participateEmail}). Press send there to
                complete it. If it didn&apos;t open, email us directly at{" "}
                <span className="font-semibold">{participateEmail}</span>, or just show up on the
                next live date.
              </p>
              {failReason && (
                <p className="mt-2 text-xs text-ink-soft/70">Technical detail: {failReason}.</p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
