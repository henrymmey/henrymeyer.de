import SiteFooter from "@/components/site-footer";
export default function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 md:px-8">
      <div className="flex flex-1 flex-col justify-center gap-8 py-12 md:py-16">
        <section className="rounded-base border border-border/30 bg-main p-6 text-main-foreground shadow-sm md:p-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-base border border-main-foreground/40 bg-main-foreground/10 px-3 py-1 text-xs font-heading">
            <span className="font-mono text-[11px]">404</span>Page not found
          </p>
          <h1 className="mb-3 text-3xl font-heading leading-tight sm:text-4xl">
            The page you are looking for does not exist.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed">
            It may have been moved or the URL might be incorrect. Use one of the
            quick links below to continue exploring.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-base border border-border/30 bg-secondary-background px-3 py-1.5 text-sm"
            >
              Back to home
            </a>
            <a
              href="/contact/"
              className="rounded-base border border-border/30 bg-background px-3 py-1.5 text-sm"
            >
              Contact me
            </a>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
