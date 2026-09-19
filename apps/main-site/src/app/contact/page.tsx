import SiteFooter from "@/components/site-footer";
import type { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with JumpStone. Contact information for software projects and collaborations, with privacy protection.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact JumpStone",
    description:
      "Get in touch for software projects, collaborations, and inquiries.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_URL || "https://henrymeyer.de"}/contact`,
  },
};

export default async function ContactPage() {
  const discordUsername = "henrymmey";
  const emails = [
    process.env.CONTACT_EMAIL_1,
    process.env.CONTACT_EMAIL_2,
    process.env.CONTACT_EMAIL_3,
  ].filter((email): email is string => Boolean(email));

  return (
    <>
      <main className="relative mx-auto w-full max-w-6xl px-4 pb-0 md:px-8 md:pb-0">
        <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
          <h1 className="mb-2 text-3xl font-heading md:text-4xl">Contact</h1>
        </section>

        <section className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm md:p-8">
          <div className="rounded-base border border-border/30 bg-background p-5 shadow-sm">
            <h2 className="mb-3 text-xl font-heading">Discord</h2>
            <p className="text-sm leading-relaxed md:text-base">
              <span className="font-heading">@{discordUsername}</span>
            </p>
          </div>
        </section>

        <article className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm md:p-8">
          <section className="rounded-base border border-border/30 bg-background p-5 shadow-sm">
            <h2 className="mb-3 text-xl font-heading">Email Addresses</h2>

            <ul className="mb-4 space-y-2 text-sm md:text-base">
              {emails.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="underline underline-offset-2"
                  >
                    {email}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <SiteFooter />
      </main>
    </>
  );
}
