import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Henry Meyer about software projects and collaborations.",
  alternates: { canonical: "/contact/" },
};
export default function ContactPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
      <section className="mb-8 rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
        <h1 className="text-3xl font-heading md:text-4xl">Contact</h1>
      </section>
      <section className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm md:p-8">
        <div className="rounded-base border border-border/30 bg-background p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-heading">Discord</h2>
          <p className="text-sm leading-relaxed md:text-base">
            <a
              className="underline"
              href="https://discord.com/users/1008346032230387752"
            >
              @henrymmey
            </a>
          </p>
        </div>
      </section>
      <article className="mb-8 rounded-base border border-border/30 bg-secondary-background p-6 shadow-sm md:p-8">
        <section className="rounded-base border border-border/30 bg-background p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-heading">Email Address</h2>
          <a
            href="mailto:hello@henrymeyer.de"
            className="text-sm underline underline-offset-2 md:text-base"
          >
            hello@henrymeyer.de
          </a>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
