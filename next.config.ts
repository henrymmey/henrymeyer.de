import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { execFileSync } from "node:child_process";

const withMDX = createMDX({ extension: /\.mdx?$/ });

function getCommitSha(): string | undefined {
  const vercelSha = process.env.VERCEL_GIT_COMMIT_SHA?.trim();
  if (vercelSha && /^[0-9a-f]{40}$/i.test(vercelSha)) return vercelSha;

  try {
    const localSha = execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return /^[0-9a-f]{40}$/i.test(localSha) ? localSha : undefined;
  } catch {
    return undefined;
  }
}

const commitSha = getCommitSha();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  env: {
    NEXT_PUBLIC_COMMIT_SHA: commitSha,
  },
};

export default withMDX(nextConfig);
