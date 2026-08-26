import type { InterventionStatus } from "@/lib/types";

/*
 * Display labels for intervention statuses. Lives outside the client
 * component so server components can read the values too (value exports
 * from a "use client" module become client references on the server).
 */
export const statusLabels: Record<InterventionStatus, string> = {
  recorded: "Recorded 2023",
  "in-motion": "In motion",
  adopted: "Adopted",
  evolved: "Evolved",
  stalled: "Stalled",
};
