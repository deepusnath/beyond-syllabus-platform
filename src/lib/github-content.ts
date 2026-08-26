import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

/*
 * Git-as-CMS write path. Publishing = one atomic commit to main via the
 * GitHub git-data API (blobs → tree → commit → ref), which triggers the
 * normal auto-deploy. Requires GITHUB_CONTENT_TOKEN — a fine-grained PAT
 * scoped to this single repository with contents: read/write only.
 *
 * Local development without the token falls back to writing the working
 * tree directly, so the whole flow is testable offline.
 */

/** Single source for the content repo coordinates — reused by every reader/writer. */
export const CONTENT_REPO = {
  owner: "deepusnath",
  repo: "beyond-syllabus-platform",
  branch: "main",
} as const;

const { owner: OWNER, repo: REPO, branch: BRANCH } = CONTENT_REPO;

export interface FileChange {
  /** Repo-relative path, e.g. "content/speakers.json". */
  path: string;
  /** utf-8 text or binary buffer; null deletes the file. */
  content: string | Buffer | null;
}

export function contentToken(): string | undefined {
  return process.env.GITHUB_CONTENT_TOKEN;
}
const token = contentToken;

async function gh(pathname: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${init?.method ?? "GET"} ${pathname} failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return (await res.json()) as Record<string, unknown>;
}

/** Head sha of a branch; creates the branch from main's head if missing. */
async function branchHead(branch: string): Promise<string> {
  try {
    const ref = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/${branch}`);
    return (ref.object as { sha: string }).sha;
  } catch (error) {
    if (branch === BRANCH || !String(error).includes("(404)")) throw error;
    const main = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
    const mainSha = (main.object as { sha: string }).sha;
    try {
      await gh(`/repos/${OWNER}/${REPO}/git/refs`, {
        method: "POST",
        body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: mainSha }),
      });
    } catch (createError) {
      // Lost a creation race: the ref exists now, read its head.
      if (!String(createError).includes("(422)")) throw createError;
      const ref = await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/${branch}`);
      return (ref.object as { sha: string }).sha;
    }
    return mainSha;
  }
}

async function commitToGitHub(changes: FileChange[], message: string, branch: string = BRANCH): Promise<string> {
  const headSha = await branchHead(branch);
  const headCommit = await gh(`/repos/${OWNER}/${REPO}/git/commits/${headSha}`);
  const baseTree = (headCommit.tree as { sha: string }).sha;

  const treeItems = await Promise.all(
    changes.map(async (change) => {
      if (change.content === null) {
        return { path: change.path, mode: "100644", type: "blob", sha: null };
      }
      const blob = await gh(`/repos/${OWNER}/${REPO}/git/blobs`, {
        method: "POST",
        body: JSON.stringify(
          typeof change.content === "string"
            ? { content: change.content, encoding: "utf-8" }
            : { content: change.content.toString("base64"), encoding: "base64" },
        ),
      });
      return { path: change.path, mode: "100644", type: "blob", sha: blob.sha as string };
    }),
  );

  const tree = await gh(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: baseTree, tree: treeItems }),
  });

  const commit = await gh(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: tree.sha, parents: [headSha] }),
  });

  await gh(`/repos/${OWNER}/${REPO}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return commit.sha as string;
}

async function writeLocally(changes: FileChange[]): Promise<string> {
  const root = process.cwd();
  for (const change of changes) {
    const target = path.join(root, change.path);
    if (!target.startsWith(root)) throw new Error(`Refusing path outside repo: ${change.path}`);
    if (change.content === null) {
      await unlink(target).catch(() => {});
    } else {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, change.content);
    }
  }
  return "local-write";
}

/**
 * Publish a set of file changes as one commit. Retries once if the branch
 * moved between reading the head and updating the ref. Committing to a
 * non-main `branch` (created from main on first use) records data in the
 * repo without triggering a production deploy.
 */
export async function publishChanges(
  changes: FileChange[],
  message: string,
  branch?: string,
): Promise<{ sha: string; mode: "github" | "local" }> {
  if (!token()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Publishing is not configured: GITHUB_CONTENT_TOKEN is missing. Add the fine-grained PAT in Vercel env settings.",
      );
    }
    return { sha: await writeLocally(changes), mode: "local" };
  }
  try {
    return { sha: await commitToGitHub(changes, message, branch), mode: "github" };
  } catch (error) {
    // One retry for ref races (another organiser published in between).
    if (String(error).includes("(422)") || String(error).includes("(409)")) {
      return { sha: await commitToGitHub(changes, message, branch), mode: "github" };
    }
    throw error;
  }
}
