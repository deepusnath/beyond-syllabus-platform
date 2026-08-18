"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { participateEmail } from "@/data/site";
import { stakeholderSingular } from "@/lib/stakeholders";
import { ringPoints } from "@/lib/util";

/*
 * The featured contribution: answer the movement's three questions, add an
 * optional public video, and receive a shareable "part of the conversation"
 * badge drawn on canvas in the brand style. Delivery uses the same mailto
 * handoff as the other participation forms.
 */

export const QUESTIONS = [
  "What must change in curriculum, teaching, assessment, and learning environments?",
  "What can we change now, and what requires long-term systemic transformation?",
  "What are the top 3 priorities academia should start working on today?",
] as const;

const BADGE = 1080;

function drawBadge(canvas: HTMLCanvasElement, name: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const probe = (cls: string) => {
    const el = document.createElement("span");
    el.className = cls;
    el.textContent = "x";
    document.body.appendChild(el);
    const family = getComputedStyle(el).fontFamily;
    el.remove();
    return family;
  };
  const display = probe("display");
  const condensed = probe("condensed");

  ctx.clearRect(0, 0, BADGE, BADGE);
  ctx.fillStyle = "#fdfcfb";
  ctx.fillRect(0, 0, BADGE, BADGE);

  // Brand ribbon down the right edge with the dotted ring on it.
  const grad = ctx.createLinearGradient(980, 0, 1080, BADGE);
  grad.addColorStop(0, "#b44ce4");
  grad.addColorStop(1, "#7a24ad");
  ctx.fillStyle = grad;
  ctx.fillRect(972, 0, 108, BADGE);
  ctx.fillStyle = "#ffffff";
  for (const p of ringPoints(26, 1026, 200, 64)) {
    ctx.beginPath();
    ctx.arc(Number(p.x), Number(p.y), 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#16121a";
  ctx.font = `600 34px ${condensed}`;
  ctx.fillText("BRIDGE THE GAP 4.0", 84, 150);
  ctx.font = `400 92px ${display}`;
  ctx.fillText("BEYOND SYLLABUS", 84, 250);

  ctx.font = `400 120px ${display}`;
  ctx.fillText("I'M PART OF", 84, 480);
  ctx.fillStyle = "#9c2df4";
  ctx.fillText("THE", 84, 600);
  ctx.fillText("CONVERSATION.", 84, 720);

  // Name chip.
  const displayName = name.trim() ? name.trim().toUpperCase() : "ADD YOUR VOICE";
  ctx.font = `600 40px ${condensed}`;
  const nameWidth = Math.min(ctx.measureText(displayName).width, 700);
  ctx.fillStyle = "#16121a";
  ctx.fillRect(84, 780, nameWidth + 56, 76);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(displayName, 112, 830, 700);

  // Call to action chip.
  ctx.font = `600 32px ${condensed}`;
  const cta = "JOIN AT CAPABILITYCOMMONS.COM";
  ctx.fillStyle = "#56efaa";
  ctx.fillRect(84, 940, ctx.measureText(cta).width + 48, 64);
  ctx.fillStyle = "#16121a";
  ctx.fillText(cta, 108, 984);
}

export function JoinTheConversation() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [stakeholder, setStakeholder] = useState("students");
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const paint = useCallback(() => {
    if (canvasRef.current) drawBadge(canvasRef.current, name);
  }, [name]);

  useEffect(() => {
    if (!submitted) return;
    // Deferred a tick so fonts and canvas are ready after the state swap.
    const id = setTimeout(paint, 50);
    return () => clearTimeout(id);
  }, [submitted, paint]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!answers.some((a) => a.trim())) {
      setError("Answer at least one of the three questions. That answer is the contribution.");
      return;
    }
    setError(null);
    track({ name: "participation_submission", stakeholder, action: "Join the conversation" });
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Organisation/community: ${organisation || "-"}`,
      `Speaking as: ${stakeholderSingular[stakeholder as keyof typeof stakeholderSingular] ?? stakeholder}`,
      `Video link: ${videoUrl || "-"}`,
      "",
      ...QUESTIONS.flatMap((q, i) => [`Q${i + 1}. ${q}`, answers[i].trim() || "-", ""]),
    ].join("\n");
    const subject = `[Beyond Syllabus] Voice: ${name || "a new participant"}`;
    window.location.href = `mailto:${participateEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  }

  function downloadBadge() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "beyond-syllabus-part-of-the-conversation.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  const input = "mt-2 w-full border-2 border-ink bg-paper px-4 py-2.5 text-sm";

  if (submitted) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <div>
          <div role="status" className="border-l-4 border-mint bg-purple-soft/50 p-6">
            <p className="display text-3xl">Your voice is in. Press send.</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Your email app should have opened with your answers addressed to the organising team
              ({participateEmail}). Press send there to complete it. If it didn&apos;t open, email
              us directly.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <h3 className="display text-2xl">Now make it public.</h3>
            <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
              Download your badge and post it on your profile. Tag
              <span className="font-semibold text-ink"> @purplemovement</span>, share your answers
              in your own words (a short video works best), and ask one more person to join the
              conversation. That is how a conversation becomes a movement.
            </p>
            <button
              type="button"
              onClick={downloadBadge}
              className="condensed bg-purple px-7 py-4 text-base font-semibold tracking-[0.1em] text-white transition-colors hover:bg-purple-deep"
            >
              Download your badge
            </button>
          </div>
        </div>
        <div className="border-2 border-ink bg-white p-2">
          <canvas ref={canvasRef} width={BADGE} height={BADGE} className="h-auto w-full" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border-4 border-ink p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="kicker">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="name" className={input} />
        </label>
        <label className="block">
          <span className="kicker">Email</span>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={input} />
        </label>
        <label className="block">
          <span className="kicker">Organisation / community (optional)</span>
          <input value={organisation} onChange={(e) => setOrganisation(e.target.value)} maxLength={120} className={input} />
        </label>
        <label className="block">
          <span className="kicker">I am speaking as</span>
          <select value={stakeholder} onChange={(e) => setStakeholder(e.target.value)} className={input}>
            {Object.entries(stakeholderSingular).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 space-y-6">
        {QUESTIONS.map((q, i) => (
          <label key={q} className="block">
            <span className="condensed flex gap-3 text-sm font-semibold tracking-[0.08em] text-ink">
              <span className="text-purple">0{i + 1}</span>
              {q}
            </span>
            <textarea
              value={answers[i]}
              onChange={(e) =>
                setAnswers((prev) => prev.map((a, j) => (j === i ? e.target.value : a)))
              }
              rows={3}
              maxLength={2000}
              className={input}
            />
          </label>
        ))}
      </div>

      <label className="mt-8 block">
        <span className="kicker">Video link (optional, recommended)</span>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://..."
          className={input}
        />
        <span className="mt-2 block max-w-xl text-xs leading-relaxed text-ink-soft">
          Record a short video with your answers, post it on your own social media, and paste the
          link here. Voices shared in public invite more people into the conversation.
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-6 border-l-4 border-signal bg-signal/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="condensed mt-8 inline-flex items-center gap-3 bg-purple px-8 py-4 text-base font-semibold tracking-[0.1em] text-white transition-colors hover:bg-purple-deep"
      >
        Add my voice <span aria-hidden>→</span>
      </button>
      <p className="mt-4 text-xs text-ink-soft">
        Sending opens your email app with everything filled in, addressed to the organising team.
        You&apos;ll also get a badge to share.
      </p>
    </form>
  );
}
