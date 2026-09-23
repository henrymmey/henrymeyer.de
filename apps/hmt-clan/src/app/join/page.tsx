import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import PageIntro from "@/components/minecraft/page-intro";
import MinecraftButton from "@/components/minecraft/minecraft-button";
import JsonLd from "@/components/json-ld";
import { howToJoinSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "HMT Clan Beitreten | HMT Clan",
  description:
    "Wie du dem HMT Clan beitrittst – über den Discord-Server und den TheScape-Server.",
  alternates: {
    canonical: "/join",
  },
};

const discordInvite = "https://discord.gg/8aWmBuYURK";

export default function JoinPage() {
  return (
    <main>
      <PageIntro
        title="HMT Clan Beitreten"
        description="So wirst du Teil des HMT Clans – in drei einfachen Schritten."
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-base leading-relaxed text-muted">
            Wir sind eine kleine, entspannte Community rund um Minecraft. Wer
            Lust hat, gemeinsam zu bauen, Events zu bestreiten und einfach eine
            gute Zeit zu haben, ist bei uns herzlich willkommen. Vorkenntnisse
            brauchst du keine – Hauptsache, du hast Spaß am Spiel.
          </p>

          <div className="mt-6 space-y-6">
            <section>
              <h2 className="mb-3 font-pixel text-lg text-foreground md:text-xl">
                Info
              </h2>
              <p className="text-base leading-relaxed text-muted">
                Wir spielen über das Jahr hinweg auf mehreren Servern. Am
                häufigsten sind wir jedoch auf dem TheScape-Server unterwegs,
                einem Community-CraftAttack-Server, auf dem wir bereits seit
                einigen Jahren gemeinsam spielen. Um dort mitspielen zu
                können, musst du dich für den TheScape-Server bewerben. Das
                ist aber kein Problem, das sind nur vier Fragen mit kurzen
                Antworten. Danach kannst du direkt auf dem Server loslegen und
                uns im Spiel treffen.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-pixel text-lg text-foreground md:text-xl">
                1. Tritt unserem Discord bei
              </h2>
              <p className="text-base leading-relaxed text-muted">
                Der Discord-Server ist unser Zuhause. Hier organisieren wir
                Events, koordinieren uns im Spiel und quatschen einfach
                miteinander.
              </p>
              <br />
              <MinecraftButton
                href={discordInvite}
                external
                variant="primary"
                size="sm"
              >
                Discord beitreten
              </MinecraftButton>
            </section>

            <section>
              <h2 className="mb-3 font-pixel text-lg text-foreground md:text-xl">
                2. Schreibe @henrymmey eine DM
              </h2>
              <p className="text-base leading-relaxed text-muted">
                Schreibe mir (Gründer Henry) eine kurze DM auf Discord. Und
                schreibe warum du bei uns mitspielen möchtest, wie du heißt
                (echter Name und Minecraft-Username) und wie alt du bist.
              </p>
              <p>Ich versuche so schnell wie möglich zu antworten.</p>
              <br />
              <MinecraftButton
                href="https://discord.com/users/1008346032230387752"
                external
                variant="primary"
                size="sm"
              >
                Henry auf Discord anschreiben
              </MinecraftButton>
            </section>
            <section>
              <h2 className="mb-3 font-pixel text-lg text-foreground md:text-xl">
                3. Schreibe die Bewerbung auf TheScape
              </h2>
              <p className="text-base leading-relaxed text-muted">
                Während du auf meine Antwort wartest, kannst du gleich die
                Bewerbung auf TheScape.de ausfüllen.
              </p>
              <br />
              <MinecraftButton
                href="https://thescape.de/bewerben"
                external
                variant="primary"
                size="sm"
              >
                TheScape Bewerbung
              </MinecraftButton>
            </section>
            <p className="mt-3 text-xs text-muted/70">
              NICHT MIT THESCAPE VERBUNDEN.
              <br />
              Wir sind eine unabhängige Gruppe, die auf dem TheScape-Server
              spielt. Wir haben keine Verbindung zu den Betreibern von TheScape.
            </p>
            <p className="mt-3 text-xs text-muted/70"></p>
          </div>
        </div>
      </div>

      <JsonLd data={howToJoinSchema()} />

      <SiteFooter />
    </main>
  );
}
