import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zum Datenschutz auf henrymeyer.de.",
  alternates: { canonical: "/legal/privacy/" },
};

const sectionClass =
  "space-y-3 [&_h2]:pt-5 [&_h2]:text-xl [&_h2]:font-heading first:[&_h2]:pt-0 [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5";

export default function PrivacyPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="text-3xl font-heading md:text-4xl">
          Datenschutzerklärung
        </h1>
      </section>
      <article className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm md:p-8">
        <div className="rounded-base border border-border/30 bg-background p-5 text-sm leading-relaxed md:p-8 md:text-base">
          <section className={sectionClass}>
            <h2>1. Datenschutz im Überblick</h2>
            <p>
              Diese Datenschutzerklärung informiert darüber, welche
              personenbezogenen Daten verarbeitet werden, wenn Sie
              henrymeyer.de besuchen. Personenbezogene Daten sind alle Daten,
              mit denen Sie persönlich identifiziert werden können. Die
              Verarbeitung erfolgt nach den geltenden Datenschutzvorschriften,
              insbesondere der Datenschutz-Grundverordnung (DSGVO) und dem
              Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG).
            </p>

            <h2>2. Verantwortlicher</h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist
              Henry Max Meyer. Die vollständigen Kontaktdaten und die
              Anschrift finden Sie im{" "}
              <a href="/legal/imprint/">Impressum</a>. Sie erreichen mich
              außerdem unter <a href="mailto:hello@henrymeyer.de">hello@henrymeyer.de</a>.
            </p>

            <h2>3. Hosting und Infrastruktur</h2>
            <h3 className="text-lg font-heading">Vercel</h3>
            <p>
              Diese Website wird über Vercel Inc., 340 Brannan Street, Suite
              100, San Francisco, CA 94107, USA, gehostet. Die Website wird als
              statische Website bereitgestellt. Beim Aufruf verarbeitet die
              Hosting-Infrastruktur technisch erforderliche Verbindungsdaten.
              Dazu können insbesondere IP-Adresse, Datum und Uhrzeit,
              angeforderte Seiten und Ressourcen, Browser- und
              Betriebssysteminformationen, Referrer-URL, übertragene Datenmenge
              und HTTP-Statuscode gehören. Die Verarbeitung dient der
              Auslieferung der Website sowie der technischen Sicherheit und
              Fehleranalyse. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an einem sicheren und zuverlässigen
              Betrieb).
            </p>
            <p>
              Vercel kann Daten auch außerhalb der Europäischen Union
              verarbeiten. Informationen zu den Datenschutzpraktiken und
              Übermittlungsmechanismen finden Sie in der{" "}
              <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">
                Datenschutzerklärung von Vercel
              </a>
              .
            </p>

            <h3 className="text-lg font-heading">Cloudflare</h3>
            <p>
              Cloudflare Inc. wird für die Verwaltung von DNS-Einträgen
              eingesetzt. Ob eine konkrete Anfrage zusätzlich über das
              Cloudflare-Netzwerk geleitet wird, hängt von der jeweiligen
              Proxy-Einstellung des DNS-Eintrags ab. Bei DNS-only-Einträgen
              übernimmt Cloudflare die DNS-Auflösung; der Webverkehr läuft
              nicht über das Cloudflare-Netzwerk. Bei aktivierter Proxy-Funktion
              können insbesondere IP-Adressen, Verbindungsdaten, HTTP-Header und
              technische Sicherheitsinformationen verarbeitet werden. Dies
              dient der DNS-Bereitstellung sowie der Sicherheit und
              Verfügbarkeit der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit.
              f DSGVO. Weitere Informationen finden Sie in der{" "}
              <a href="https://www.cloudflare.com/de-de/privacypolicy/" target="_blank" rel="noreferrer">
                Datenschutzrichtlinie von Cloudflare
              </a>
              .
            </p>

            <h2>4. Cookies und lokale Speicherung</h2>
            <p>
              Diese Website setzt keine Cookies für die Speicherung Ihrer
              Darstellungseinstellungen ein. Wenn Sie den Hell-/Dunkelmodus
              auswählen, wird Ihre Auswahl lokal im Browserspeicher
              (<code>localStorage</code>) unter dem Schlüssel{" "}
              <code>theme-mode</code> abgelegt. Mögliche Werte sind{" "}
              <code>light</code>, <code>dark</code> und <code>auto</code>. Die
              Auswahl wird nicht an mich übertragen. Bei <code>auto</code>{" "}
              richtet sich die Darstellung nach der Systemeinstellung Ihres
              Browsers. Die Speicherung erfolgt, um die von Ihnen gewünschte
              Darstellungseinstellung bereitzustellen. Rechtsgrundlage für den
              Zugriff auf den lokalen Speicher ist § 25 Abs. 2 Nr. 2 TDDDG;
              soweit dabei personenbezogene Daten verarbeitet werden, Art. 6
              Abs. 1 lit. f DSGVO.
            </p>

            <h2>5. Externe Inhalte auf der Startseite</h2>
            <p>
              Die GitHub-Kennzahlen (öffentliche Repositories, Follower und
              Commits) werden während des Website-Builds einmalig über die
              GitHub-API abgerufen und anschließend in die statischen Dateien
              dieser Website übernommen. Beim Besuch der Website stellt Ihr
              Browser für diese Kennzahlen keine direkte Verbindung zu GitHub
              her. Beim Abruf während des Builds kann GitHub die IP-Adresse und
              technische Verbindungsdaten der Build-Infrastruktur erhalten.
              Die Abfragen dienen der Darstellung meines GitHub-Profils und
              meiner Entwicklungsaktivität; Rechtsgrundlage ist Art. 6 Abs. 1
              lit. f DSGVO. Weitere Informationen finden Sie in den{" "}
              <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer">
                GitHub-API-Dokumentation
              </a>{" "}
              und der{" "}
              <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">
                Datenschutzerklärung von Vercel
              </a>
              . Die eingebundenen Werte werden bei einem zukünftigen Build
              aktualisiert.
            </p>
            <p>
              Die Hackatime-Statistikgrafik von{" "}
              <code>github-readme-stats.hackclub.dev</code>, die
              GitHub-Streak-Grafik von{" "}
              <code>github-readme-stats-fast.vercel.app</code> und die
              Entwickler-Icons von <code>skillicons.dev</code> werden beim Laden
              der jeweiligen Startseitenabschnitte direkt vom Browser bei den
              Anbietern angefragt; die Bilder sind mit verzögertem Laden
              eingebunden.
            </p>
            <p>
              Bei diesen Anfragen erhalten die jeweiligen Anbieter mindestens
              die IP-Adresse und technische Verbindungsdaten des Browsers. Bei
              den Statistikgrafiken werden außerdem die in den Bildadressen
              enthaltenen Benutzernamen beziehungsweise Kennungen übermittelt,
              damit die Grafiken erstellt werden können. Auf Umfang,
              Speicherdauer und weitere Verarbeitung durch diese Anbieter habe
              ich keinen unmittelbaren Einfluss.
              Rechtsgrundlage für die Einbindung ist Art. 6 Abs. 1 lit. f DSGVO
              (Interesse an der Darstellung von Entwicklungsinformationen).
              Weitere Informationen: die{" "}
              <a href="https://hackatime.hackclub.com/docs/configuration/privacy" target="_blank" rel="noreferrer">
                Datenschutzhinweise von Hackatime
              </a>, die{" "}
              <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noreferrer">
                Datenschutzhinweise von Vercel
              </a>{" "}
              sowie die Website von{" "}
              <a href="https://skillicons.dev" target="_blank" rel="noreferrer">
                skillicons.dev
              </a>
              .
            </p>
            <p>
              Die Website verwendet keine Vercel Analytics oder Speed Insights,
              keine Google Fonts und keine GitHub-API-Abfragen beim Besuch
              dieser Website. Die lokal gespeicherten Projektbeschreibungen und
              Badge-Icons werden von dieser Website selbst ausgeliefert.
            </p>

            <h2>6. Externe Links und Kontakt</h2>
            <p>
              Diese Website enthält Links zu externen Websites und Plattformen,
              beispielsweise GitHub, Codeberg, Discord, Modrinth und CurseForge.
              Beim bloßen Anzeigen der Links werden keine Daten an diese
              Plattformen übermittelt. Wenn Sie einen Link öffnen, wird eine
              Verbindung zum jeweiligen Anbieter hergestellt; ab dann gelten
              dessen Datenschutzbestimmungen. Beim Anklicken der E-Mail-Adresse
              öffnet sich Ihr E-Mail-Programm. Die dabei übermittelten Daten
              werden von den beteiligten E-Mail-Diensten verarbeitet.
            </p>

            <h2>7. Speicherdauer</h2>
            <p>
              Personenbezogene Daten werden nur so lange gespeichert, wie es
              für den jeweiligen Zweck erforderlich ist oder gesetzliche
              Aufbewahrungspflichten bestehen. Danach werden sie nach den
              gesetzlichen Vorgaben gelöscht. Die konkrete Speicherdauer
              technischer Verbindungsdaten richtet sich auch nach den
              Einstellungen und Richtlinien der eingesetzten Anbieter.
            </p>

            <h2>8. Ihre Rechte</h2>
            <p>
              Sie haben im Rahmen der gesetzlichen Voraussetzungen das Recht
              auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO),
              Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18
              DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch
              gegen Verarbeitungen (Art. 21 DSGVO). Eine erteilte Einwilligung
              können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art.
              7 Abs. 3 DSGVO). Sie haben außerdem das Recht, sich bei einer
              Datenschutzaufsichtsbehörde zu beschweren (Art. 77 DSGVO). Zur
              Ausübung Ihrer Rechte können Sie sich an die im Impressum
              angegebene E-Mail-Adresse wenden.
            </p>

            <h2>9. Geltungsbereich</h2>
            <p>
              Diese Datenschutzerklärung gilt für henrymeyer.de einschließlich
              der zugehörigen Seiten und Unterseiten. Andere Websites,
              Subdomains und Online-Angebote können eigene Dienste und
              Datenschutzinformationen haben.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
