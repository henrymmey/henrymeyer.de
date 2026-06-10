import SiteFooter from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tor Network",
  description: "My Website on the Tor Network.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TorNetworkPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 pb-0 md:px-8 md:pb-0">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="mb-2 text-3xl font-heading md:text-4xl">Tor Network</h1>
        <p className="max-w-3xl text-sm leading-relaxed md:text-base">
          Access this website through Tor
        </p>
      </section>
      <section className="mb-6 rounded-base border border-border/30 bg-background p-5 shadow-sm">
        <p className="text-sm leading-relaxed md:text-base">
          You can access this website through Tor using Tor Browser. Tor
          prevents someone watching your connection from knowing that you're
          visiting this website.{" "}
        </p>
        <p className="text-sm leading-relaxed md:text-base">
          Simply copy and paste this Onion address into a Tor Browser:
          <br />
          <b>
            <code>
              2bhhtuncptca3p3spmvs3ctgz4s533fomrhotw32lavqko4emr7ruoid.onion
            </code>
          </b>
        </p>
      </section>
      <section className="mb-6 rounded-base border border-border/30 bg-background p-5 shadow-sm">
        <h1 className="mb-2 text-1xl font-heading md:text-2xl">
          Why does this exist?
        </h1>
        <p className="text-sm leading-relaxed md:text-base">
          <br />
          Let's be real: Routing a public portfolio website through the onion
          routing protocol is technically overkill and doesn't offer you any
          practical advantages over standard HTTPS. I built this pipeline anyway
          as a personal challenge to explore the Tor protocol, configure a
          low-overhead Nginx reverse proxy on my VPS, and mess around with
          advanced HTTP headers like{" "}
          <b>
            <code>Onion-Location</code>
          </b>
          . Think of it less as a security requirement and more as a fun
          networking experiment!
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
