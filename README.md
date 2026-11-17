# henrymeyer.de

Standalone, statically exported Next.js application for `henrymeyer.de`.

## Local development

From the monorepo root, run `pnpm dev:henrymeyer-de`. Build the static site with `pnpm build:henrymeyer-de`; Next.js writes the deployable files to `out/`.

## Vercel

Set this app as the Vercel project's Root Directory (`apps/henrymeyer-de`). The project uses the repository's pnpm workspace lockfile. Build command: `pnpm build`; output directory: `out` (or allow Vercel to detect Next.js static export). No runtime functions are required for the site pages.

GitHub profile statistics are fetched during the build and included in the static output. The contribution streak, Hackatime statistics, and skill icons are requested directly by the browser from their image providers. The deployed site does not make server-side runtime API calls.
