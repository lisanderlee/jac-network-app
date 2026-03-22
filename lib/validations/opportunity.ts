import { z } from "zod"

const opportunityTypeSchema = z.enum(["job", "project", "collab", "event"])

const locationTypeSchema = z.enum(["remote", "hybrid", "on-site"])

const engagementSchema = z.enum(["full-time", "part-time", "one-off", "ongoing"])

export const opportunityFormSchema = z.object({
  title: z.string().min(3).max(200),
  type: opportunityTypeSchema,
  description: z.string().min(20, "Please add a bit more detail (at least 20 characters)"),
  skills_needed: z.string(),
  location_type: z.union([z.literal(""), locationTypeSchema]).transform((v) => (v === "" ? null : v)),
  location: z.string().optional(),
  compensation: z.string().optional(),
  engagement: z.union([z.literal(""), engagementSchema]).transform((v) => (v === "" ? null : v)),
  deadline: z
    .string()
    .optional()
    .transform((s) => {
      const t = s?.trim()
      return t && /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null
    }),
})

export type OpportunityFormInput = z.input<typeof opportunityFormSchema>
export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>
