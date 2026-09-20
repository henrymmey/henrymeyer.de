import { readFile } from "fs/promises";
import { join } from "path";
import {
  PACK_PAGES,
  type PackBlock,
  type PackPage,
  type PackTab,
} from "@/lib/modpack-pages";

export type { PackBlock, PackTab, PackPage };

export { PACK_PAGES };

const PACK_DIR = join(
  process.cwd(),
  "../gaming-site/src/content/docs/projects/modpacks/hmt-pack",
);

function parseFrontmatter(raw: string): {
  title?: string;
  description?: string;
  body: string;
} {
  const match = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/.exec(raw);
  if (!match) return { body: raw };

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([^:]+):\s*(.*)$/);
    if (kv) {
      data[kv[1].trim()] = kv[2].trim().replace(/^["']|["']$/g, "");
    }
  }

  return {
    title: data.title,
    description: data.description,
    body: raw.slice(match[0].length),
  };
}

function stripStrays(raw: string): string {
  let content = raw;

  const multilineImport =
    /import\s*\{[\s\S]*?\}\s*from\s*"[^"]*"\s*;\s*/g;
  content = content.replace(multilineImport, "");
  content = content.replace(/^import .*$/gm, "");

  content = content.replace(/^\s*<script[^>]*><\/script>\s*$/gm, "");
  content = content.replace(/^\s*<script[^>]*\/>\s*$/gm, "");

  content = content.replace(
    "../../../../../assets/projects/modpacks/hmt-pack/hmt-clan-wordmark.png",
    "/pack/hmt-clan-wordmark.png",
  );

  content = content.replaceAll("/projects/modpacks/hmt-pack/", "/pack/");

  return content;
}

type Token =
  | { kind: "text"; value: string }
  | {
      kind: "open";
      name: "tabs" | "tabitem" | "aside" | "cardgrid";
      label?: string;
      variant?: "caution" | "info";
    }
  | { kind: "close"; name: string }
  | { kind: "linkcard"; title: string; href: string };

type Frame = {
  type: "root" | "tabs" | "tabitem" | "aside" | "cardgrid";
  label?: string;
  variant?: "caution" | "info";
  blocks: PackBlock[];
  tabList: PackTab[];
  buffer: string[];
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const re =
    /(<Tabs>|<\/Tabs>|<TabItem\s+label="([^"]*)"\s*>|<\/TabItem>|<Aside(?:\s+type="([a-z]+)")?\s*>|<\/Aside>|<CardGrid>|<\/CardGrid>|<LinkCard\s+title="([^"]*)"\s+href="([^"]*)"\s*\/>)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(input)) !== null) {
    if (match.index > last) {
      tokens.push({ kind: "text", value: input.slice(last, match.index) });
    }
    const tag = match[0];
    if (tag === "<Tabs>") tokens.push({ kind: "open", name: "tabs" });
    else if (tag === "</Tabs>") tokens.push({ kind: "close", name: "tabs" });
    else if (tag.startsWith("<TabItem"))
      tokens.push({ kind: "open", name: "tabitem", label: match[2] });
    else if (tag === "</TabItem>")
      tokens.push({ kind: "close", name: "tabitem" });
    else if (tag.startsWith("<Aside"))
      tokens.push({
        kind: "open",
        name: "aside",
        variant: match[3] === "caution" ? "caution" : "info",
      });
    else if (tag === "</Aside>") tokens.push({ kind: "close", name: "aside" });
    else if (tag === "<CardGrid>")
      tokens.push({ kind: "open", name: "cardgrid" });
    else if (tag === "</CardGrid>")
      tokens.push({ kind: "close", name: "cardgrid" });
    else
      tokens.push({
        kind: "linkcard",
        title: match[4] as string,
        href: match[5] || "",
      });
    last = re.lastIndex;
  }
  if (last < input.length) tokens.push({ kind: "text", value: input.slice(last) });
  return tokens;
}

function flushText(frame: Frame) {
  const text = frame.buffer.join("").trim();
  frame.buffer = [];
  if (text && frame.type !== "tabs") {
    frame.blocks.push({ kind: "markdown", md: text });
  }
}

export function parseBlocks(input: string): PackBlock[] {
  const root: Frame = { type: "root", blocks: [], tabList: [], buffer: [] };
  const stack: Frame[] = [root];

  for (const token of tokenize(input)) {
    const top = stack[stack.length - 1];

    if (token.kind === "text") {
      top.buffer.push(token.value);
      continue;
    }

    if (token.kind === "linkcard") {
      flushText(top);
      top.blocks.push({
        kind: "linkcard",
        title: token.title,
        href: token.href,
      });
      continue;
    }

    if (token.kind === "open") {
      flushText(top);
      if (token.name === "tabs") {
        stack.push({ type: "tabs", blocks: [], tabList: [], buffer: [] });
      } else if (token.name === "tabitem") {
        stack.push({
          type: "tabitem",
          label: token.label,
          blocks: [],
          tabList: [],
          buffer: [],
        });
      } else if (token.name === "aside") {
        stack.push({
          type: "aside",
          variant: token.variant,
          blocks: [],
          tabList: [],
          buffer: [],
        });
      } else {
        stack.push({ type: "cardgrid", blocks: [], tabList: [], buffer: [] });
      }
      continue;
    }

    flushText(top);
    const matches =
      (token.name === "tabs" && top.type === "tabs") ||
      (token.name === "tabitem" && top.type === "tabitem") ||
      (token.name === "aside" && top.type === "aside") ||
      (token.name === "cardgrid" && top.type === "cardgrid");
    if (!matches) continue;
    stack.pop();
    const parent = stack[stack.length - 1];

    if (top.type === "tabs") {
      parent.blocks.push({ kind: "tabs", tabs: top.tabList });
    } else if (top.type === "tabitem") {
      if (parent.type === "tabs") {
        parent.tabList.push({ label: top.label as string, blocks: top.blocks });
      } else {
        parent.blocks.push({
          kind: "tabs",
          tabs: [{ label: top.label as string, blocks: top.blocks }],
        });
      }
    } else if (top.type === "aside") {
      parent.blocks.push({
        kind: "aside",
        variant: top.variant || "info",
        blocks: top.blocks,
      });
    } else {
      parent.blocks.push(...top.blocks);
    }
  }

  flushText(root);

  return root.blocks;
}

export async function getPackPage(slug: string): Promise<{
  title?: string;
  description?: string;
  blocks: PackBlock[];
}> {
  const page = PACK_PAGES.find((p) => p.slug === slug);
  if (!page) {
    throw new Error(`Unknown pack page: ${JSON.stringify(slug)}`);
  }

  const raw = await readFile(join(PACK_DIR, page.file), "utf-8");
  const { title, description, body } = parseFrontmatter(raw);
  const blocks = parseBlocks(stripStrays(body));

  return { title, description, blocks };
}