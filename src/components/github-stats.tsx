import { getGitHubStats } from "@/lib/github";

export default async function GitHubStats({ username }: { username: string }) {
  const { publicRepos, followers, commits } = await getGitHubStats(username);

  return (
    <div className="mt-8 flex w-fit flex-wrap items-center gap-8 rounded-base border border-border/30 px-5 py-3 text-main-foreground">
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-heading">{publicRepos ?? "N/A"}</p>
        <p className="font-mono text-xs opacity-75">Repos</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-heading">{followers ?? "N/A"}</p>
        <p className="font-mono text-xs opacity-75">Followers</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-heading">{commits ?? "N/A"}</p>
        <p className="font-mono text-xs opacity-75">Commits</p>
      </div>
    </div>
  );
}
