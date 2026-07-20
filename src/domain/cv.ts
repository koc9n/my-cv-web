import { z } from "zod";

export const linkSchema = z.object({
  label: z.string(),
  url: z.string().url().or(z.literal("")),
});
export const achievementSchema = z.object({ text: z.string().min(1) });
export const experienceSchema = z.object({
  role: z.string(),
  employer: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string(),
  achievements: z.array(achievementSchema),
  technologies: z.array(z.string()).default([]),
});
export const sectionIdSchema = z.enum([
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "languages",
  "achievements",
  "additional",
]);
export type SectionId = z.infer<typeof sectionIdSchema>;
export const cvSchema = z
  .object({
    schemaVersion: z.literal(2),
    basics: z.object({
      name: z.string(),
      headline: z.string(),
      location: z.string(),
      availability: z.string(),
      links: z.array(linkSchema),
    }),
    summary: z.string(),
    skills: z.array(
      z.object({ category: z.string(), items: z.array(z.string()) }),
    ),
    experience: z.array(experienceSchema),
    education: z.array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        period: z.string(),
      }),
    ),
    projects: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        url: z.string().url().optional().or(z.literal("")),
      }),
    ),
    certifications: z.array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        year: z.string(),
        url: z.string().url().optional().or(z.literal("")),
      }),
    ),
    languages: z.array(
      z.object({ language: z.string(), proficiency: z.string() }),
    ),
    achievements: z.array(achievementSchema),
    additionalSections: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        items: z.array(z.string()),
      }),
    ),
    sectionSettings: z.array(
      z.object({
        id: sectionIdSchema,
        label: z.string(),
        visible: z.boolean(),
      }),
    ),
  })
  .superRefine((cv, ctx) => {
    const sectionIds = cv.sectionSettings.map((section) => section.id);
    if (
      sectionIds.length !== sectionIdSchema.options.length ||
      new Set(sectionIds).size !== sectionIdSchema.options.length
    )
      ctx.addIssue({
        code: "custom",
        path: ["sectionSettings"],
        message: "Every section must appear exactly once",
      });
    const customIds = cv.additionalSections.map((section) => section.id);
    if (new Set(customIds).size !== customIds.length)
      ctx.addIssue({
        code: "custom",
        path: ["additionalSections"],
        message: "Additional section IDs must be unique",
      });
  });

export type Cv = z.infer<typeof cvSchema>;

const defaultSectionSettings: Cv["sectionSettings"] = [
  { id: "summary", label: "Summary", visible: true },
  { id: "experience", label: "Experience", visible: true },
  { id: "skills", label: "Technical skills", visible: true },
  { id: "projects", label: "Selected projects", visible: true },
  { id: "achievements", label: "Key achievements", visible: false },
  { id: "education", label: "Education", visible: true },
  { id: "certifications", label: "Certifications", visible: true },
  { id: "languages", label: "Languages", visible: true },
  { id: "additional", label: "Additional", visible: true },
];

export function validateCv(value: unknown): Cv {
  if (
    value &&
    typeof value === "object" &&
    "schemaVersion" in value &&
    (value as { schemaVersion?: unknown }).schemaVersion === 1
  ) {
    return cvSchema.parse({
      ...value,
      schemaVersion: 2,
      projects: [],
      certifications: [],
      languages: [],
      additionalSections: [],
      sectionSettings: defaultSectionSettings,
    });
  }
  return cvSchema.parse(value);
}

export function sectionHasContent(cv: Cv, id: SectionId): boolean {
  if (id === "summary") return Boolean(cv.summary.trim());
  if (id === "additional")
    return cv.additionalSections.some(
      (s) => s.title.trim() && s.items.some(Boolean),
    );
  return cv[id].length > 0;
}

export function visibleSections(cv: Cv) {
  return cv.sectionSettings.filter(
    (s) => s.visible && sectionHasContent(cv, s.id),
  );
}
