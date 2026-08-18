"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { participateEmail } from "@/data/site";

/*
 * Stakeholder-first participation. Submissions are delivered by composing
 * an email to the organising team (participateEmail) — real delivery with
 * zero backend. The payload shape matches the participation model, so a
 * proper backend can replace the mailto handoff without changing the form.
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
  const [submitted, setSubmitted] = useState(false);

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
              onSubmit={(e) => {
                e.preventDefault();
                track({
                  name: "participation_submission",
                  stakeholder: selected.id,
                  action,
                });
                const data = new FormData(e.currentTarget);
                const subject = `[Beyond Syllabus] ${action} — ${selected.label}`;
                const body = [
                  `Name: ${data.get("name")}`,
                  `Email: ${data.get("email")}`,
                  `Organisation/community: ${data.get("organisation") || "—"}`,
                  `Path: ${selected.label}`,
                  `Action: ${action}`,
                  "",
                  String(data.get("message") || ""),
                ].join("\n");
                window.location.href = `mailto:${participateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                setSubmitted(true);
              }}
            >
              <p className="display text-2xl">
                {action} <span className="text-purple">·</span>{" "}
                <span className="text-ink-soft">{selected.label.toLowerCase()}</span>
              </p>
              <div className="mt-6 grid gap-5">
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
                      ? "The idea — what problem, what intervention?"
                      : action === "Propose a prototype"
                        ? "The prototype — what would you build, and why?"
                        : action === "Nominate a speaker"
                          ? "Who — and what idea do they bring?"
                          : "Anything we should know?"}
                  </span>
                  <textarea name="message" rows={5} className="mt-2 w-full border-2 border-ink bg-paper px-4 py-2.5 text-sm" />
                </label>
              </div>
              <button
                type="submit"
                className="condensed mt-8 inline-flex items-center gap-3 bg-ink px-7 py-4 text-base font-semibold tracking-[0.1em] text-paper transition-colors hover:bg-purple-deep"
              >
                Send it <span aria-hidden>→</span>
              </button>
              <p className="mt-4 text-xs text-ink-soft">
                Sending opens your email app with everything filled in, addressed to the organising
                team — press send there and you&apos;re in the conversation.
              </p>
            </form>
          )}

          {submitted && (
            <div role="status" className="mt-10 max-w-2xl border-l-4 border-mint bg-purple-soft/60 p-6">
              <p className="display text-2xl">Almost there — press send.</p>
              <p className="mt-2 text-sm text-ink-soft">
                Your email app should have opened with your details addressed to the organising
                team ({participateEmail}). Press send there to complete it. If it didn&apos;t open,
                email us directly at <span className="font-semibold">{participateEmail}</span> —
                or just show up on the next live date.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
