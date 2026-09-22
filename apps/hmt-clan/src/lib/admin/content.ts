import {
  GitHubError,
  getRepositoryFile,
  putRepositoryFile,
  type WriteResult,
} from "@/lib/github/github-service";

/** Fuer fachliche Fehler der Content-Services. */
export class ContentError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ContentError";
    this.status = status;
    this.code = code;
  }
}

/** Schreibt JSON in dem Format, das die Website erwartet (2 Spaces + Newline). */
export function serializeJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export async function readJsonList(
  path: string,
): Promise<{ data: unknown[]; sha: string | null }> {
  const file = await getRepositoryFile(path);
  if (!file) {
    return { data: [], sha: null };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(file.content);
  } catch {
    throw new GitHubError(`File "${path}" is not valid JSON.`, 500, "unknown");
  }
  if (!Array.isArray(parsed)) {
    throw new GitHubError(
      `File "${path}" is not a JSON array.`,
      500,
      "unknown",
    );
  }
  return { data: parsed, sha: file.sha };
}

export async function writeJsonList(
  path: string,
  data: unknown[],
  message: string,
  sha?: string | null,
): Promise<WriteResult> {
  return putRepositoryFile({
    path,
    content: serializeJson(data),
    message,
    sha: sha ?? undefined,
  });
}