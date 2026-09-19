export type GitHubProfile = {
  public_repos: number;
  followers: number;
};

export type GitHubStats = {
  publicRepos: number | null;
  followers: number | null;
  commits: number | null;
};

function createGitHubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };
  const token = process.env.GITHUB_TOKEN;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function getGitHubData(username: string): Promise<GitHubStats> {
  const headers = createGitHubHeaders();
  const requestOptions = {
    headers,
    next: { revalidate: 21600 },
    signal: AbortSignal.timeout(5000),
  };

  const [profileResponse, commitsResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, requestOptions),
    fetch(`https://api.github.com/search/commits?q=author:${username}`, {
      ...requestOptions,
      headers: {
        ...headers,
        Accept: "application/vnd.github.cloak-preview+json",
      },
    }),
  ]);

  const profile = profileResponse.ok
    ? ((await profileResponse.json()) as GitHubProfile)
    : null;

  const commitsData = commitsResponse.ok ? await commitsResponse.json() : null;

  return {
    publicRepos: profile?.public_repos ?? null,
    followers: profile?.followers ?? null,
    commits: commitsData ? commitsData.total_count : null,
  };
}
