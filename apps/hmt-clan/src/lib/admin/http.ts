import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { GitHubError } from "@/lib/github/github-service";

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk(data: Record<string, unknown>): NextResponse {
  return NextResponse.json({ ok: true, ...data });
}

/** Meldet Fehler konsistent an den Client – nie Stacktraces/Secrets. */
export function jsonFromError(error: unknown, fallback = "Something went wrong."): NextResponse {
  if (error instanceof ZodError) {
    const first = error.issues[0];
    const message = first
      ? `${first.path.join(".") ? first.path.join(".") + ": " : ""}${first.message}`
      : "Invalid input.";
    return jsonError(message, 400);
  }

  if (error instanceof GitHubError) {
    if (error.code === "unconfigured") {
      return jsonError(error.message, 503);
    }
    if (error.code === "conflict") {
      return jsonError(error.message, 409);
    }
    if (error.code === "not_found") {
      return jsonError("File not found in the repository.", 404);
    }
    if (
      error.code === "unauthorized" ||
      error.code === "forbidden" ||
      error.code === "rate_limited"
    ) {
      return jsonError(error.message, 502);
    }
    if (error.code === "network") {
      return jsonError("GitHub is not reachable right now.", 502);
    }
    return jsonError(error.message, 502);
  }

  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if (code === "event_not_found") return jsonError("Event not found.", 404);
    if (code === "event_exists")
      return jsonError("An event with this slug already exists.", 409);
    if (code === "crew_exists")
      return jsonError("A crew member with this slug already exists.", 409);
    if (code === "member_not_found")
      return jsonError("Crew member not found.", 404);
    if (code === "season_not_found")
      return jsonError("Season not found.", 404);
    if (code === "season_exists")
      return jsonError("A season with this slug already exists.", 409);
    if (code === "markdown_not_found")
      return jsonError("Markdown file not found.", 404);
  }

  console.error("[admin-api]", error instanceof Error ? error.message : error);
  return jsonError(fallback, 500);
}

export function notFoundError(): NextResponse {
  return jsonError("Not found.", 404);
}