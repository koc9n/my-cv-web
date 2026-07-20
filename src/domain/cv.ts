import { z } from "zod";

export const linkSchema = z.object({ label: z.string(), url: z.string().url() });
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
export const cvSchema = z.object({
  schemaVersion: z.literal(1),
  basics: z.object({
    name: z.string(),
    headline: z.string(),
    location: z.string(),
    availability: z.string(),
    links: z.array(linkSchema),
  }),
  summary: z.string(),
  skills: z.array(z.object({ category: z.string(), items: z.array(z.string()) })),
  experience: z.array(experienceSchema),
  education: z.array(z.object({ degree: z.string(), institution: z.string(), period: z.string() })),
  achievements: z.array(achievementSchema),
});

export type Cv = z.infer<typeof cvSchema>;

export function validateCv(value: unknown): Cv {
  return cvSchema.parse(value);
}
