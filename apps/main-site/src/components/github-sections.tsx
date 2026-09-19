import { Alert, AlertDescription, AlertTitle } from "@repo/ui";
import SectionHeading from "@/components/section-heading";
import { getGitHubData } from "@/lib/github";

type GitHubSectionsProps = {
  username: string;
};

export default async function GitHubSections({
  username,
}: GitHubSectionsProps) {
  const { publicRepos, followers, commits } = await getGitHubData(username);
  const hasProfile = publicRepos !== null && followers !== null;

  return (
    <section
      id="stats"
      className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm"
    >
      <SectionHeading index="05" title="GitHub Stats" />

      {hasProfile ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-base border border-border/30 bg-main p-4 text-main-foreground shadow-sm">
            <p className="font-mono text-xs">Repos</p>
            <p className="text-3xl font-heading">{publicRepos}</p>
          </div>
          <div className="rounded-base border border-border/30 bg-main p-4 text-main-foreground shadow-sm">
            <p className="font-mono text-xs">Followers</p>
            <p className="text-3xl font-heading">{followers}</p>
          </div>
          <div className="rounded-base border border-border/30 bg-main p-4 text-main-foreground shadow-sm">
            <p className="font-mono text-xs">Commits</p>
            <p className="text-3xl font-heading">
              {commits !== null ? commits : "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <Alert variant="destructive">
          <AlertTitle>GitHub stats unavailable</AlertTitle>
          <AlertDescription>
            The GitHub API could not be reached at render time. Please retry
            later.
          </AlertDescription>
        </Alert>
      )}
    </section>
  );
}
