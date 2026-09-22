const API = "https://api.github.com";

export interface GitHubConfig {
  token: string | undefined;
  owner: string;
  repo: string;
  branch: string;
}

export function getGithubConfig(): GitHubConfig {
  return {
    token: process.env.HMT_GITHUB_TOKEN,
    owner: process.env.HMT_GITHUB_OWNER || "henrymmey",
    repo: process.env.HMT_GITHUB_REPOSITORY || "henrymeyer.de",
    branch: process.env.HMT_GITHUB_BRANCH || "main",
  };
}

export function assertGithubConfigured(): GitHubConfig {
  const config = getGithubConfig();
  if (!config.token) {
    throw new GitHubError(
      "GitHub API is not configured. Set HMT_GITHUB_TOKEN in your environment.",
      500,
      "unconfigured",
    );
  }
  return config;
}

/**
 * Admin-Inhalte werden NICHT direkt auf `main` geschrieben, sondern auf einem
 * Staging-Branch. Jede Aenderung erzeugt weiterhin einen einzelnen Commit –
 * aber alle Commits werden gebuendelt (via Fast-Forward / Merge) auf `main`
 * gepusht, sobald der Benutzer den "Speichern"-Button betaetigt. Vercel
 * deployed dadurch pro Push nur einmal.
 */
export function getStagingBranchName(): string {
  return process.env.HMT_GITHUB_STAGING_BRANCH || "admin-stage";
}

export function getAdminBranches(): { main: string; staging: string } {
  const config = getGithubConfig();
  return { main: config.branch, staging: getStagingBranchName() };
}

/** Präfix fuer alle Admin-Commits. */
export const COMMIT_PREFIX = "feat(hmt-clan): ";

/** Fixt einen Commit-Titel auf das feste Prefix-Format. */
export function withCommitPrefix(message: string): string {
  return message.startsWith(COMMIT_PREFIX) ? message : `${COMMIT_PREFIX}${message}`;
}

export type GitHubErrorCode =
  | "unconfigured"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "network"
  | "unknown";

export class GitHubError extends Error {
  status: number;
  code: GitHubErrorCode;

  constructor(message: string, status: number, code: GitHubErrorCode) {
    super(message);
    this.name = "GitHubError";
    this.status = status;
    this.code = code;
  }
}

export interface RepositoryFile {
  path: string;
  content: string;
  sha: string;
}

export interface WriteResult {
  sha: string;
  commitSha: string | null;
}

export interface SimpleCommit {
  sha: string;
  message: string;
  authorName: string | null;
  authorLogin: string | null;
  date: string;
}

function mapStatus(status: number): GitHubErrorCode {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 429) return "rate_limited";
  return "unknown";
}

function encodeBase64(text: string): string {
  return Buffer.from(text, "utf8").toString("base64");
}

interface RawCommitPayload {
  sha?: unknown;
  commit?: {
    message?: unknown;
    author?: { name?: unknown; date?: unknown };
  };
  author?: { login?: unknown };
}

function serializeCommit(raw: RawCommitPayload | null): SimpleCommit | null {
  if (!raw?.commit) return null;
  return {
    sha: typeof raw.sha === "string" ? raw.sha : "",
    message:
      typeof raw.commit.message === "string" ? raw.commit.message.split("\n")[0] : "",
    authorName:
      typeof raw.commit.author?.name === "string" ? raw.commit.author.name : null,
    authorLogin:
      typeof raw.author?.login === "string" ? raw.author.login : null,
    date: typeof raw.commit.author?.date === "string" ? raw.commit.author.date : "",
  };
}

/** Encodiert jeden Pfadsegment, behaelt Slashes bei. */
function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

interface GitHubApiThing {
  method: string;
  path: string;
  body?: unknown;
  useToken?: boolean;
  expected?: number[];
}

async function gh<T>({
  method,
  path,
  body,
  useToken = true,
  expected = [200, 201],
}: GitHubApiThing): Promise<T> {
  const config = getGithubConfig();
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (config.token && useToken) {
    headers.Authorization = `Bearer ${config.token}`;
  }
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(`${API}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new GitHubError(
      "Could not reach the GitHub API. Check your network / server environment.",
      0,
      "network",
    );
  }

  if (expected.includes(response.status)) {
    return (await response.json()) as T;
  }

  if (response.status === 422 || response.status === 409) {
    throw new GitHubError(
      "The file changed on GitHub while you were editing it. Please reload the latest version before saving again.",
      409,
      "conflict",
    );
  }

  throw new GitHubError(
    `GitHub API returned an error (HTTP ${response.status}).`,
    response.status,
    mapStatus(response.status),
  );
}

/* ------------------------------------------------------------------ */
/* Staging-Branch (alle Admin-Aenderungen werden hier gesammelt)       */
/* ------------------------------------------------------------------ */

interface CompareData {
  status: string;
  ahead_by: number;
  behind_by: number;
}

async function getBranchHead(
  config: GitHubConfig,
  branch: string,
): Promise<string | null> {
  try {
    const data = await gh<{ object?: { sha?: string } }>({
      method: "GET",
      path: `/repos/${config.owner}/${config.repo}/git/ref/heads/${encodeURIComponent(branch)}`,
      expected: [200],
    });
    return data.object?.sha ?? null;
  } catch (error) {
    if (error instanceof GitHubError && error.code === "not_found") {
      return null;
    }
    throw error;
  }
}

async function createBranchRef(
  config: GitHubConfig,
  branch: string,
  sha: string,
): Promise<void> {
  await gh<never>({
    method: "POST",
    path: `/repos/${config.owner}/${config.repo}/git/refs`,
    body: { ref: `refs/heads/${branch}`, sha },
    expected: [201],
  });
}

async function updateBranchRef(
  config: GitHubConfig,
  branch: string,
  sha: string,
  force: boolean,
): Promise<void> {
  await gh<never>({
    method: "PATCH",
    path: `/repos/${config.owner}/${config.repo}/git/refs/heads/${encodeURIComponent(branch)}`,
    body: { sha, force },
    expected: [200],
  });
}

async function compareBranches(
  config: GitHubConfig,
  base: string,
  head: string,
): Promise<CompareData> {
  const data = await gh<CompareData>({
    method: "GET",
    path: `/repos/${config.owner}/${config.repo}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}`,
    expected: [200],
  });
  return {
    status: data.status,
    ahead_by: data.ahead_by ?? 0,
    behind_by: data.behind_by ?? 0,
  };
}

/**
 * Stellt sicher, dass der Staging-Branch existiert (auf `main`-Spitze).
 * Ist er zurueckgefallen weil `main` extern weitergelaufen ist und der
 * Staging-Branch keine eigenen Commits hat, wird er gefahrlos nachgezogen.
 */
export async function ensureStagingBranch(): Promise<string> {
  const config = assertGithubConfigured();
  const staging = getStagingBranchName();

  const head = await getBranchHead(config, staging);
  if (head) {
    // compare(base=staging, head=main): ahead_by = wie weit main dem
    // Staging voraus ist, behind_by = eigene (pending) Commits des Staging.
    // Fast-Forward nur, wenn main voraus ist UND Staging nichts Eigenes hat.
    const cmp = await compareBranches(config, staging, config.branch);
    if (cmp.ahead_by > 0 && cmp.behind_by === 0) {
      const mainHead = await getBranchHead(config, config.branch);
      if (mainHead) {
        await updateBranchRef(config, staging, mainHead, true);
      }
    }
    return staging;
  }

  const mainHead = await getBranchHead(config, config.branch);
  if (!mainHead) {
    throw new GitHubError("Repository main branch not found.", 500, "unknown");
  }
  await createBranchRef(config, staging, mainHead);
  return staging;
}

/**
 * Branch, aus dem Admin-Lese-/Schreibzugriffe arbeiten: der Staging-Branch,
 * solange er existiert und nicht nur hinter `main` liegt (keine pending
 * Commits). So sieht das Dashboard immer den echten, vorgemerkten Stand und
 * die SHA-Konfliktpruefung beim Schreiben funktioniert.
 */
export async function resolveContentBranch(): Promise<string> {
  const config = getGithubConfig();
  if (!config.token) {
    return config.branch;
  }
  const staging = getStagingBranchName();
  const stageHead = await getBranchHead(config, staging);
  if (!stageHead) {
    return config.branch;
  }
  const cmp = await compareBranches(config, config.branch, staging);
  if (cmp.behind_by > 0 && cmp.ahead_by === 0) {
    return config.branch;
  }
  return staging;
}

export interface StagingStatus {
  configured: boolean;
  mainBranch: string;
  stagingBranch: string | null;
  aheadBy: number;
  behindBy: number;
  hasChanges: boolean;
  status: string;
}

export async function getStagingStatus(): Promise<StagingStatus> {
  const config = getGithubConfig();
  const staging = getStagingBranchName();
  const base = {
    configured: Boolean(config.token),
    mainBranch: config.branch,
    stagingBranch: config.token ? staging : null,
  };
  if (!config.token) {
    return { ...base, aheadBy: 0, behindBy: 0, hasChanges: false, status: "identical" };
  }

  const stageHead = await getBranchHead(config, staging);
  if (!stageHead) {
    return { ...base, aheadBy: 0, behindBy: 0, hasChanges: false, status: "identical" };
  }
  const cmp = await compareBranches(config, config.branch, staging);
  return {
    ...base,
    aheadBy: cmp.ahead_by,
    behindBy: cmp.behind_by,
    hasChanges: cmp.ahead_by > 0,
    status: cmp.status,
  };
}

export interface FlushResult {
  mode: "none" | "fast-forward" | "merge";
  commitsPushed: number;
  sha: string | null;
  merged: boolean;
}

async function mergeBranches(
  config: GitHubConfig,
  base: string,
  head: string,
): Promise<string> {
  try {
    const data = await gh<{ sha?: string }>({
      method: "POST",
      path: `/repos/${config.owner}/${config.repo}/merges`,
      body: {
        base,
        head,
        commit_message: withCommitPrefix("admin: push staged changes"),
      },
      expected: [201],
    });
    return data.sha ?? "";
  } catch (error) {
    if (error instanceof GitHubError && error.code === "conflict") {
      throw new GitHubError(
        `Staging-Branch "${head}" und "${base}" sind divergiert – Konflikt beim Pushen. Bitte manuell aufloesen.`,
        409,
        "conflict",
      );
    }
    if (error instanceof GitHubError && error.status === 204) {
      return "";
    }
    throw error;
  }
}

/**
 * Pusht alle gesammelten (Staging-)Commits in EINEM Push auf `main`:
 * bevorzugt als Fast-Forward (kein Merge-Commit, Vercel baut genau einmal).
 * Nur wenn `main` parallel extern weitergelaufen ist, wird ein Merge-Commit
 * erstellt – ebenfalls nur ein einziger Push.
 */
export async function flushStagingChanges(): Promise<FlushResult> {
  const config = assertGithubConfigured();
  const staging = await ensureStagingBranch();

  const cmp = await compareBranches(config, config.branch, staging);
  if (cmp.ahead_by === 0) {
    return { mode: "none", commitsPushed: 0, sha: null, merged: false };
  }

  const stageHead = await getBranchHead(config, staging);
  if (!stageHead) {
    throw new GitHubError("Staging branch has no commits.", 500, "unknown");
  }

  try {
    await updateBranchRef(config, config.branch, stageHead, false);
    return {
      mode: "fast-forward",
      commitsPushed: cmp.ahead_by,
      sha: stageHead,
      merged: false,
    };
  } catch (error) {
    const needsMerge =
      error instanceof GitHubError && (error.status === 409 || error.status === 422);
    if (!needsMerge) throw error;

    const sha = await mergeBranches(config, config.branch, staging);
    return {
      mode: "merge",
      commitsPushed: cmp.ahead_by,
      sha,
      merged: true,
    };
  }
}

/**
 * Verwirft alle gesammelten (Staging-)Aenderungen: setzt den Staging-Branch
 * per Force-Update auf `main` zurueck. Offene Commits verschwinden, ohne dass
 * etwas auf `main` gepusht wird.
 */
export async function discardStagingChanges(): Promise<{
  discards: number;
}> {
  const config = assertGithubConfigured();
  const staging = getStagingBranchName();

  const stageHead = await getBranchHead(config, staging);
  if (!stageHead) {
    return { discards: 0 };
  }

  const mainHead = await getBranchHead(config, config.branch);
  if (!mainHead) {
    throw new GitHubError("Repository main branch not found.", 500, "unknown");
  }

  const cmp = await compareBranches(config, config.branch, staging);
  if (stageHead !== mainHead) {
    await updateBranchRef(config, staging, mainHead, true);
  }
  return { discards: cmp.ahead_by };
}

/** Liest eine Datei aus dem Repository (content branch). */
export async function getRepositoryFile(
  path: string,
): Promise<RepositoryFile | null> {
  const config = assertGithubConfigured();
  try {
    const branch = await resolveContentBranch();
    const data = await gh<{
      path: string;
      sha: string;
      content?: string;
      encoding?: string;
    }>({
      method: "GET",
      path: `/repos/${config.owner}/${config.repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`,
      expected: [200],
    });

    if (typeof data.content !== "string") {
      throw new GitHubError("GitHub returned a directory instead of a file.", 500, "unknown");
    }

    return {
      path: data.path,
      sha: data.sha,
      content: Buffer.from(data.content, "base64").toString("utf8"),
    };
  } catch (error) {
    if (error instanceof GitHubError && error.code === "not_found") {
      return null;
    }
    throw error;
  }
}

interface PutBody {
  message: string;
  branch: string;
  content: string;
  sha?: string;
}

/** Erstellt (ohne sha) oder aktualisiert (mit sha) eine Datei auf dem Staging-Branch. */
export async function putRepositoryFile({
  path,
  content,
  message,
  sha,
}: {
  path: string;
  content: string;
  message: string;
  sha?: string;
}): Promise<WriteResult> {
  const config = assertGithubConfigured();
  const branch = await ensureStagingBranch();
  const body: PutBody = {
    message: withCommitPrefix(message),
    branch,
    content: encodeBase64(content),
  };
  if (sha) {
    body.sha = sha;
  }

  const data = await gh<{ content?: { sha?: string }; commit?: { sha?: string }; sha?: string }>({
    method: "PUT",
    path: `/repos/${config.owner}/${config.repo}/contents/${encodePath(path)}`,
    body,
    expected: [200, 201],
  });

  return {
    sha: data.content?.sha ?? data.sha ?? "",
    commitSha: data.commit?.sha ?? null,
  };
}

/** Loescht eine Datei auf dem Staging-Branch (benoetigt den aktuellen sha). */
export async function deleteRepositoryFile({
  path,
  message,
  sha,
}: {
  path: string;
  message: string;
  sha: string;
}): Promise<void> {
  const config = assertGithubConfigured();
  const branch = await ensureStagingBranch();
  await gh<never>({
    method: "DELETE",
    path: `/repos/${config.owner}/${config.repo}/contents/${encodePath(path)}`,
    body: {
      message: withCommitPrefix(message),
      branch,
      sha,
    },
    expected: [200],
  });
}

/** Letzte Commits, optional gefiltert auf einen Pfad. */
export async function listCommits({
  path,
  perPage = 10,
}: {
  path?: string;
  perPage?: number;
} = {}): Promise<SimpleCommit[]> {
  const config = assertGithubConfigured();
  const query = new URLSearchParams({
    per_page: String(perPage),
  });
  if (path) {
    query.set("path", path);
  }

  const data = await gh<RawCommitPayload[]>({
    method: "GET",
    path: `/repos/${config.owner}/${config.repo}/commits?${query.toString()}`,
    expected: [200],
  });

  return data.map(serializeCommit).filter((c): c is SimpleCommit => c !== null);
}