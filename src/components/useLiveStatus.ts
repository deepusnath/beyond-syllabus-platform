"use client";

import { useEffect, useState } from "react";
import { getLiveStatus, type LiveStatus } from "@/lib/live";

/*
 * Client-side live status, recomputed every 30s so the LIVE state flips
 * on time even on statically rendered pages. `status` is null until
 * mounted to avoid a server/client clock hydration mismatch; `now` is
 * the timestamp of the last recomputation (0 before mount).
 */
export function useLiveStatus(): { status: LiveStatus | null; now: number } {
  const [state, setState] = useState<{ status: LiveStatus; now: number } | null>(null);

  useEffect(() => {
    const update = () => setState({ status: getLiveStatus(), now: Date.now() });
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return state ?? { status: null, now: 0 };
}
