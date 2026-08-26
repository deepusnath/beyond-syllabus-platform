import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { CONTENT_REPO, contentToken, publishChanges } from "@/lib/github-content";

const GH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

/*
 * Participation submissions, stored git-as-CMS style: one JSON file per
 * submission, committed to the dedicated `submissions` branch so public
 * form traffic never triggers a production deploy. Filenames are generated
 * server-side only; no user input ever reaches a path.
 *
 * Privacy: a record holds exactly what the participant typed plus a
 * server timestamp. No IP address, user agent, or other tracking data.
 */

export const SUBMISSIONS_BRANCH = "submissions";
const SUBMISSIONS_DIR = "content/submissions";

export interface SubmissionRecord {
  receivedAt: string;
  form: "participate" | "voice";
  name: string;
  email: string;
  organisation: string;
  stakeholder: string;
  /** participate form: the chosen contribution action. */
  action?: string;
  /** participate form: the free-text message. */
  message?: string;
  /** voice form: answers to the three questions. */
  answers?: string[];
  /** voice form: optional video link. */
  videoUrl?: string;
}

export async function saveSubmission(record: SubmissionRecord): Promise<void> {
  const stamp = record.receivedAt.replace(/[:.]/g, "-");
  const name = `${stamp}-${randomUUID().slice(0, 8)}.json`;
  const filePath = `${SUBMISSIONS_DIR}/${name}`;
  const content = JSON.stringify(record, null, 2) + "\n";
  const message = `submission: ${record.form} (${record.stakeholder})`;

  const token = contentToken();
  if (!token) {
    // Local development: write to the working tree via the shared path.
    await publishChanges([{ path: filePath, content }], message, SUBMISSIONS_BRANCH);
    return;
  }

  // One-call file creation on the submissions branch. The path is unique
  // per submission, so concurrent submissions never conflict, and this is
  // several times faster than the blob/tree/commit/ref sequence, which
  // matters: slow saves get cut off by impatient client networks.
  const { owner, repo } = CONTENT_REPO;
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: GH_HEADERS(token),
      body: JSON.stringify({
        message,
        content: Buffer.from(content, "utf-8").toString("base64"),
        branch: SUBMISSIONS_BRANCH,
      }),
    },
  );
  if (!res.ok) {
    // 404 on PUT usually means the branch does not exist yet: fall back to
    // the full path, which creates the branch from main first.
    if (res.status === 404) {
      await publishChanges([{ path: filePath, content }], message, SUBMISSIONS_BRANCH);
      return;
    }
    throw new Error(`GitHub PUT ${filePath} failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
}

const MAX_LISTED = 200;

/** Newest-first submissions, read from the submissions branch (or the
 * working tree in local development without a token). */
export async function listSubmissions(): Promise<SubmissionRecord[]> {
  const token = contentToken();
  if (!token) {
    const dir = path.join(process.cwd(), SUBMISSIONS_DIR);
    const files = await readdir(dir).catch(() => [] as string[]);
    const records = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => JSON.parse(await readFile(path.join(dir, f), "utf-8")) as SubmissionRecord),
    );
    return records.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  }

  const { owner, repo } = CONTENT_REPO;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const dirRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${SUBMISSIONS_DIR}?ref=${SUBMISSIONS_BRANCH}`,
    { headers, cache: "no-store" },
  );
  // 404 = branch or directory does not exist yet, i.e. no submissions.
  if (dirRes.status === 404) return [];
  if (!dirRes.ok) throw new Error(`Could not list submissions (GitHub ${dirRes.status}).`);
  const entries = (await dirRes.json()) as { name: string; download_url: string }[];

  const newest = entries
    .filter((e) => e.name.endsWith(".json"))
    .sort((a, b) => b.name.localeCompare(a.name))
    .slice(0, MAX_LISTED);

  const records = await Promise.all(
    newest.map(async (e) => {
      const res = await fetch(e.download_url, { headers, cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as SubmissionRecord;
    }),
  );
  return records
    .filter((r): r is SubmissionRecord => r !== null)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}
