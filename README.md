# henrymeyer.de

Standalone, statically exported Next.js application for `henrymeyer.de`.

## Local development

Install dependencies with `npm install`. Start the local development server with `npm run dev`. Build the static site with `npm run build`; Next.js writes the deployable files to `out/`.

Additional commands:

- `npm run start` serves a production Next.js build locally.
- `npm run lint` runs the TypeScript type check.
- `npm test` runs the repository's Node.js tests.

## Vercel

Set this repository as the Vercel project's Root Directory. The project uses `package-lock.json` and npm. Build command: `npm run build`; output directory: `out` (or allow Vercel to detect Next.js static export). No runtime functions are required for the site pages.

GitHub profile statistics are fetched during the build and included in the static output. The contribution streak, Hackatime statistics, and skill icons are requested directly by the browser from their image providers. The deployed site does not make server-side runtime API calls.

The Vercel project configuration serves the static homepage as Markdown when a request prefers `text/markdown`, while browsers continue to receive HTML. It also serves a Markdown body for Markdown requests to missing routes while preserving HTTP 404. Keep the Vercel routing rules in `vercel.json` when changing the deployment setup. Agent discovery guidance is published at `/llms.txt` and `/agent-instructions.md`.
