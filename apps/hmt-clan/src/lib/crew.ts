import crewData from "./crew.json";

export interface CrewMember {
  name: string;
  /** Veraltet: nur noch eine einzelne Rolle. Nutze stattdessen `rollen`. */
  rolle?: string;
  rollen: string[];
  minecraftUser: string;
  useskin?: boolean;
  priority: number;
  slug: string;
  thescape_slug?: string;
}

export const crew = crewData as CrewMember[];

export function getMemberRoles(member: CrewMember): string[] {
  if (Array.isArray(member.rollen) && member.rollen.length > 0) {
    return member.rollen;
  }
  if (member.rolle) {
    return [member.rolle];
  }
  return [];
}

export function getCrewMemberBySlug(slug: string): CrewMember | null {
  return crew.find((member) => member.slug === slug) ?? null;
}
