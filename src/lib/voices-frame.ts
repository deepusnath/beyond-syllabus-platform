import sharp from "sharp";
import { ringPoints } from "@/lib/util";

/*
 * Renders an uploaded photo into the Voices headshot template so every
 * published portrait matches the Session 1 poster crops exactly:
 * 660×660, purple gradient ground, dotted arc, white ring, and the
 * portrait clipped to a centred circle.
 *
 * Geometry derived from the original poster crops (crop box 660² taken at
 * the P-loop counter): photo circle r≈300, white ring to r≈320, dotted
 * arc at r≈336 visible in the corners.
 */

export const FRAME_SIZE = 660;
const PHOTO_RADIUS = 300;
const RING_RADIUS = 320;
const DOTS_RADIUS = 336;

export interface CropParams {
  /** Top-left corner of the square crop region, in source-image pixels. */
  x: number;
  y: number;
  /** Side length of the square crop region, in source-image pixels. */
  size: number;
}

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function frameSvg(): string {
  const c = FRAME_SIZE / 2;
  const dots = ringPoints(72, c, c, DOTS_RADIUS).map(
    (p) => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#ffffff"/>`,
  );
  return `<svg width="${FRAME_SIZE}" height="${FRAME_SIZE}" viewBox="0 0 ${FRAME_SIZE} ${FRAME_SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="${FRAME_SIZE}" y2="${FRAME_SIZE}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#b44ce4"/>
      <stop offset="1" stop-color="#7a24ad"/>
    </linearGradient>
    <mask id="hole">
      <rect width="${FRAME_SIZE}" height="${FRAME_SIZE}" fill="#fff"/>
      <circle cx="${c}" cy="${c}" r="${PHOTO_RADIUS}" fill="#000"/>
    </mask>
  </defs>
  <rect width="${FRAME_SIZE}" height="${FRAME_SIZE}" fill="url(#g)"/>
  ${dots.join("\n  ")}
  <!-- white ring: fills from photo edge out to RING_RADIUS, punched at the centre -->
  <circle cx="${c}" cy="${c}" r="${RING_RADIUS}" fill="#ffffff" mask="url(#hole)"/>
</svg>`;
}

function circleMaskSvg(): string {
  const d = PHOTO_RADIUS * 2;
  return `<svg width="${d}" height="${d}"><circle cx="${PHOTO_RADIUS}" cy="${PHOTO_RADIUS}" r="${PHOTO_RADIUS}" fill="#fff"/></svg>`;
}

/**
 * Validates and renders. Throws Error with a user-safe message on bad input.
 */
export async function renderHeadshot(input: Buffer, crop: CropParams): Promise<Buffer> {
  if (input.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error("Photo is larger than 10MB. Use a smaller image.");
  }

  // Decode via sharp only; rejects non-images and disarms crafted files.
  // rotate() applies EXIF orientation before EXIF is stripped on output.
  const source = sharp(input, { limitInputPixels: 12000 * 12000 }).rotate();
  const meta = await source.metadata().catch(() => {
    throw new Error("That file doesn't look like an image.");
  });
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width < 200 || height < 200) {
    throw new Error("Photo is too small. It needs to be at least 200×200 pixels.");
  }

  // Clamp the crop square into the image bounds.
  const size = Math.max(50, Math.min(Math.floor(crop.size), Math.min(width, height)));
  const x = Math.max(0, Math.min(Math.floor(crop.x), width - size));
  const y = Math.max(0, Math.min(Math.floor(crop.y), height - size));

  const portrait = await source
    .extract({ left: x, top: y, width: size, height: size })
    .resize(PHOTO_RADIUS * 2, PHOTO_RADIUS * 2)
    .composite([{ input: Buffer.from(circleMaskSvg()), blend: "dest-in" }])
    .png()
    .toBuffer();

  const offset = FRAME_SIZE / 2 - PHOTO_RADIUS;
  return sharp(Buffer.from(frameSvg()))
    .composite([{ input: portrait, left: offset, top: offset }])
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}
