import { z } from "zod";
import { SLUG_PATTERN } from "./paths";

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(140)
  .regex(
    SLUG_PATTERN,
    "Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.",
  );

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum muss dem Format YYYY-MM-DD entsprechen.");

export const timeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Zeit muss dem Format HH:mm entsprechen.");

export const prioritySchema = z
  .number()
  .int()
  .min(-1_000_000)
  .max(1_000_000);

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export const eventLinkSchema = z.object({
  displayName: z.string().trim().min(1).max(160),
  url: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .refine(isHttpUrl, "Link muss eine gültige http(s)-URL sein."),
});

const eventFieldsSchema = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich.").max(160),
  description: z.string().trim().max(2000),
  priority: prioritySchema.optional(),
  date: isoDateSchema,
  time: timeSchema.nullable().optional(),
  showTime: z.boolean(),
  show: z.boolean(),
  showDetailsButton: z.boolean(),
  done: z.boolean(),
  countdown: z.boolean(),
  icon: z.string().trim().max(300).nullable().optional(),
  season: z.string().trim().max(140).nullable().optional(),
  links: z.array(eventLinkSchema).max(25).nullable().optional(),
});

export const eventCreateSchema = eventFieldsSchema.extend({ slug: slugSchema });
export const eventPatchSchema = eventFieldsSchema.partial().extend({
  slug: slugSchema.optional(),
});

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventPatchInput = z.infer<typeof eventPatchSchema>;

export const eventLinkListSchema = z.array(
  z.object({
    displayName: z.string().trim().min(1).max(160),
    url: z.string().trim().min(1).max(500),
  }),
);

export const eventsFileSchema = z.array(
  z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string(),
    priority: z.number().int(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().optional(),
    showTime: z.boolean(),
    show: z.boolean(),
    showDetailsButton: z.boolean(),
    done: z.boolean(),
    countdown: z.boolean(),
    icon: z.string().optional(),
    links: z
      .array(z.object({ displayName: z.string(), url: z.string() }))
      .optional(),
    season: z.string().optional(),
  }),
);

/* ------------------------------------------------------------------ */
/* Crew                                                                */
/* ------------------------------------------------------------------ */

export const crewCreateSchema = z.object({
  name: z.string().trim().min(1, "Name ist erforderlich.").max(160),
  slug: slugSchema,
  rollen: z.array(z.string().trim().min(1).max(80)).max(25),
  minecraftUser: z.string().trim().max(64),
  useskin: z.boolean(),
  showLaby: z.boolean(),
  labySlug: z.string().trim().max(120),
  thescape_slug: z.string().trim().max(255),
  priority: prioritySchema,
  seasons: z.array(slugSchema).max(50),
  inactive: z.boolean(),
});

export const crewPatchSchema = crewCreateSchema.partial();

export type CrewCreateInput = z.infer<typeof crewCreateSchema>;
export type CrewPatchInput = z.infer<typeof crewPatchSchema>;

export const crewFileSchema = z.array(
  z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    rollen: z.array(z.string()),
    minecraftUser: z.string(),
    useskin: z.boolean().optional(),
    showLaby: z.boolean().optional(),
    labySlug: z.string().optional(),
    thescape_slug: z.string().optional(),
    priority: z.number().int(),
    seasons: z.array(z.string()).optional(),
    inactive: z.boolean().optional(),
    rolle: z.string().optional(),
  }),
);

export const crewReorderSchema = z.object({
  order: z.array(slugSchema).min(1).max(500),
});

/* ------------------------------------------------------------------ */
/* Seasons                                                             */
/* ------------------------------------------------------------------ */

export const seasonCreateSchema = z
  .object({
    name: z.string().trim().min(1, "Name ist erforderlich.").max(160),
    slug: slugSchema,
    start: isoDateSchema,
    end: isoDateSchema,
    priority: prioritySchema,
    showEvents: z.boolean().optional(),
  })
  .refine((value) => value.end >= value.start, {
    message: "Das Enddatum muss nach dem Startdatum liegen.",
    path: ["end"],
  });

export const seasonPatchSchema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  slug: slugSchema.optional(),
  start: isoDateSchema.optional(),
  end: isoDateSchema.optional(),
  priority: prioritySchema.optional(),
  showEvents: z.boolean().nullable().optional(),
});

export type SeasonCreateInput = z.infer<typeof seasonCreateSchema>;
export type SeasonPatchInput = z.infer<typeof seasonPatchSchema>;

export const seasonsFileSchema = z.array(
  z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    priority: z.number().int(),
    showEvents: z.boolean().optional(),
  }),
);

/* ------------------------------------------------------------------ */
/* Markdown                                                            */
/* ------------------------------------------------------------------ */

export const markdownSchema = z
  .string()
  .max(400_000, "Markdown-Datei ist zu groß.");

export const markdownPutSchema = z.object({
  markdown: markdownSchema,
});