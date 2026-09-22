import type { CrewMember } from "@/lib/crew";
import { CONTENT_FILES } from "./paths";
import { ContentError, readJsonList, writeJsonList } from "./content";
import type {
  CrewCreateInput,
  CrewPatchInput,
} from "./schemas";

type JsonRecord = Record<string, unknown>;

function memberNotFound(): ContentError {
  return new ContentError("Crew member not found.", 404, "member_not_found");
}

function memberExists(slug: string): ContentError {
  return new ContentError(
    `A crew member with the slug "${slug}" already exists.`,
    409,
    "crew_exists",
  );
}

/** Kanonische Feld-Reihenfolge der crew.json. */
function toCanonicalMember(member: CrewMember): JsonRecord {
  const result: JsonRecord = {
    name: member.name,
    rollen: member.rollen ?? [],
    minecraftUser: member.minecraftUser,
    useskin: member.useskin ?? false,
    showLaby: member.showLaby ?? false,
    labySlug: member.labySlug ?? "",
    thescape_slug: member.thescape_slug ?? "",
    priority: member.priority,
    slug: member.slug,
  };
  if (member.seasons && member.seasons.length > 0) {
    result.seasons = member.seasons;
  }
  result.inactive = member.inactive ?? false;
  return result;
}

interface CrewFile {
  members: CrewMember[];
  sha: string | null;
}

export async function readAllMembers(): Promise<CrewFile> {
  const { data, sha } = await readJsonList(CONTENT_FILES.crew);
  return { members: data as CrewMember[], sha };
}

function ensureMember(members: CrewMember[], slug: string): CrewMember {
  const member = members.find((candidate) => candidate.slug === slug);
  if (!member) {
    throw memberNotFound();
  }
  return member;
}

function assertUniqueSlug(slug: string, members: CrewMember[]): void {
  if (members.some((member) => member.slug === slug)) {
    throw memberExists(slug);
  }
}

export async function createMember(
  input: CrewCreateInput,
): Promise<{ member: CrewMember }> {
  const { members, sha } = await readAllMembers();
  assertUniqueSlug(input.slug, members);

  const priority =
    input.priority ??
    (members.length > 0
      ? Math.max(...members.map((member) => member.priority ?? 0)) + 1
      : 1);

  const member: CrewMember = {
    name: input.name,
    slug: input.slug,
    rollen: input.rollen,
    minecraftUser: input.minecraftUser,
    useskin: input.useskin,
    showLaby: input.showLaby,
    labySlug: input.labySlug,
    thescape_slug: input.thescape_slug,
    priority,
    seasons: input.seasons.length > 0 ? input.seasons : undefined,
    inactive: input.inactive,
  };

  const next = [...members, member];
  await writeJsonList(
    CONTENT_FILES.crew,
    next,
    `admin: create crew member "${input.name}"`,
    sha,
  );

  return { member };
}

export async function updateMember(
  slug: string,
  input: CrewPatchInput,
): Promise<{ member: CrewMember }> {
  const { members, sha } = await readAllMembers();
  const index = members.findIndex((member) => member.slug === slug);
  if (index === -1) {
    throw memberNotFound();
  }

  const current = members[index];
  const scalarRules: Record<string, keyof CrewPatchInput> = {
    name: "name",
    rollen: "rollen",
    minecraftUser: "minecraftUser",
    useskin: "useskin",
    showLaby: "showLaby",
    labySlug: "labySlug",
    thescape_slug: "thescape_slug",
    priority: "priority",
    inactive: "inactive",
    slug: "slug",
  };

  const merged: CrewMember = { ...current };
  for (const [field, key] of Object.entries(scalarRules) as [
    string,
    keyof CrewPatchInput,
  ][]) {
    if (input[key] !== undefined) {
      (merged as unknown as Record<string, unknown>)[field] = input[key];
    }
  }
  if (input.seasons !== undefined) {
    merged.seasons = input.seasons;
  }
  if (input.slug !== undefined) {
    merged.slug = input.slug;
  }

  const slugChanged = merged.slug !== slug;
  if (slugChanged) {
    assertUniqueSlug(merged.slug, members.filter((_, i) => i !== index));
  }

  const next = [...members];
  next.splice(index, 1, toCanonicalMember(merged) as unknown as CrewMember);

  await writeJsonList(
    CONTENT_FILES.crew,
    next,
    `admin: update crew member "${merged.name}"`,
    sha,
  );

  return { member: merged };
}

export async function deleteMember(slug: string): Promise<void> {
  const { members, sha } = await readAllMembers();
  const index = members.findIndex((member) => member.slug === slug);
  if (index === -1) {
    throw memberNotFound();
  }

  const next = [...members];
  next.splice(index, 1);

  await writeJsonList(
    CONTENT_FILES.crew,
    next,
    `admin: delete crew member "${members[index].name}"`,
    sha,
  );
}

export async function reorderMembers(order: string[]): Promise<CrewMember[]> {
  const { members, sha } = await readAllMembers();

  const existing = members.map((member) => member.slug);
  const uniqueOrder = [...new Set(order)];
  const hasAll = existing.every((slug) => uniqueOrder.includes(slug));
  const sameSize = uniqueOrder.length === existing.length;
  if (!hasAll || !sameSize) {
    throw new ContentError(
      "Crew member list changed. Reload and try again.",
      409,
      "conflict_reorder",
    );
  }

  const bySlug = new Map(members.map((member) => [member.slug, member]));
  const next = uniqueOrder.map((slug, index) => {
    const member = bySlug.get(slug)!;
    return { ...member, priority: index + 1 };
  });

  await writeJsonList(
    CONTENT_FILES.crew,
    next,
    "admin: reorder crew members",
    sha,
  );

  return next;
}

export { ensureMember };
export type { CrewMember };