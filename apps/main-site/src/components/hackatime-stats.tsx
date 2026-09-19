const HACKATIME_URL =
  "https://github-readme-stats.hackclub.dev/api/wakatime?username=36150&api_domain=hackatime.hackclub.com&theme=darcula&custom_title=Hackatime+Stats&layout=compact&cache_seconds=3600&langs_count=8";

export default async function HackatimeStats() {
  let base64: string;

  try {
    const res = await fetch(HACKATIME_URL, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const svg = await res.text();
    base64 = Buffer.from(svg).toString("base64");
  } catch {
    return (
      <p className="text-sm text-foreground/60">
        Sta&shy;tistiken konn&shy;ten nicht gela&shy;den wer&shy;den.
      </p>
    );
  }

  return (
    <img
      src={`data:image/svg+xml;base64,${base64}`}
      alt="Hackatime Coding Stats"
    />
  );
}
