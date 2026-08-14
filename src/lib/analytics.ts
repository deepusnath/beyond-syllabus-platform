/*
 * Analytics abstraction. No invasive tracking is installed by default —
 * events are logged to the console in development and dropped in
 * production until a provider is wired into `send`.
 *
 * Future metrics this interface is designed for: livestream viewers,
 * session views, document downloads, prototype views, idea submissions,
 * participation submissions, stakeholder distribution.
 */

export type AnalyticsEvent =
  | { name: "page_view"; path: string }
  | { name: "live_view"; eventId: string }
  | { name: "document_download"; documentId: string }
  | { name: "prototype_view"; slug: string }
  | { name: "idea_submission"; stakeholder?: string }
  | { name: "participation_submission"; stakeholder: string; action: string };

export function track(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event);
  }
  // Wire a provider here (self-hosted, privacy-preserving preferred).
}
