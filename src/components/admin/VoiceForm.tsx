"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Session, Speaker } from "@/lib/types";
import { stakeholderLabels } from "@/lib/stakeholders";
import { ringPoints, slugify } from "@/lib/util";

/*
 * Organiser form for adding/editing a voice, with an in-browser circular
 * crop that previews the exact template framing. The server re-renders the
 * final image with sharp; this component's job is a faithful preview and
 * accurate crop parameters (source-pixel square: x, y, size).
 */

const VIEW = 300; // on-screen diameter of the photo circle

interface Props {
  sessions: Session[];
  existing?: Speaker;
}

export function VoiceForm({ sessions, existing }: Props) {
  const [name, setName] = useState(existing?.name ?? "");
  const [slugManual, setSlugManual] = useState<string | null>(existing?.slug ?? null);
  // Slug follows the name until the organiser edits it directly.
  const slug = slugManual ?? slugify(name);
  const [role, setRole] = useState(existing?.role ?? "");
  const [organisation, setOrganisation] = useState(existing?.organisation ?? "");
  const [category, setCategory] = useState(existing?.category ?? "students");
  const [sessionId, setSessionId] = useState(existing?.sessionIds[0] ?? sessions[0]?.id ?? "");
  const [bio, setBio] = useState(existing?.bio ?? "");
  const [keyIdea, setKeyIdea] = useState(existing?.keyIdea ?? "");

  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ slug: string; mode: string } | null>(null);
  const [deployed, setDeployed] = useState(false);

  // After a GitHub publish, the change is only live once the automatic
  // deploy finishes (~1 min). Poll the public page so the "view" button
  // never leads to a 404.
  // Local-mode publishes are live immediately; only GitHub publishes wait
  // on the deploy. Derived at render time to keep the effect async-only.
  const isLive = done ? done.mode !== "github" || deployed : false;
  useEffect(() => {
    if (!done || done.mode !== "github") return;
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch(`/voices/${done.slug}`, { method: "HEAD", cache: "no-store" });
        if (res.ok) {
          if (!cancelled) setDeployed(true);
          return;
        }
      } catch {
        // network hiccup — keep polling
      }
      if (!cancelled) setTimeout(check, 5000);
    };
    const id = setTimeout(check, 15_000); // deploys never finish faster than this
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [done]);

  // Revoke the previous object URL whenever a new photo replaces it.
  const prevUrlRef = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  function loadPhoto(f: File) {
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    const url = URL.createObjectURL(f);
    prevUrlRef.current = url;
    setFile(f);
    setImgUrl(url);
    const img = new Image();
    img.onload = () => {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      const cover = VIEW / Math.min(img.naturalWidth, img.naturalHeight);
      setMinZoom(cover);
      setZoom(cover);
      // Centre the image in the circle.
      setPan({
        x: (VIEW - img.naturalWidth * cover) / 2,
        y: (VIEW - img.naturalHeight * cover) / 2,
      });
    };
    img.src = url;
  }

  const clampPan = (p: { x: number; y: number }, z: number) => {
    if (!natural) return p;
    return {
      x: Math.min(0, Math.max(VIEW - natural.w * z, p.x)),
      y: Math.min(0, Math.max(VIEW - natural.h * z, p.y)),
    };
  };

  const crop = useMemo(() => {
    if (!natural) return null;
    return {
      x: Math.round(-pan.x / zoom),
      y: Math.round(-pan.y / zoom),
      size: Math.round(VIEW / zoom),
    };
  }, [natural, pan, zoom]);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    setPan(clampPan({ x: d.panX + (e.clientX - d.startX), y: d.panY + (e.clientY - d.startY) }, zoom));
  }
  function onPointerUp() {
    dragRef.current = null;
  }
  function onZoom(nextZoom: number) {
    const z = Math.min(minZoom * 5, Math.max(minZoom, nextZoom));
    // Keep the circle centre fixed while zooming.
    const cx = (VIEW / 2 - pan.x) / zoom;
    const cy = (VIEW / 2 - pan.y) / zoom;
    setZoom(z);
    setPan(clampPan({ x: VIEW / 2 - cx * z, y: VIEW / 2 - cy * z }, z));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!existing && !file) {
      setError("A photo is required.");
      return;
    }
    setBusy(true);
    const form = new FormData();
    form.set("name", name);
    form.set("slug", slug);
    form.set("role", role);
    form.set("organisation", organisation);
    form.set("category", category);
    form.set("sessionId", sessionId);
    form.set("bio", bio);
    form.set("keyIdea", keyIdea);
    if (file && crop) {
      form.set("photo", file);
      form.set("cropX", String(crop.x));
      form.set("cropY", String(crop.y));
      form.set("cropSize", String(crop.size));
    }
    const res = await fetch(existing ? `/api/admin/voices/${existing.slug}` : "/api/admin/voices", {
      method: existing ? "PUT" : "POST",
      body: form,
    });
    setBusy(false);
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; slug?: string; mode?: string; error?: string }
      | null;
    if (res.ok && data?.ok) {
      setDone({ slug: data.slug ?? existing?.slug ?? slug, mode: data.mode ?? "github" });
    } else {
      setError(data?.error ?? "Something went wrong. Try again.");
    }
  }

  if (done) {
    return (
      <div role="status" className="border-l-4 border-mint bg-purple-soft/50 p-6">
        <p className="display text-3xl">{isLive ? "Published and live." : "Published."}</p>
        <p className="mt-3 text-sm text-ink-soft">
          {done.mode !== "github"
            ? "Written to the local working tree (development mode)."
            : isLive
              ? "The deploy has finished. The profile is live on the public site."
              : "The change is committed. The automatic deploy is running. It usually takes about a minute, and the button below unlocks the moment the page is live."}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          {isLive ? (
            <Link href={`/voices/${done.slug}`} className="condensed bg-ink px-5 py-3 text-sm font-semibold tracking-[0.12em] text-paper hover:bg-purple-deep">
              View the profile →
            </Link>
          ) : (
            <span className="condensed inline-flex items-center gap-2 border-2 border-dashed border-ink/40 px-5 py-3 text-sm font-semibold tracking-[0.12em] text-ink-soft">
              <span aria-hidden className="live-dot h-2 w-2 rounded-full bg-purple" />
              Deploying…
            </span>
          )}
          <Link href="/admin/voices" className="condensed border-2 border-ink px-5 py-3 text-sm font-semibold tracking-[0.12em] hover:bg-purple-soft">
            Back to all voices
          </Link>
        </div>
      </div>
    );
  }

  const input = "mt-2 w-full border-2 border-ink bg-paper px-4 py-2.5 text-sm";

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-5">
        <label className="block">
          <span className="kicker">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} className={input} />
        </label>
        <label className="block">
          <span className="kicker">Slug (page address)</span>
          <input
            value={slug}
            onChange={(e) => setSlugManual(e.target.value)}
            required
            pattern="[a-z0-9-]+"
            disabled={Boolean(existing)}
            className={`${input} disabled:opacity-60`}
          />
          {existing && (
            <span className="mt-1 block text-xs text-ink-soft">
              The address can&apos;t change after publishing, because links to it may already exist.
            </span>
          )}
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="kicker">Role / designation</span>
            <input value={role} onChange={(e) => setRole(e.target.value)} required maxLength={120} className={input} />
          </label>
          <label className="block">
            <span className="kicker">Organisation</span>
            <input value={organisation} onChange={(e) => setOrganisation(e.target.value)} required maxLength={120} className={input} />
          </label>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="kicker">Stakeholder group</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className={input}>
              {Object.entries(stakeholderLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="kicker">Session</span>
            <select value={sessionId} onChange={(e) => setSessionId(e.target.value)} className={input}>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="kicker">Key idea (optional: their one-line contribution)</span>
          <input value={keyIdea} onChange={(e) => setKeyIdea(e.target.value)} maxLength={200} className={input} />
        </label>
        <label className="block">
          <span className="kicker">Short bio (optional)</span>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} maxLength={1200} className={input} />
        </label>
        {error && (
          <p role="alert" className="border-l-4 border-signal bg-signal/10 px-4 py-3 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="condensed bg-ink px-7 py-4 text-base font-semibold tracking-[0.1em] text-paper transition-colors hover:bg-purple-deep disabled:opacity-50"
        >
          {busy ? "Publishing…" : existing ? "Publish changes" : "Publish this voice"}
        </button>
      </div>

      {/* Photo + template-framed crop preview */}
      <div>
        <span className="kicker">Photo</span>
        <div className="mt-2 space-y-4">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) loadPhoto(f);
            }}
            className="block w-full text-sm file:mr-3 file:border-2 file:border-ink file:bg-paper file:px-4 file:py-2 file:text-sm file:font-semibold"
          />
          <div
            className="relative mx-auto touch-none select-none overflow-hidden"
            style={{ width: 330, height: 330, background: "linear-gradient(135deg,#b44ce4,#7a24ad)" }}
          >
            {/* dotted arc */}
            <svg viewBox="0 0 330 330" className="pointer-events-none absolute inset-0" aria-hidden>
              {ringPoints(72, 165, 165, 168).map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#fff" />
              ))}
            </svg>
            {/* white ring */}
            <div
              className="pointer-events-none absolute rounded-full bg-white"
              style={{ inset: 5 }}
              aria-hidden
            />
            {/* photo circle */}
            <div
              className="absolute overflow-hidden rounded-full"
              style={{ width: VIEW, height: VIEW, left: 15, top: 15, cursor: imgUrl ? "grab" : "default" }}
              onPointerDown={imgUrl ? onPointerDown : undefined}
              onPointerMove={imgUrl ? onPointerMove : undefined}
              onPointerUp={onPointerUp}
            >
              {imgUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imgUrl}
                  alt="Crop preview. Drag to position."
                  draggable={false}
                  style={{
                    position: "absolute",
                    left: pan.x,
                    top: pan.y,
                    width: natural ? natural.w * zoom : undefined,
                    height: natural ? natural.h * zoom : undefined,
                    maxWidth: "none",
                  }}
                />
              ) : existing?.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={existing.photo} alt="Current photo" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-purple-soft text-center text-xs text-ink-soft">
                  Choose a photo,<br />then drag to position
                </div>
              )}
            </div>
          </div>
          {imgUrl && (
            <label className="block">
              <span className="text-xs text-ink-soft">Zoom</span>
              <input
                type="range"
                min={minZoom}
                max={minZoom * 5}
                step={minZoom / 50}
                value={zoom}
                onChange={(e) => onZoom(Number(e.target.value))}
                className="w-full accent-purple"
              />
            </label>
          )}
          <p className="text-xs leading-relaxed text-ink-soft">
            Drag to position, zoom to frame the face. What you see in the ring is exactly how the
            published headshot will look{existing ? ". Leave the photo untouched to keep the current one" : ""}.
          </p>
        </div>
      </div>
    </form>
  );
}
