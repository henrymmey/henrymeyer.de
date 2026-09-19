import { Alert, AlertDescription, AlertTitle } from "@repo/ui";
import { getGitHubData } from "@/lib/github";

export default async function GitHubStats({ username }: { username: string }) {
  const { publicRepos, followers, commits } = await getGitHubData(username);

  if (publicRepos === null || followers === null) {
    return (
      <Alert
        variant="destructive"
        className="mt-8 bg-background text-foreground"
      >
        <AlertTitle>GitHub stats unavailable</AlertTitle>
        <AlertDescription>
          The GitHub API could not be reached at render time. Please retry
          later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-8 flex w-fit flex-wrap items-center gap-8 rounded-base border border-border/30 px-5 py-3 text-main-foreground">
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-heading">{publicRepos}</p>
        <p className="font-mono text-xs opacity-75">Repos</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-heading">{followers}</p>
        <p className="font-mono text-xs opacity-75">Followers</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-heading">
          {commits !== null ? commits : "N/A"}
        </p>
        <p className="font-mono text-xs opacity-75">Commits</p>
      </div>
    </div>
  );
}
