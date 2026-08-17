import { NextRequest, NextResponse } from "next/server";
import { originAllowed } from "@/lib/admin-auth";
import { publishChanges, type FileChange } from "@/lib/github-content";
import { renderHeadshot, type CropParams } from "@/lib/voices-frame";
import {
  getAuthoritativeSpeakers,
  parseSpeakerInput,
  serializeSpeakers,
  toSpeaker,
} from "@/lib/voices-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

function cropFromForm(form: FormData): CropParams | null {
  if (form.get("cropX") === null) return null;
  const num = (key: string) => {
    const v = Number(form.get(key));
    if (!Number.isFinite(v)) throw new Error(`Crop parameter "${key}" missing.`);
    return v;
  };
  return { x: num("cropX"), y: num("cropY"), size: num("cropSize") };
}

/** Update an existing voice. Photo is optional — untouched keeps the current one. */
export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!originAllowed(request)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  try {
    const { slug } = await context.params;
    const form = await request.formData();
    form.set("slug", slug); // slug is immutable on edit — documented in the guide
    const input = parseSpeakerInput(form);

    const speakers = await getAuthoritativeSpeakers();
    const existing = speakers.find((s) => s.slug === slug);
    if (!existing) throw new Error(`No voice with slug "${slug}".`);

    const changes: FileChange[] = [];
    const photo = form.get("photo");
    if (photo instanceof File && photo.size > 0) {
      const crop = cropFromForm(form);
      if (!crop) throw new Error("Crop parameters missing for the new photo.");
      const jpeg = await renderHeadshot(Buffer.from(await photo.arrayBuffer()), crop);
      changes.push({ path: `public/voices/${slug}.jpg`, content: jpeg });
    }

    const record = toSpeaker(input, existing);
    const next = speakers.map((s) => (s.slug === slug ? record : s));
    changes.unshift({ path: "content/speakers.json", content: serializeSpeakers(next) });

    const { mode } = await publishChanges(
      changes,
      `voices: update ${record.name}\n\nPublished from the organiser admin.`,
    );
    return NextResponse.json({ ok: true, slug, mode });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong." },
      { status: 400 },
    );
  }
}

/** Remove a voice: record and image go in one commit. */
export async function DELETE(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  if (!originAllowed(request)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  try {
    const { slug } = await context.params;
    const speakers = await getAuthoritativeSpeakers();
    const existing = speakers.find((s) => s.slug === slug);
    if (!existing) throw new Error(`No voice with slug "${slug}".`);

    const next = speakers.filter((s) => s.slug !== slug);
    const { mode } = await publishChanges(
      [
        { path: "content/speakers.json", content: serializeSpeakers(next) },
        { path: `public/voices/${slug}.jpg`, content: null },
      ],
      `voices: remove ${existing.name}\n\nPublished from the organiser admin.`,
    );
    return NextResponse.json({ ok: true, mode });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong." },
      { status: 400 },
    );
  }
}
