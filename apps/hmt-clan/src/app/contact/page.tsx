import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import PageIntro from "@/components/minecraft/page-intro";
import BlockFrame from "@/components/minecraft/block-frame";
import MinecraftButton from "@/components/minecraft/minecraft-button";

export const metadata: Metadata = {
  title: "Kontakt | HMT Clan",
  description:
    "Kontakt zum HMT Clan: Discord, Server-Einladung und E-Mail für Anfragen an die Crew.",
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Kontakt | HMT Clan",
    description: "Kontakt zum HMT Clan über Discord und E-Mail.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_URL || "https://hmtclan.de"}/contact`,
  },
};

const discordUsername = "henrymmey";
const discordId = "1008346032230387752";
const discordServerInvite = "8aWmBuYURK";
const contactEmail = "hmt-clan@henrymeyer.de";

function ContactRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/5 py-4 last:border-none">
      <p className="font-pixel text-[9px] uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <div className="mt-1 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        title="Kontakt"
        description="Wie du den HMT Clan erreichst – über Discord oder direkt per E-Mail."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <BlockFrame
          className="mb-6"
          headerTexture="slime"
          header={
            <>
              <span className="flex items-center gap-2 font-pixel text-[11px] uppercase tracking-[0.14em] text-[#efe8d8]">
                Joine dem HMT Clan
              </span>
            </>
          }
          bodyClassName="p-5 md:p-6"
        >
          <p className="text-sm leading-relaxed text-muted">
            Wenn du Teil des HMT Clans werden möchtest, hier entlang:
          </p>
          <div className="mt-4">
            <MinecraftButton href="/join" variant="primary">
              HMT beitreten
            </MinecraftButton>
          </div>
        </BlockFrame>

        <div className="grid gap-6 lg:grid-cols-2">
          <BlockFrame
            header={
              <>
                <span className="flex items-center gap-2 font-pixel text-[11px] uppercase tracking-[0.14em] text-[#efe8d8]">
                  Discord
                </span>
              </>
            }
            bodyClassName="p-5 md:p-6"
          >
            <ContactRow label="User">
              <a
                href={`https://discord.com/users/${discordId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-emerald/40 underline-offset-2 transition-colors hover:text-emerald"
              >
                @{discordUsername}
              </a>
            </ContactRow>
            <ContactRow label="Server">
              <a
                href={`https://discord.gg/${discordServerInvite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-emerald/40 underline-offset-2 transition-colors hover:text-emerald"
              >
                HMT Clan Discord-Server
              </a>
            </ContactRow>
            <div className="pt-4">
              <MinecraftButton
                href={`https://discord.gg/${discordServerInvite}`}
                external
                variant="primary"
              >
                Server beitreten
              </MinecraftButton>
            </div>
          </BlockFrame>

          <BlockFrame
            header={
              <>
                <span className="flex items-center gap-2 font-pixel text-[11px] uppercase tracking-[0.14em] text-[#efe8d8]">
                  E-Mail
                </span>
              </>
            }
            bodyClassName="p-5 md:p-6"
          >
            <ContactRow label="E-Mail">
              <a
                href={`mailto:${contactEmail}`}
                className="text-foreground underline decoration-emerald/40 underline-offset-2 transition-colors hover:text-emerald"
              >
                {contactEmail}
              </a>
            </ContactRow>
            <p className="pb-2 pt-4 text-sm leading-relaxed text-muted">
              Für organisatorische Anfragen oder Presse - schreib uns gerne.
            </p>
            <div className="pt-3">
              <MinecraftButton href={`mailto:${contactEmail}`} variant="stone">
                E-Mail schreiben
              </MinecraftButton>
            </div>
          </BlockFrame>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
