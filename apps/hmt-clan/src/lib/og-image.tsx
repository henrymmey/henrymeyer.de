type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
};

export const OG_SIZE = { width: 1200, height: 630 } as const;

const GRASS = "#79c44a";
const GRASS_DARK = "#4f8a2c";
const DIRT = "#82503a";
const BG = "#0b0e0b";
const TEXT_PRIMARY = "#e9e6d6";

let fontPromise: Promise<OgFont[]> | null = null;

function loadSilkscreen(): Promise<OgFont[]> {
  if (!fontPromise) {
    fontPromise = (async () => {
      try {
        const css = await fetch(
          "https://fonts.googleapis.com/css2?family=Silkscreen:wght@700",
        ).then((res) => res.text());
        const match = /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/i.exec(css);
        if (!match) return [];
        const data = await (await fetch(match[1])).arrayBuffer();
        return [
          {
            name: "Silkscreen",
            data,
            weight: 700,
            style: "normal",
          },
        ] as OgFont[];
      } catch {
        return [];
      }
    })();
  }
  return fontPromise;
}

export { loadSilkscreen as loadOgFonts };

function titleSize(title: string): number {
  const len = title.length;
  if (len <= 10) return 96;
  if (len <= 15) return 80;
  if (len <= 22) return 64;
  if (len <= 30) return 52;
  return 40;
}

function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current && `${current} ${word}`.length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

type OgCardProps = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export function OgCard({ title, subtitle, badge }: OgCardProps) {
  const showBadge = !badge ? "Minecraft · Survival · Community" : badge;
  const lines = wrapLines(title.toUpperCase(), 18);
  const size = lines.length > 1 ? Math.floor(titleSize(title) * 0.82) : titleSize(title);

  return (
    <div
      style={{
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        display: "flex",
        flexDirection: "column",
        backgroundColor: BG,
        fontFamily: "Silkscreen, monospace",
        color: TEXT_PRIMARY,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundImage: `radial-gradient(circle at 50% 40%, rgba(38, 51, 34, 0.55), transparent 62%), linear-gradient(to bottom, ${BG} 55%, #10160d 78%, #171d0f 100%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: 34,
            backgroundImage: `linear-gradient(to bottom, ${GRASS} 0%, ${GRASS} 78%, #5c9636 100%)`,
            borderTop: `6px solid ${GRASS_DARK}`,
            boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.35)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: 54,
            backgroundColor: DIRT,
            backgroundImage:
              "radial-gradient(circle at 18% 35%, rgba(0,0,0,0.28) 0 7px, transparent 8px)," +
              "radial-gradient(circle at 62% 60%, rgba(0,0,0,0.28) 0 9px, transparent 10px)," +
              "radial-gradient(circle at 84% 30%, rgba(255,255,255,0.12) 0 5px, transparent 6px)," +
              "radial-gradient(circle at 8% 70%, rgba(0,0,0,0.28) 0 6px, transparent 7px)," +
              "radial-gradient(circle at 46% 20%, rgba(255,255,255,0.1) 0 5px, transparent 6px)",
            boxShadow: "inset 0 4px 0 rgba(0,0,0,0.4), inset 0 0 0 2px rgba(0,0,0,0.25)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: "48px 72px 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            marginBottom: 34,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              backgroundColor: GRASS,
              border: "3px solid rgba(0,0,0,0.55)",
              boxShadow: "3px 3px 0 rgba(0,0,0,0.45)",
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 8,
              color: "#a8b3a4",
            }}
          >
            HMT CLAN
          </div>
          <div
            style={{
              width: 22,
              height: 22,
              backgroundColor: GRASS,
              border: "3px solid rgba(0,0,0,0.55)",
              boxShadow: "3px 3px 0 rgba(0,0,0,0.45)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          {lines.map((line) => (
            <div
              key={line}
              style={{
                fontSize: size,
                lineHeight: 1.04,
                letterSpacing: 2,
                color: GRASS,
                textShadow: "0 7px 0 rgba(0,0,0,0.5)",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {subtitle && (
          <div
            style={{
              marginTop: 34,
              fontSize: 30,
              letterSpacing: 1.5,
              color: TEXT_PRIMARY,
            }}
          >
            {subtitle}
          </div>
        )}

        <div
          style={{
            marginTop: subtitle ? 30 : 40,
            padding: "12px 26px",
            fontSize: 24,
            letterSpacing: 4,
            color: TEXT_PRIMARY,
            border: `3px solid ${GRASS_DARK}`,
            backgroundColor: "rgba(0,0,0,0.35)",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.45)",
          }}
        >
          {showBadge}
        </div>
      </div>
    </div>
  );
}