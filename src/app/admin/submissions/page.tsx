import type { Metadata } from "next";
import Link from "next/link";
import { listSubmissions, SUBMISSIONS_BRANCH } from "@/lib/submissions";
import { CONTENT_REPO } from "@/lib/github-content";

export const metadata: Metadata = { title: "Submissions" };
export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export default async function SubmissionsPage() {
  const submissions = await listSubmissions();
  const { owner, repo } = CONTENT_REPO;
  const branchUrl = `https://github.com/${owner}/${repo}/tree/${SUBMISSIONS_BRANCH}/content/submissions`;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="display text-4xl">Submissions</h1>
        <p className="condensed text-xs tracking-[0.14em] text-ink-soft">
          {submissions.length} received ·{" "}
          <a href={branchUrl} className="text-purple-deep underline-offset-4 hover:underline">
            raw files on GitHub
          </a>
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-ink-soft">
        Everything sent through the participation forms, newest first. Each entry is one commit on
        the {SUBMISSIONS_BRANCH} branch.
      </p>

      {submissions.length === 0 ? (
        <p className="mt-10 border-2 border-dashed border-ink/30 p-8 text-ink-soft">
          No submissions yet. They will appear here the moment someone sends one.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {submissions.map((s) => (
            <li key={`${s.receivedAt}-${s.email}`} className="border-2 border-ink p-5">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="font-semibold text-ink">{s.name}</p>
                <a href={`mailto:${s.email}`} className="text-sm text-purple-deep hover:underline">
                  {s.email}
                </a>
                {s.organisation && <p className="text-sm text-ink-soft">{s.organisation}</p>}
                <p className="condensed ml-auto text-xs tracking-[0.12em] text-ink-soft">
                  {dateFmt.format(new Date(s.receivedAt))} IST
                </p>
              </div>
              <p className="condensed mt-2 text-xs font-semibold tracking-[0.14em] text-purple-deep">
                {s.form === "voice" ? "Voice" : s.action || "Participation"} · {s.stakeholder}
              </p>
              {s.message && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{s.message}</p>
              )}
              {s.answers?.some(Boolean) && (
                <ol className="mt-3 space-y-2">
                  {s.answers.map(
                    (a, i) =>
                      a && (
                        <li key={i} className="text-sm leading-relaxed text-ink">
                          <span className="condensed mr-2 text-xs font-semibold text-purple">
                            Q{i + 1}
                          </span>
                          <span className="whitespace-pre-wrap">{a}</span>
                        </li>
                      ),
                  )}
                </ol>
              )}
              {s.videoUrl && (
                <p className="mt-3 break-all text-sm">
                  <span className="condensed mr-2 text-xs font-semibold text-purple">Video</span>
                  {s.videoUrl}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10">
        <Link
          href="/admin/voices"
          className="condensed text-xs font-semibold tracking-[0.16em] text-purple-deep underline-offset-4 hover:underline"
        >
          ← Voices admin
        </Link>
      </p>
    </div>
  );
}
