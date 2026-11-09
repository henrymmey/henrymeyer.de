const HACKATIME_URL =
  "https://github-readme-stats.hackclub.dev/api/wakatime?username=36150&api_domain=hackatime.hackclub.com&theme=darcula&custom_title=Hackatime+Stats&layout=compact&cache_seconds=3600&langs_count=8";
const GITHUB_STREAK_URL =
  "https://github-readme-stats-fast.vercel.app/api/streak?username=henrymmey&theme=github_dark";

export default async function HackatimeStats() {
  let hackatimeBase64: string;
  let githubStreakBase64: string;

  try {
    const [hackatimeRes, githubStreakRes] = await Promise.all([
      fetch(HACKATIME_URL, { next: { revalidate: 3600 } }),
      fetch(GITHUB_STREAK_URL, { next: { revalidate: 3600 } }),
    ]);

    if (!hackatimeRes.ok || !githubStreakRes.ok) {
      throw new Error(
        `HTTP ${hackatimeRes.status}/${githubStreakRes.status}`,
      );
    }

    const [hackatimeSvg, githubStreakSvg] = await Promise.all([
      hackatimeRes.text(),
      githubStreakRes.text(),
    ]);
    hackatimeBase64 = Buffer.from(hackatimeSvg).toString("base64");
    githubStreakBase64 = Buffer.from(githubStreakSvg).toString("base64");
  } catch {
    return (
      <p className="text-sm text-foreground/60">
        Sta&shy;tistiken konn&shy;ten nicht gela&shy;den wer&shy;den.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <img
        src={`data:image/svg+xml;base64,${hackatimeBase64}`}
        alt="Hackatime Coding Stats"
      />
      <img
        src={`data:image/svg+xml;base64,${githubStreakBase64}`}
        alt="GitHub contribution streak stats"
      />
    </div>
  );
}
