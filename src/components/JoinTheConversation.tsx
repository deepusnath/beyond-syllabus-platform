"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { participateEmail, site } from "@/data/site";
import { stakeholderSingular } from "@/lib/stakeholders";
import { drawVitruvian, vitruvian, VIT_INK, VIT_PURPLE } from "@/lib/vitruvian";

/*
 * The featured contribution: answer the movement's three questions, add an
 * optional public video, and share a personalised badge. Sharing follows
 * the link-first playbook: each participant gets a /voice URL whose OG
 * image is their server-rendered badge, so the badge shows on every
 * platform even where share intents cannot attach files. Captions are
 * per-network (correct handles, right length) and copy automatically.
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
const PAPER = "#fdfcfb";
const MINT = "#56efaa";

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
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, BADGE, BADGE);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = VIT_INK;
  ctx.font = `600 32px ${condensed}`;
  const headKicker = "BRIDGE THE GAP 4.0";
  ctx.fillText(headKicker, (BADGE - ctx.measureText(headKicker).width) / 2, 96);
  ctx.font = `400 74px ${display}`;
  const headTitle = "BEYOND SYLLABUS";
  ctx.fillText(headTitle, (BADGE - ctx.measureText(headTitle).width) / 2, 172);

  // The mark, centred, with its dotted circle clear of the header above
  // and the statement below (circle spans y 220 to 645 at this scale).
  drawVitruvian(ctx, (BADGE - 1000 * 0.56) / 2, 170, 0.56, 11);

  // Statement
  ctx.font = `400 58px ${display}`;
  const s1 = "I'M PART OF ";
  const s2 = "THE CONVERSATION.";
  const total = ctx.measureText(s1).width + ctx.measureText(s2).width;
  let sx = (BADGE - total) / 2;
  ctx.fillStyle = VIT_INK;
  ctx.fillText(s1, sx, 852);
  sx += ctx.measureText(s1).width;
  ctx.fillStyle = VIT_PURPLE;
  ctx.fillText(s2, sx, 852);

  // Name chip
  const displayName = name.trim() ? name.trim().toUpperCase() : "ADD YOUR VOICE";
  ctx.font = `600 38px ${condensed}`;
  const nameWidth = Math.min(ctx.measureText(displayName).width, 720);
  const chipX = (BADGE - nameWidth - 56) / 2;
  ctx.fillStyle = VIT_INK;
  ctx.fillRect(chipX, 886, nameWidth + 56, 70);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(displayName, chipX + 28, 933, 720);

  // Tagline + CTA
  ctx.fillStyle = "#4a4452";
  ctx.font = `italic 27px Georgia, serif`;
  const tag = vitruvian.tagline;
  ctx.fillText(tag, (BADGE - ctx.measureText(tag).width) / 2, 1002);
  ctx.font = `600 28px ${condensed}`;
  const cta = "JOIN AT CAPABILITYCOMMONS.COM";
  const ctaW = ctx.measureText(cta).width;
  ctx.fillStyle = MINT;
  ctx.fillRect((BADGE - ctaW - 44) / 2, 1022, ctaW + 44, 50);
  ctx.fillStyle = VIT_INK;
  ctx.fillText(cta, (BADGE - ctaW) / 2, 1057);
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
  const [notice, setNotice] = useState<string | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setCanNativeShare(typeof navigator.share === "function"), 0);
    return () => clearTimeout(id);
  }, []);

  const paint = useCallback(() => {
    if (canvasRef.current) drawBadge(canvasRef.current, name);
  }, [name]);

  useEffect(() => {
    if (!submitted) return;
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

  /* ---------- Sharing ---------- */

  const voiceUrl = (via: string) => {
    const q = new URLSearchParams({ n: name, as: stakeholder, via });
    return `${site.url}/voice?${q.toString()}`;
  };

  const captions: Record<string, string> = {
    x: `I'm part of the conversation. Add your voice to Beyond Syllabus, a six-month journey to redesign education for the next generation. ${voiceUrl("x")} #BeyondSyllabus @ThePurpleMVMT`,
    whatsapp: `I just added my voice to Beyond Syllabus, a movement to redesign education for our generation. Add yours: ${voiceUrl("whatsapp")}`,
    linkedin: `I just added my voice to Beyond Syllabus, The Purple Movement's six-month public conversation to redesign education for the next generation. Students, educators, researchers, industry and policymakers are building the record together, and it ends with working prototypes handed to decision makers on Republic Day. Add your voice: ${voiceUrl("linkedin")} #BeyondSyllabus`,
    facebook: `I just added my voice to Beyond Syllabus, a six-month public conversation to redesign education for the next generation. Add yours: ${voiceUrl("facebook")} #BeyondSyllabus`,
    instagram: `I'm part of the conversation. Beyond Syllabus is redesigning education for the next generation, in public. Add your voice at capabilitycommons.com/participate #BeyondSyllabus @tpm.live`,
    native: `I'm part of the conversation. Add your voice to Beyond Syllabus: ${voiceUrl("share")} #BeyondSyllabus`,
  };

  async function copy(text: string, message: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(message);
    } catch {
      setNotice("Copy didn't work in this browser. The caption is shown below, select and copy it.");
    }
  }

  async function shareNative() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    if (!blob) return;
    const file = new File([blob], "beyond-syllabus-badge.png", { type: "image/png" });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: captions.native });
      } else {
        await navigator.share({ text: captions.native });
      }
    } catch {
      // Cancelled; nothing to do.
    }
  }

  function downloadBadge() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "beyond-syllabus-badge.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  const NETWORKS = ["WhatsApp", "Instagram", "LinkedIn", "X", "Facebook"] as const;

  async function handleNetwork(network: (typeof NETWORKS)[number]) {
    switch (network) {
      case "WhatsApp":
        await copy(captions.whatsapp, "Caption copied. WhatsApp is opening with it prefilled.");
        window.open(`https://wa.me/?text=${encodeURIComponent(captions.whatsapp)}`, "_blank");
        break;
      case "Instagram":
        downloadBadge();
        await copy(
          captions.instagram,
          "Badge saved and caption copied. Open Instagram, create a post with the badge, and paste the caption.",
        );
        break;
      case "LinkedIn":
        await copy(captions.linkedin, "Caption copied. Paste it into the LinkedIn post.");
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(voiceUrl("linkedin"))}`,
          "_blank",
        );
        break;
      case "X":
        await copy(captions.x, "Caption copied and prefilled in the post.");
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(captions.x)}`, "_blank");
        break;
      case "Facebook":
        await copy(captions.facebook, "Caption copied. Paste it into the Facebook post.");
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(voiceUrl("facebook"))}`,
          "_blank",
        );
        break;
    }
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
          <div className="mt-8 space-y-5">
            <h3 className="display text-2xl">Now make it public.</h3>
            <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
              Pick a platform below. Your caption is copied automatically and your personal link
              shows your badge wherever it lands. Ask one more person to join the conversation.
              That is how a conversation becomes a movement.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {canNativeShare && (
                <button
                  type="button"
                  onClick={shareNative}
                  className="condensed bg-purple px-5 py-3 text-sm font-semibold tracking-[0.12em] text-white transition-colors hover:bg-purple-deep"
                >
                  Share…
                </button>
              )}
              {NETWORKS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => void handleNetwork(n)}
                  className="condensed border-2 border-ink px-4 py-2.5 text-xs font-semibold tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper"
                >
                  {n}
                </button>
              ))}
            </div>

            {notice && (
              <p role="status" className="max-w-xl border-l-4 border-mint bg-purple-soft/40 px-4 py-3 text-xs leading-relaxed text-ink">
                {notice}
              </p>
            )}

            <div className="max-w-xl text-xs leading-relaxed text-ink-soft">
              Your personal link:{" "}
              <button
                type="button"
                onClick={() => void copy(voiceUrl("link"), "Link copied.")}
                className="font-semibold text-purple-deep underline-offset-4 hover:underline"
              >
                {voiceUrl("link").replace(/^https?:\/\//, "").slice(0, 60)}
              </button>
            </div>

            <button
              type="button"
              onClick={downloadBadge}
              className="condensed text-xs font-semibold tracking-[0.14em] text-purple-deep underline-offset-4 hover:underline"
            >
              Download the badge image
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
        You&apos;ll also get a badge and a personal share link.
      </p>
    </form>
  );
}
