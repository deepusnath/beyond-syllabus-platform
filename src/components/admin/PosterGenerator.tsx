"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Speaker } from "@/lib/types";

/*
 * Renders the official announcement poster for a voice on a client-side
 * canvas: the pixel-perfect blanked Session 1 template + the published
 * headshot clipped into the P-loop counter + the name/role/organisation
 * type block. Client-side deliberately: the browser already has the
 * site's fonts loaded, which serverless sharp does not.
 *
 * Geometry measured from the original posters (2000×2503):
 * photo circle centre (1259.5, 1425) r=325; published headshots have
 * their photo circle at (330, 330) r=300 in a 660 box → scale 325/300.
 */

const W = 2000;
const H = 2503;
const CIRCLE = { cx: 1259.5, cy: 1425, r: 325 };
const HEADSHOT = { c: 330, r: 300, size: 660 };
const TEXT_X = 1038;
const TEXT_MAX_WIDTH = 860;
const NAME_BASELINE = 2175;
const ROLE_BASELINE = 2237;
const ORG_BASELINE = 2288;
const BAR = { x: 1038, y: 2340, w: 437, h: 10 };
const NAME_COLOR = "#9c2df4";
const INK_COLOR = "#07000b";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
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

export function PosterGenerator({ speaker }: { speaker: Speaker }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"drawing" | "ready" | "error">("drawing");
  const [message, setMessage] = useState<string | null>(null);

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      // Resolve the site's condensed font family from the design tokens.
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
        loadImage("/poster-template/session-1-base.png"),
        loadImage(speaker.photo ?? `/voices/${speaker.slug}.jpg`),
      ]);

      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable in this browser.");
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(base, 0, 0, W, H);

      // Portrait: clip to the counter circle, then draw the headshot scaled
      // so its own photo circle lands exactly on the template's.
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

      // Type block.
      if ("letterSpacing" in ctx) {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "2px";
      }
      ctx.fillStyle = NAME_COLOR;
      drawFitted(ctx, speaker.name.toUpperCase(), family, 700, 68, NAME_BASELINE);
      ctx.fillStyle = INK_COLOR;
      drawFitted(ctx, speaker.role.toUpperCase(), family, 500, 40, ROLE_BASELINE);
      drawFitted(ctx, speaker.organisation.toUpperCase(), family, 500, 40, ORG_BASELINE);
      ctx.fillRect(BAR.x, BAR.y, BAR.w, BAR.h);

      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not draw the poster.");
    }
  }, [speaker]);

  useEffect(() => {
    void draw();
  }, [draw]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `beyond-syllabus-${speaker.slug}-poster.png`;
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
