"use client";

import Link from "next/link";
import { useConsent } from "@/components/consent-provider";
import MinecraftButton from "@/components/minecraft/minecraft-button";
import { MaterialIcon } from "@/components/minecraft/minecraft-icons";

const DISCORD_WIDGET_URL =
  "https://discord.com/widget?id=1008744945718415391&theme=dark";

export default function DiscordWidget() {
  const { snapshot, grant } = useConsent();

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-block border border-black/60 bg-surface-3 shadow-card">
      <div className="texture texture-stone tex-24 relative flex items-center justify-between gap-3 border-b-2 border-black/50 bg-black/10 px-4 py-2.5">
        <span className="flex items-center gap-2 font-pixel text-[11px] uppercase tracking-[0.14em] text-foreground">
          <MaterialIcon name="chest" className="size-4" />
          Discord
        </span>
      </div>

      {snapshot.status === "granted" ? (
        <div className="min-h-0 flex-1">
          <iframe
            src={DISCORD_WIDGET_URL}
            title="Discord-Widget"
            allowTransparency
            loading="lazy"
            className="h-full w-full border-0 bg-[#0b0e0b]"
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-block border-2 border-black/70 bg-surface-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_2px_0_rgb(0_0_0/0.5)]">
            <MaterialIcon name="chest" className="size-6" />
          </span>
          <p className="font-pixel text-base uppercase tracking-wide text-foreground">
            Discord gesperrt
          </p>
          <p className="max-w-72 text-sm leading-relaxed text-muted">
            Für dieses Widget ist Ihre Einwilligung erforderlich: Beim Laden
            werden Daten, z.&nbsp;B. Ihre IP-Adresse, an Discord als
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