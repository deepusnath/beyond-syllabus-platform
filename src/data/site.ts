import type { SiteConfig } from "@/lib/types";

/*
 * Site-level configuration. Livestream URL + social links are configuration
 * driven — set NEXT_PUBLIC_LIVE_STREAM_URL (and optionally
 * NEXT_PUBLIC_FORCE_LIVE=true) or edit this file per event.
 * Social URLs are intentionally empty until confirmed — never invent URLs.
 */
export const site: SiteConfig = {
  name: "Beyond Syllabus",
  tagline: "A five-month journey to redesign education for the next generation.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://capabilitycommons.com",
  live: {
    streamUrl: process.env.NEXT_PUBLIC_LIVE_STREAM_URL || undefined,
    forceLive: process.env.NEXT_PUBLIC_FORCE_LIVE === "true",
  },
  // Handle is @purplemovement across platforms (from the poster); add URLs
  // here once confirmed. Empty urls are not rendered.
  social: [],
  registrationUrl: undefined,
};

/** Participation submissions are delivered here until a backend exists. */
export const participateEmail = "deepu@fayausa.com";
