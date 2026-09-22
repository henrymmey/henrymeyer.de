import crewData from "./crew.json";

export interface CrewMember {
  name: string;
  /** Veraltet: nur noch eine einzelne Rolle. Nutze stattdessen `rollen`. */
  rolle?: string;
  rollen: string[];
  minecraftUser: string;
  useskin?: boolean;
  showLaby?: boolean;
  labySlug?: string;
  priority: number;
  slug: string;
  thescape_slug?: string;
  /** Season-Slugs – nur auf der Detailseite angezeigt. */
  seasons?: string[];
  /** Inaktive Mitglieder werden auf der Startseite ausgeblendet und auf /crew unter "Inaktiv" geführt. */
  inactive?: boolean;
}

export const crew = crewData as CrewMember[];

export function getMemberRoles(member: CrewMember): string[] {
  let roles: string[];
  if (Array.isArray(member.rollen) && member.rollen.length > 0) {
    roles = member.rollen;
  } else if (member.rolle) {
    roles = [member.rolle];
  } else {
    roles = [];
  }
  if (member.inactive) {
    roles = [...roles, "Inaktiv"];
  }
  return roles;
}

export function getMemberSeasons(member: CrewMember): string[] {
  return member.seasons ?? [];
}

export function getCrewMemberBySlug(slug: string): CrewMember | null {
  return crew.find((member) => member.slug === slug) ?? null;
}
