import { z } from "zod"

export const disciplineSchema = z.enum([
  "creative",
  "strategy",
  "technology",
  "production",
  "marketing",
])

export const applicationFormSchema = z
  .object({
    email: z.string().email(),
    full_name: z.string().min(1, "Name is required"),
    linkedin_url: z.string().optional(),
    website_url: z.string().optional(),
    discipline: disciplineSchema,
    headline: z.string().min(1, "Please add a one-line description"),
    motivation: z.string().min(20, "Please share a bit more (at least 20 characters)"),
    referral: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const urlCheck = (val: string | undefined, path: "linkedin_url" | "website_url", label: string) => {
      if (!val || val.trim() === "") return
      const r = z.string().url().safeParse(val)
      if (!r.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid ${label}`,
          path: [path],
        })
      }
    }
    urlCheck(data.linkedin_url, "linkedin_url", "LinkedIn URL")
    urlCheck(data.website_url, "website_url", "website URL")
  })

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>
