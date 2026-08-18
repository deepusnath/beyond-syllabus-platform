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

/* Example answers shown as placeholders for priming. Tab in an empty box
 * adopts the example as an editable starting point. */
const EXAMPLES = [
  "Move from syllabus completion to capability building: strengthen fundamentals, enable exploration beyond the syllabus, use flipped classrooms and peer-learning communities, connect learning to real-world problems, and recognise proof of work alongside examinations.",
  "Short term: Give students more autonomy, relax rigid attendance requirements, integrate responsible AI, activate peer-learning communities, and bring industry and real-world projects into campuses.\nLong term: Redesign curriculum, assessment, faculty roles, accreditation, and institutional structures around capabilities rather than content and credentials.",
  "1. Rethink assessment from testing memory to demonstrating capability.\n2. Transform classrooms from passive teaching to active, peer-led, experiential learning.\n3. Give students agency to explore, build, collaborate, and create verifiable proof of work beyond the syllabus.",
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
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Native share sheet (mobile mainly); detected after mount to avoid
    // a server/client render mismatch.
    const id = setTimeout(() => setCanNativeShare(typeof navigator.share === "function"), 0);
    return () => clearTimeout(id);
  }, []);

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

  const shareCaption =
    "I'm part of the conversation. I just added my voice to Beyond Syllabus, a six-month journey to redesign education for the next generation. Add yours at capabilitycommons.com #BeyondSyllabus @purplemovement";
  const shareUrl = "https://capabilitycommons.com/participate";

  async function shareBadge() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (!blob) return;
    const file = new File([blob], "beyond-syllabus-badge.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareCaption });
      } else if (navigator.share) {
        await navigator.share({ text: shareCaption, url: shareUrl });
      }
    } catch {
      // Cancelled by the user; nothing to do.
    }
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(shareCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; the caption is visible on screen anyway.
    }
  }

  const shareTargets = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareCaption)}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${shareCaption} ${shareUrl}`)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
  ];

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
          <div className="mt-8 space-y-5">
            <h3 className="display text-2xl">Now make it public.</h3>
            <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
              Share your badge, tag
              <span className="font-semibold text-ink"> @purplemovement</span>, add your answers
              in your own words (a short video works best), and ask one more person to join the
              conversation. That is how a conversation becomes a movement.
            </p>

            {canNativeShare && (
              <button
                type="button"
                onClick={shareBadge}
                className="condensed bg-purple px-7 py-4 text-base font-semibold tracking-[0.1em] text-white transition-colors hover:bg-purple-deep"
              >
                Share your badge
              </button>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {shareTargets.map((t) => (
                <a
                  key={t.label}
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="condensed border-2 border-ink px-4 py-2.5 text-xs font-semibold tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper"
                >
                  {t.label}
                </a>
              ))}
              <button
                type="button"
                onClick={copyCaption}
                className="condensed border-2 border-purple px-4 py-2.5 text-xs font-semibold tracking-[0.12em] text-purple-deep transition-colors hover:bg-purple hover:text-white"
              >
                {copied ? "Copied!" : "Copy caption"}
              </button>
            </div>

            <div className="max-w-xl border-l-4 border-purple bg-purple-soft/40 px-4 py-3">
              <p className="text-xs leading-relaxed text-ink-soft">{shareCaption}</p>
            </div>

            <button
              type="button"
              onClick={downloadBadge}
              className="condensed text-xs font-semibold tracking-[0.14em] text-purple-deep underline-offset-4 hover:underline"
            >
              Or download the badge image (best for Instagram posts)
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
              onKeyDown={(e) => {
                // Tab in an empty box adopts the example for editing.
                if (e.key === "Tab" && !answers[i].trim()) {
                  e.preventDefault();
                  setAnswers((prev) => prev.map((a, j) => (j === i ? EXAMPLES[i] : a)));
                }
              }}
              placeholder={EXAMPLES[i]}
              rows={4}
              maxLength={2000}
              className={`${input} placeholder:text-ink-soft/50`}
            />
            <span className="mt-1 block text-xs text-ink-soft/70">
              The shaded text is an example. Press Tab to start from it and make it yours, or just
              type your own.
            </span>
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
