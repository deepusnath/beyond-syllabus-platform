"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Event, Speaker } from "@/lib/types";

/*
 * Renders the official announcement poster for a voice on a client-side
 * canvas: the blanked poster template + the published headshot clipped
 * into the P-loop counter + session, date, time and name blocks drawn
 * from data. The organiser picks which event the poster announces; it
 * defaults to the next upcoming session. Client-side deliberately: the
 * browser already has the site's fonts loaded.
 *
 * Geometry measured from the original posters (2000×2503).
 */

const W = 2000;
const H = 2503;
const CIRCLE = { cx: 1259.5, cy: 1425, r: 325 };
const HEADSHOT = { c: 330, r: 300, size: 660 };

const PURPLE = "#9c2df4";
const MINT = "#56efaa";
const INK = "#07000b";

const TEXT_X = 1038;
const TEXT_MAX_WIDTH = 860;
const NAME_BASELINE = 2175;
const ROLE_BASELINE = 2237;
const ORG_BASELINE = 2288;
const BAR = { x: 1038, y: 2340, w: 437, h: 10 };

const IST = "Asia/Kolkata";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

function ordinal(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return "TH";
  return ["TH", "ST", "ND", "RD"][day % 10 <= 3 ? day % 10 : 0];
}

function eventDateParts(event: Event) {
  const d = new Date(event.start);
  const opt = (o: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString("en-US", { timeZone: IST, ...o }).toUpperCase();
  const time = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      timeZone: IST,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  const day = Number(d.toLocaleDateString("en-US", { timeZone: IST, day: "numeric" }));
  return {
    day,
    suffix: ordinal(day),
    month: opt({ month: "short" }),
    weekday: opt({ weekday: "long" }),
    year: opt({ year: "numeric" }),
    time: `${time(event.start)} - ${time(event.end)}`,
  };
}

function sessionLabel(event: Event): string {
  return event.stageNumber === "FINAL" ? "THE HANDOVER:" : `SESSION ${Number(event.stageNumber)}:`;
}

function audienceLines(event: Event, ctx: CanvasRenderingContext2D, font: string): string[] {
  const text = `WITH ${event.audience.toUpperCase().replace(/\+/g, "&")}`;
  ctx.font = font;
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > 580 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

/** Draw one uppercase line, shrinking the font size until it fits. */
function drawFitted(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: number,
  startSize: number,
  baseline: number,
) {
  let size = startSize;
  ctx.textBaseline = "alphabetic";
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= TEXT_MAX_WIDTH || size <= 20) break;
    size -= 2;
  } while (true);
  ctx.fillText(text, TEXT_X, baseline);
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

export function PosterGenerator({ speaker, events }: { speaker: Speaker; events: Event[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"drawing" | "ready" | "error">("drawing");
  const [message, setMessage] = useState<string | null>(null);
  // Default to the next event that hasn't ended yet; fall back to the last.
  const [eventId, setEventId] = useState<string>(
    () => (events.find((e) => Date.parse(e.end) > Date.now()) ?? events[events.length - 1]).id,
  );
  const event = events.find((e) => e.id === eventId) ?? events[0];

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      setStatus("drawing");
      const probe = document.createElement("span");
      probe.className = "condensed";
      probe.textContent = "x";
      document.body.appendChild(probe);
      const family = getComputedStyle(probe).fontFamily;
      probe.remove();
      await Promise.all([
        document.fonts.load(`700 68px ${family}`),
        document.fonts.load(`500 40px ${family}`),
      ]);

      const [base, headshot] = await Promise.all([
        loadImage("/poster-template/poster-base.png"),
        loadImage(speaker.photo ?? `/voices/${speaker.slug}.jpg`),
      ]);

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable in this browser.");
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(base, 0, 0, W, H);
      if ("letterSpacing" in ctx) {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "2px";
      }

      /* ---- Session block (top-left) ---- */
      const chipText = sessionLabel(event);
      ctx.font = `700 46px ${family}`;
      const chipWidth = ctx.measureText(chipText).width + 60;
      ctx.fillStyle = PURPLE;
      roundedRect(ctx, 136, 812, chipWidth, 80, 18);
      ctx.fillStyle = "#ffffff";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(chipText, 166, 869);

      ctx.fillStyle = PURPLE;
      const lineFont = `700 44px ${family}`;
      const lines = audienceLines(event, ctx, lineFont);
      ctx.font = lineFont;
      lines.forEach((line, i) => ctx.fillText(line, 140, 998 + i * 56));

      /* ---- Date block (left) ---- */
      const parts = eventDateParts(event);
      ctx.fillStyle = PURPLE;
      roundedRect(ctx, 140, 1268, 172, 202, 4);
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 128px ${family}`;
      const dayText = String(parts.day);
      ctx.fillText(dayText, 140 + (172 - ctx.measureText(dayText).width) / 2, 1428);
      ctx.fillStyle = PURPLE;
      ctx.font = `700 36px ${family}`;
      ctx.fillText(parts.suffix, 322, 1300);

      ctx.fillStyle = INK;
      ctx.font = `700 96px ${family}`;
      ctx.fillText(parts.month, 140, 1580);
      ctx.font = `700 42px ${family}`;
      ctx.fillText(parts.weekday, 140, 1634);
      ctx.font = `700 80px ${family}`;
      ctx.fillText(parts.year, 140, 1716);

      ctx.font = `700 36px ${family}`;
      const timeWidth = ctx.measureText(parts.time).width + 44;
      ctx.fillStyle = MINT;
      ctx.fillRect(140, 1734, timeWidth, 60);
      ctx.fillStyle = INK;
      ctx.fillText(parts.time, 162, 1776);

      /* ---- Portrait ---- */
      const scale = CIRCLE.r / HEADSHOT.r;
      const drawSize = HEADSHOT.size * scale;
      const dx = CIRCLE.cx - HEADSHOT.c * scale;
      const dy = CIRCLE.cy - HEADSHOT.c * scale;
      ctx.save();
      ctx.beginPath();
      ctx.arc(CIRCLE.cx, CIRCLE.cy, CIRCLE.r, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(headshot, dx, dy, drawSize, drawSize);
      ctx.restore();

      /* ---- Name block (bottom-right) ---- */
      ctx.fillStyle = PURPLE;
      drawFitted(ctx, speaker.name.toUpperCase(), family, 700, 68, NAME_BASELINE);
      ctx.fillStyle = INK;
      drawFitted(ctx, speaker.role.toUpperCase(), family, 500, 40, ROLE_BASELINE);
      drawFitted(ctx, speaker.organisation.toUpperCase(), family, 500, 40, ORG_BASELINE);
      ctx.fillRect(BAR.x, BAR.y, BAR.w, BAR.h);

      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not draw the poster.");
    }
  }, [speaker, event]);

  useEffect(() => {
    // Deferred a tick so all draw-state updates happen asynchronously.
    const id = setTimeout(() => void draw(), 0);
    return () => clearTimeout(id);
  }, [draw]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `beyond-syllabus-${speaker.slug}-${event.dateLabel.toLowerCase().replace(/\s+/g, "")}-poster.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="border-2 border-ink bg-white p-2">
        <canvas ref={canvasRef} width={W} height={H} className="h-auto w-full" />
      </div>
      <aside className="space-y-5">
        <label className="block">
          <span className="kicker">Announcing which event?</span>
          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="mt-2 w-full border-2 border-ink bg-paper px-3 py-2.5 text-sm"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.dateLabel} — {e.title}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-ink-soft">
            Date, time and session details fill in automatically.
          </span>
        </label>
        {status === "error" ? (
          <p role="alert" className="border-l-4 border-signal bg-signal/10 px-4 py-3 text-sm">{message}</p>
        ) : (
          <>
            <button
              type="button"
              onClick={download}
              disabled={status !== "ready"}
              className="condensed w-full bg-purple px-6 py-4 text-base font-semibold tracking-[0.1em] text-white transition-colors hover:bg-purple-deep disabled:opacity-50"
            >
              {status === "ready" ? "Download poster (PNG)" : "Rendering…"}
            </button>
            <p className="text-xs leading-relaxed text-ink-soft">
              2000×2503px — the announcement format used on social media. The portrait and text
              come from the published record; edit the voice first if anything needs fixing.
            </p>
          </>
        )}
        <Link
          href="/admin/voices"
          className="condensed inline-block border-2 border-ink px-5 py-3 text-sm font-semibold tracking-[0.12em] hover:bg-purple-soft"
        >
          ← All voices
        </Link>
      </aside>
    </div>
  );
}
