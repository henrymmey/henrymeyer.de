export default async function SkillIcons({
  icons,
  label,
  perline,
}: {
  icons: string;
  label: string;
  perline?: number;
}) {
  const url = `https://skillicons.dev/icons?i=${icons}${perline ? `&perline=${perline}` : ""}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const svg = await res.text();
    const base64 = Buffer.from(svg).toString("base64");

    return (
      <img
        src={`data:image/svg+xml;base64,${base64}`}
        alt={label}
        className={perline ? "max-w-full" : undefined}
      />
    );
  } catch {
    return (
      <p className="text-sm text-foreground/60">
        Icons konn&shy;ten nicht gela&shy;den wer&shy;den.
      </p>
    );
  }
}
