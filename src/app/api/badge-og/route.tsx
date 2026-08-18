import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import {
  VIT_INK,
  VIT_PURPLE,
  VIT_SIZE,
  vitruvian,
  vitruvianDots,
} from "@/lib/vitruvian";
import { isStakeholderGroup, stakeholderSingular } from "@/lib/stakeholders";
import { sanitizeName } from "@/lib/voice-share";

/*
 * Server-rendered personalised badge, used as the OG image for /voice
 * links so every platform's link card shows the participant's badge even
 * where share intents cannot attach files.
 * Anton is bundled locally (OFL licence alongside it in src/fonts).
 */

export const runtime = "nodejs";

const PAPER = "#fdfcfb";
const MINT = "#56efaa";

function Mark() {
  const { square, head, circle } = vitruvian;
  return (
    <svg width={430} height={430} viewBox={`0 0 ${VIT_SIZE} ${VIT_SIZE}`}>
      <rect
        x={square.x}
        y={square.y}
        width={square.w}
        height={square.h}
        fill="none"
        stroke={VIT_INK}
        strokeWidth={8}
      />
      {vitruvianDots().map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={circle.dotR + 2} fill={VIT_PURPLE} />
      ))}
      <circle cx={head.cx} cy={head.cy} r={head.r} fill="none" stroke={VIT_INK} strokeWidth={12} />
      {vitruvian.inkPaths.map((d) => (
        <path key={d} d={d} fill="none" stroke={VIT_INK} strokeWidth={12} strokeLinecap="round" />
      ))}
      {vitruvian.purplePaths.map((d) => (
        <path key={d} d={d} fill="none" stroke={VIT_PURPLE} strokeWidth={12} strokeLinecap="round" />
      ))}
    </svg>
  );
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const name = sanitizeName(params.get("n")).toUpperCase();
  const asParam = params.get("as");
  const role = isStakeholderGroup(asParam) ? stakeholderSingular[asParam].toUpperCase() : null;

  const anton = await readFile(new URL("../../../fonts/Anton-Regular.ttf", import.meta.url));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          fontFamily: "Anton",
          color: VIT_INK,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "56px 24px 56px 64px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, letterSpacing: 6 }}>BRIDGE THE GAP 4.0</div>
            <div style={{ fontSize: 54, marginTop: 6 }}>BEYOND SYLLABUS</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, lineHeight: 1.05 }}>{name}</div>
            <div style={{ fontSize: 46, lineHeight: 1.1, marginTop: 10 }}>IS PART OF</div>
            <div style={{ fontSize: 46, lineHeight: 1.1, color: VIT_PURPLE }}>
              THE CONVERSATION.
            </div>
            {role ? (
              <div style={{ fontSize: 24, letterSpacing: 4, marginTop: 14, color: "#4a4452" }}>
                {`${role} VOICE OF THE MOVEMENT`}
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: MINT,
              padding: "12px 22px",
              fontSize: 26,
              letterSpacing: 3,
            }}
          >
            ADD YOUR VOICE · CAPABILITYCOMMONS.COM
          </div>
        </div>
        <div
          style={{
            width: 470,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Mark />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }],
    },
  );
}
