import { getMemberRoles, type CrewMember } from "@/lib/crew";
import type { EventConfig } from "@/lib/events/types";

export const SITE_NAME = "HMT Clan";

export const SITE_URL =
  process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") || "https://hmtclan.de";

export const SITE_DESCRIPTION =
  "HMT Clan – Freunde, die gemeinsam auf dem TheScape-Server Minecraft spielen. Events, Seasons, Crew.";

export const DISCORD_URL = "https://discord.gg/8aWmBuYURK";

export const GITHUB_URL =
  "https://github.com/henrymmey/henrymeyer.de/tree/main/apps/hmt-clan";

export const THESCAPE_URL = "https://thescape.de";

export const PACK_DESCRIPTION =
  "Das HMT Pack – Modpack vom HMT Clan zum Spielen auf dem TheScape-Server. Inklusive eigener Server-GUI.";

function url(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`;
}

type Schema = Record<string, unknown>;

export function websiteSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "de-DE",
    about: ["Minecraft", "TheScape", "Minecraft Clan"],
  };
}

export function organizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: url("/logo.png"),
    description: SITE_DESCRIPTION,
    foundingDate: "2024",
    sameAs: [DISCORD_URL, GITHUB_URL],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "community",
      url: url("/contact"),
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: url(item.path),
    })),
  };
}

function eventStartDate(event: EventConfig): string {
  if (event.time) {
    const time = event.time.includes(":") ? event.time : `${event.time}:00`;
    return `${event.date}T${time}:00`;
  }
  return event.date;
}

export function eventSchema(event: EventConfig): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: eventStartDate(event),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: THESCAPE_URL,
      name: "TheScape Server",
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: url(`/events/${event.slug}`),
    image: url(`/events/${event.slug}/opengraph-image`),
  };
}

export function profileSchema(member: CrewMember): Schema {
  const labyUrl =
    member.showLaby && member.labySlug
      ? `https://laby.net/de/@${member.labySlug}`
      : null;

  const sameAs = [...(labyUrl ? [labyUrl] : [])];
  if (member.thescape_slug) {
    sameAs.push(`https://www.thescape.de/${member.thescape_slug}`);
  }

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: url(`/crew/${member.slug}`),
    mainEntity: {
      "@type": "Person",
      name: member.name,
      description: `${member.name} – ${getMemberRoles(member).join(", ")} beim HMT Clan auf TheScape.`,
      image: url(`/skins/${member.minecraftUser}.png`),
      affiliation: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
      ...(sameAs.length > 0 ? { sameAs } : {}),
    },
  } as Schema;
}

export function softwareAppSchema(path = "/pack"): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "HMT Pack",
    url: url(path),
    applicationCategory: "GameApplication",
    operatingSystem: "Windows, macOS, Linux",
    description: PACK_DESCRIPTION,
    softwareVersion: "1.0.0",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };
}

export function howToJoinSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Dem HMT Clan beitreten",
    description:
      "In drei Schritten Teil des HMT Clans auf TheScape werden.",
    totalTime: "PT15M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Tritt unserem Discord bei",
        url: url("/join"),
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Schreibe @henrymmey eine DM",
        url: url("/join"),
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Schreibe die Bewerbung auf TheScape",
        url: url("/join"),
      },
    ],
  };
}

export function itemListSchema(
  items: { name: string; path: string; type?: string }[],
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": item.type ?? "Thing",
        name: item.name,
        url: url(item.path),
      },
    })),
  };
}

export function collectionPageSchema(name: string, path: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    url: url(path),
    inLanguage: "de-DE",
  };
}