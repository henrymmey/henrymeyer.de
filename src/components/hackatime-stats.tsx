const HACKATIME_URL =
  "https://github-readme-stats.hackclub.dev/api/wakatime?username=36150&api_domain=hackatime.hackclub.com&theme=darcula&custom_title=Hackatime+Stats&layout=compact&cache_seconds=0&langs_count=8";

export default async function HackatimeStats() {
  try {
    const res = await fetch(HACKATIME_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const svg = await res.text();
    const base64 = Buffer.from(svg).toString("base64");

    return (
      <img
        src={`data:image/svg+xml;base64,${base64}`}
        alt="Hackatime Coding Stats"
      />
    );
  } catch {
    return (
      <p className="text-sm text-foreground/60">
        Sta&shy;tistiken konn&shy;ten nicht gela&shy;den wer&shy;den.
      </p>
    );
  }
}
