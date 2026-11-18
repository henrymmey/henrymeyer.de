import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const app = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, app), "utf8");

test("homepage and sampled pages retain their existing concise visible copy", async () => {
  const [home, contact, links] = await Promise.all([
    read("src/app/page.tsx"),
    read("src/app/contact/page.tsx"),
    read("src/app/links/page.tsx"),
  ]);
  assert.match(home, /Hi, I&apos;m <span className="text-foreground">Henry<\/span>/);
  assert.doesNotMatch(home, /I build software and hardware projects from Germany/);
  assert.doesNotMatch(home, /My current work includes Akku-Craft/);
  assert.match(contact, /<h1 className="text-3xl font-heading md:text-4xl">Contact<\/h1>/);
  assert.doesNotMatch(contact, /Get in touch about software development/);
  assert.doesNotMatch(contact, /Email is the best option for detailed proposals/);
  assert.doesNotMatch(links, /This page collects my official profiles/);
});

test("agent discovery files follow llms.txt conventions and provide task guidance", async () => {
  const [llms, instructions] = await Promise.all([
    read("public/llms.txt"),
    read("public/agent-instructions.md"),
  ]);
  assert.match(llms, /^# Henry Meyer\n/m);
  assert.match(llms, /^## When to use this\n/m);
  assert.match(llms, /https:\/\/henrymeyer\.de\/sitemap\.xml/);
  assert.match(instructions, /^## When to use this site\n/m);
  assert.match(instructions, /not an API/);
  assert.match(instructions, /Do not send messages/);
});

test("static Markdown representations include usable homepage and 404 content", async () => {
  const [home, notFound] = await Promise.all([
    read("public/agent/home.md"),
    read("public/agent/404.md"),
  ]);
  assert.ok(home.length >= 500);
  assert.match(home, /^# Henry Meyer/m);
  assert.match(home, /Akku-Craft/);
  assert.ok(notFound.length >= 20);
  assert.match(notFound, /sitemap\.xml/);
  assert.match(notFound, /llms\.txt/);
});

test("Vercel routes negotiate homepage Markdown and retain a Markdown 404", async () => {
  const config = JSON.parse(await read("vercel.json"));
  const routes = config.routes;
  const aboutRedirect = routes.find((route) => route.src === "^/about/?$");
  const homeMarkdown = routes.find((route) => route.dest === "/agent/home.md");
  const filesystem = routes.findIndex((route) => route.handle === "filesystem");
  const markdown404 = routes.find((route) => route.dest === "/agent/404.md");
  const htmlHomeHeaders = routes.find((route) => route.src === "^/$" && route.continue);
  assert.deepEqual(homeMarkdown.has, [
    { type: "header", key: "accept", value: "text/markdown" },
  ]);
  assert.equal(homeMarkdown.headers["Content-Type"], "text/markdown; charset=utf-8");
  assert.equal(homeMarkdown.headers.Vary, "Accept");
  assert.equal(aboutRedirect.headers.Location, "/");
  assert.equal(aboutRedirect.status, 308);
  assert.equal(htmlHomeHeaders.headers.Vary, "Accept");
  assert.ok(filesystem > routes.indexOf(homeMarkdown));
  assert.ok(routes.indexOf(markdown404) > filesystem);
  assert.equal(markdown404.status, 404);
  assert.equal(markdown404.headers.Vary, "Accept");
  assert.ok(routes.findIndex((route) => route.dest === "/404.html") > routes.indexOf(markdown404));
  assert.match(routes[0].headers["Onion-Location"], /\.onion/);
  assert.ok(routes.some((route) => route.status === 308 && route.headers?.Location === "/links/"));
  assert.ok(routes.some((route) => route.status === 307 && route.headers?.Location === "https://github.com/henrymmey"));
});

test("homepage metadata identifies Henry's actual project areas", async () => {
  const layout = await read("src/app/layout.tsx");
  assert.match(layout, /Software Development & Hardware Projects/);
  assert.match(layout, /Henry Meyer personal portfolio/);
  assert.match(layout, /software developer portfolio/);
  assert.match(layout, /"Minecraft modding"/);
  assert.match(layout, /"Hardware engineering"/);
});

test("sitemap and robots metadata keep the public machine-readable routes discoverable", async () => {
  const [sitemap, robots] = await Promise.all([
    read("src/app/sitemap.ts"),
    read("src/app/robots.ts"),
  ]);
  for (const route of ["/projects/", "/contact/", "/links/", "/legal/privacy/"]) {
    assert.ok(sitemap.includes(`"${route}"`), `sitemap should include ${route}`);
  }
  assert.doesNotMatch(sitemap, /\/about\//);
  assert.match(robots, /sitemap\.xml/);
  assert.match(robots, /allow: "\/"/);
});
