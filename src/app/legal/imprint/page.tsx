import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Kontaktinformationen von Henry Meyer.",
  alternates: { canonical: "/legal/imprint/" },
};

const domains = [
  "henrymeyer.de",
  "*.henrymeyer.de (alle zugehörigen Subdomains)",
  "hmlabs.eu",
  "*.hmlabs.eu (alle zugehörigen Subdomains)",
  "titansmp.de",
  "*.titansmp.de (alle zugehörigen Subdomains)",
  "meyerwolke.de",
  "*.meyerwolke.de (alle zugehörigen Subdomains)",
  "hmtclan.de",
  "*.hmtclan.de (alle zugehörigen Subdomains)",
];

const githubProfiles = [
  ["henrymmey", "https://github.com/henrymmey"],
  ["henrymmeytwo", "https://github.com/henrymmeytwo"],
  ["henrymmeybot", "https://github.com/henrymmeybot"],
  ["TitanSMP", "https://github.com/TitanSMP"],
  ["HMLabs-HQ", "https://github.com/HMLabs-HQ"],
  ["HMLabs-Gaming", "https://github.com/HMLabs-Gaming"],
];

const otherProfiles = [
  ["Codeberg: henrymmey", "https://codeberg.org/henrymmey"],
  ["Modrinth: HenryMMey", "https://modrinth.com/user/Fg5L4UzB"],
  ["Modrinth: HMLabs Gaming", "https://modrinth.com/organization/9zYhowm8"],
  [
    "CurseForge: henrymmey",
    "https://www.curseforge.com/members/henrymmey/projects",
  ],
  ["Hangar: henrymmey", "https://hangar.papermc.io/henrymmey"],
  ["Hangar: HMLabs-Gaming", "https://hangar.papermc.io/HMLabs-Gaming"],
];

const sectionClass =
  "space-y-3 border-b border-border/30 pb-6 last:border-0 last:pb-0 [&_h2]:text-xl [&_h2]:font-heading [&_h3]:text-lg [&_h3]:font-heading [&_a]:underline [&_a]:underline-offset-2";

export default function ImprintPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="text-3xl font-heading md:text-4xl">Impressum</h1>
      </section>
      <article className="mb-8 rounded-base border border-border/30 bg-secondary-background p-4 shadow-sm md:p-6">
        <div className="space-y-6 rounded-base border border-border/30 bg-background p-5 text-sm leading-relaxed md:p-8 md:text-base">
          <section className={sectionClass}>
            <h2>Angaben gemäß § 18 Abs. 1 Medienstaatsvertrag (MStV)</h2>
            <p>
              <strong>Henry Max Meyer</strong>
              <br />
              c/o Autorenglück #60676
              <br />
              Albert-Einstein-Str. 47
              <br />
              02977 Hoyerswerda
              <br />
              Deutschland
            </p>
            <p>
              <strong>Kontakt:</strong>
              <br />
              E-Mail:{" "}
              <a href="mailto:hello@henrymeyer.de">hello@henrymeyer.de</a>
            </p>
          </section>

          <section className={sectionClass}>
            <h2>Haftung für Inhalte</h2>
            <p>
              Als Anbieter der jeweiligen Online-Angebote bin ich für eigene
              Inhalte nach den allgemeinen gesetzlichen Vorschriften
              verantwortlich.
            </p>
            <p>
              Ich bin jedoch nicht verpflichtet, übermittelte oder gespeicherte
              fremde Informationen allgemein zu überwachen oder aktiv nach
              Umständen zu suchen, die auf eine rechtswidrige Tätigkeit
              hinweisen.
            </p>
            <p>
              Gesetzliche Verpflichtungen zur Entfernung oder Sperrung von
              Informationen bleiben hiervon unberührt.
            </p>
            <p>
              Sollten mir konkrete Rechtsverletzungen bekannt werden, werde ich
              die betreffenden Inhalte im Rahmen der gesetzlichen Vorgaben
              prüfen und gegebenenfalls unverzüglich entfernen.
            </p>
          </section>

          <section className={sectionClass}>
            <h2>Haftung für Links</h2>
            <p>
              Die jeweiligen Online-Angebote können Links zu externen Websites
              Dritter enthalten, auf deren Inhalte ich keinen unmittelbaren
              Einfluss habe.
            </p>
            <p>
              Für die Inhalte externer Websites sind grundsätzlich deren
              jeweilige Betreiber verantwortlich.
            </p>
            <p>
              Sollten mir Rechtsverletzungen auf verlinkten Websites bekannt
              werden, werde ich die betreffenden Links prüfen und gegebenenfalls
              unverzüglich entfernen.
            </p>
          </section>

          <section className={sectionClass}>
            <h2>Gültigkeit und Geltungsbereich</h2>
            <p>
              Dieses Impressum gilt für sämtliche nachfolgend aufgeführten
              Online-Angebote, die von Henry Max Meyer eigenständig betrieben
              oder verwaltet werden und bei denen Henry Max Meyer als Anbieter
              auftritt.
            </p>
            <p>
              Dies umfasst insbesondere die nachfolgend genannten Websites,
              Domains, Subdomains sowie Social-Media- und Entwicklerprofile,
              soweit diese von Henry Max Meyer betrieben werden.
            </p>
            <p>
              Das Impressum gilt ebenfalls für die jeweils zugehörigen
              Subdomains der aufgeführten Domains, sofern diese von Henry Max
              Meyer betrieben oder verwaltet werden.
            </p>
            <div className="grid gap-6 pt-2 md:grid-cols-2">
              <div className="space-y-3">
                <h3>Webseiten (Domains)</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {domains.map((domain) => (
                    <li key={domain}>{domain}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-5">
                <div className="space-y-3">
                  <h3>Zugehörige Social-Media- und Entwicklerprofile</h3>
                  <h4 className="font-heading">GitHub</h4>
                  <ul className="list-disc space-y-1 pl-5">
                    {githubProfiles.map(([label, href]) => (
                      <li key={href}>
                        <a href={href}>{label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-heading">
                    Weitere Entwicklerplattformen
                  </h4>
                  <ul className="list-disc space-y-1 pl-5">
                    {otherProfiles.map(([label, href]) => (
                      <li key={href}>
                        <a href={href}>{label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
