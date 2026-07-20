import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().max(160),
  message: z.string().trim().min(10).max(3000),
  companyWebsite: z.string().max(0),
});
