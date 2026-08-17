import { NextRequest, NextResponse } from "next/server";
import { originAllowed } from "@/lib/admin-auth";
import { publishChanges } from "@/lib/github-content";
import { renderHeadshot, type CropParams } from "@/lib/voices-frame";
import {
  getAuthoritativeSpeakers,
  parseSpeakerInput,
  serializeSpeakers,
  toSpeaker,
} from "@/lib/voices-admin";

export const runtime = "nodejs";
export const maxDuration = 60;

function cropFromForm(form: FormData): CropParams {
  const num = (key: string) => {
    const v = Number(form.get(key));
    if (!Number.isFinite(v)) throw new Error(`Crop parameter "${key}" missing.`);
    return v;
  };
  return { x: num("cropX"), y: num("cropY"), size: num("cropSize") };
}

/** Create a new voice: process photo, append record, publish as one commit. */
export async function POST(request: NextRequest) {
  if (!originAllowed(request)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  try {
    const form = await request.formData();
    const input = parseSpeakerInput(form);

    const photo = form.get("photo");
    if (!(photo instanceof File) || photo.size === 0) {
      throw new Error("A photo is required.");
    }
    const jpeg = await renderHeadshot(Buffer.from(await photo.arrayBuffer()), cropFromForm(form));

    const speakers = await getAuthoritativeSpeakers();
    if (speakers.some((s) => s.slug === input.slug)) {
      throw new Error(`A voice with the slug "${input.slug}" already exists.`);
    }
    const record = toSpeaker(input);
    const next = [...speakers, record];

    const { mode } = await publishChanges(
      [
        { path: "content/speakers.json", content: serializeSpeakers(next) },
        { path: `public/voices/${record.slug}.jpg`, content: jpeg },
      ],
      `voices: add ${record.name} (${input.sessionId})\n\nPublished from the organiser admin.`,
    );

    return NextResponse.json({ ok: true, slug: record.slug, mode });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong." },
      { status: 400 },
    );
  }
}
