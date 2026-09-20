"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useConsent } from "@/components/consent-provider";
import MinecraftButton from "@/components/minecraft/minecraft-button";
import { MaterialIcon } from "@/components/minecraft/minecraft-icons";

const CALENDAR_WIDGET_URL =
  "https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FBerlin&showPrint=0&showTz=0&mode=WEEK&src=MWUxNDA2MjRiMDQ2NTgyNzM2NDA4NjA2ODYyZmRmYTBlZDUwZjliODcyODFkYzY0ZDFmNzM3MWE3MzMxNWQ1ZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%237986cb";

export default function CalendarWidget({
  fill = false,
  className = "",
}: {
  fill?: boolean;
  className?: string;
}) {
  const { snapshot, grant } = useConsent();

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card",
        fill ? "h-full min-h-0" : "h-[560px] md:h-[600px]",
        className,
      )}
    >
      <div className="texture texture-stone tex-24 relative flex items-center justify-between gap-3 border-b-2 border-black/50 bg-black/10 px-4 py-2.5">
        <span className="flex items-center gap-2 font-pixel text-[11px] uppercase tracking-[0.14em] text-foreground">
          <MaterialIcon name="map" className="size-4" />
          Event-Kalender
        </span>
        <Link
          href="/calendar"
          className="inline-flex items-center gap-1 rounded-block border border-black/50 bg-black/40 px-2 py-1 font-pixel text-[9px] uppercase tracking-[0.14em] text-emerald shadow-[0_2px_0_rgb(0_0_0/0.5)] transition-all duration-150 hover:-translate-y-px hover:bg-black/55 hover:text-emerald active:translate-y-px active:shadow-none"
        >
          Vollansicht
        </Link>
      </div>

      {snapshot.status === "granted" ? (
        <div className="min-h-0 flex-1">
          <iframe
            src={CALENDAR_WIDGET_URL}
            title="Google-Kalender"
            style={{ borderWidth: 0 }}
            width={800}
            height={600}
            loading="lazy"
            className="invert-[0.9] hue-rotate-180 h-full w-full bg-[#0b0e0b]"
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-block border-2 border-black/70 bg-surface-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_2px_0_rgb(0_0_0/0.5)]">
            <MaterialIcon name="chest" className="size-6" />
          </span>
          <p className="font-pixel text-base uppercase tracking-wide text-foreground">
            Kalender gesperrt
          </p>
          <p className="max-w-72 text-sm leading-relaxed text-muted">
            Für dieses Widget ist Ihre Einwilligung erforderlich: Beim Laden
            werden Daten, z.&nbsp;B. Ihre IP-Adresse, an Google als
            Drittanbieter übertragen.
          </p>
          <MinecraftButton type="button" variant="stone" onClick={grant}>
            Einwilligen
          </MinecraftButton>
          <Link
            href="/legal/privacy"
            className="font-pixel text-[10px] uppercase tracking-[0.12em] text-muted underline decoration-emerald/40 underline-offset-4 transition-colors hover:text-foreground"
          >
            Datenschutzerklärung
          </Link>
        </div>
      )}
    </div>
  );
}