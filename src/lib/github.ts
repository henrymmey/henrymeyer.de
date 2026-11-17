export type GitHubStats = {
  publicRepos: number | null;
  followers: number | null;
  commits: number | null;
};

type GitHubProfile = {
  public_repos?: number;
  followers?: number;
};

function headers(accept = "application/vnd.github+json"): HeadersInit {
  const result: Record<string, string> = { Accept: accept };
  const token = process.env.GITHUB_TOKEN;

  if (token) result.Authorization = `Bearer ${token}`;
  return result;
}

async function fetchJson(url: string, requestHeaders: HeadersInit) {
  try {
    const response = await fetch(url, {
      headers: requestHeaders,
      signal: AbortSignal.timeout(8000),
    });
    return response.ok ? await response.json() : null;
  } catch {
    // Keep the static export buildable when GitHub is temporarily unavailable.
    return null;
  }
}

export async function getGitHubStats(username: string): Promise<GitHubStats> {
  const [profileData, commitsData] = await Promise.all([
    fetchJson(`https://api.github.com/users/${username}`, headers()),
    fetchJson(
      `https://api.github.com/search/commits?q=author:${username}`,
      headers("application/vnd.github.cloak-preview+json"),
    ),
  ]);

  const profile = profileData as GitHubProfile | null;
  const commits = commitsData as { total_count?: number } | null;

  return {
    publicRepos: typeof profile?.public_repos === "number" ? profile.public_repos : null,
    followers: typeof profile?.followers === "number" ? profile.followers : null,
    commits: typeof commits?.total_count === "number" ? commits.total_count : null,
  };
}

