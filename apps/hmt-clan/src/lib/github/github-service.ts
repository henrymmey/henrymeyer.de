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

/** Liest eine Datei aus dem Repository (default branch). */
export async function getRepositoryFile(
  path: string,
): Promise<RepositoryFile | null> {
  const config = assertGithubConfigured();
  try {
    const data = await gh<{
      path: string;
      sha: string;
      content?: string;
      encoding?: string;
    }>({
      method: "GET",
      path: `/repos/${config.owner}/${config.repo}/contents/${encodePath(path)}?ref=${encodeURIComponent(config.branch)}`,
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

/** Erstellt (ohne sha) oder aktualisiert (mit sha) eine Datei. */
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
  const body: PutBody = {
    message,
    branch: config.branch,
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

/** Loescht eine Datei (benoetigt den aktuellen sha). */
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
  await gh<never>({
    method: "DELETE",
    path: `/repos/${config.owner}/${config.repo}/contents/${encodePath(path)}`,
    body: {
      message,
      branch: config.branch,
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