import SiteFooter from "@/components/site-footer";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";

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

function getContactEmails() {
  return [
    process.env.CONTACT_EMAIL_1,
    process.env.CONTACT_EMAIL_2,
    process.env.CONTACT_EMAIL_3,
  ].filter((email): email is string => Boolean(email));
}

export default async function ContactPage() {
  const cookieStore = await cookies();
  const isUnlocked = cookieStore.get("contact_unlocked")?.value === "1";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const discordUsername = "jumpstone4477";

  const email1 = process.env.CONTACT_EMAIL_1;
  const additionalEmails = [
    process.env.CONTACT_EMAIL_2,
    process.env.CONTACT_EMAIL_3,
  ].filter((email): email is string => Boolean(email));

  const unlockedEmails = isUnlocked ? additionalEmails : [];

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      />

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
              {email1 && (
                <li>
                  <a
                    href={`mailto:${email1}`}
                    className="underline underline-offset-2"
                  >
                    {email1}
                  </a>
                </li>
              )}
              {isUnlocked &&
                unlockedEmails.map((email) => (
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

            {!isUnlocked && (
              <div className="mt-6 border-t border-border/30 pt-6">
                <h3 className="mb-3 text-lg font-heading">
                  Unlock Additional Emails
                </h3>
                <p className="mb-4 text-sm leading-relaxed md:text-base">
                  Complete the Turnstile challenge to view the other email
                  addresses.
                </p>

                {!siteKey ? (
                  <p className="text-sm leading-relaxed text-red-700 md:text-base">
                    Missing NEXT_PUBLIC_TURNSTILE_SITE_KEY in env.
                  </p>
                ) : (
                  <form
                    action="/contact/verify"
                    method="post"
                    className="space-y-4"
                  >
                    <div
                      className="cf-turnstile"
                      data-sitekey={siteKey}
                      data-theme="auto"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-base border border-border/30 bg-main px-4 py-2 text-sm font-heading text-main-foreground shadow-sm transition-opacity hover:opacity-80"
                    >
                      Verify and Show Emails
                    </button>
                  </form>
                )}
              </div>
            )}
          </section>
        </article>

        <SiteFooter />
      </main>
    </>
  );
}
