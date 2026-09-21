import { readFile } from "fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const spec = await readFile(join(process.cwd(), "openapi.yaml"), "utf-8");
    return new NextResponse(spec, {
      headers: { "Content-Type": "application/yaml; charset=utf-8" },
    });
  } catch {
    return NextResponse.json(
      { error: "OpenAPI specification not found" },
      { status: 500 },
    );
  }
}