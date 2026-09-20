import SiteFooterContent from "@/components/site-footer-content";

export default function SiteFooter() {
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA;
  return <SiteFooterContent commitSha={commitSha} />;
}