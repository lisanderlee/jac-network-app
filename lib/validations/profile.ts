import { z } from "zod"

import { disciplineSchema } from "@/lib/validations/application"

const workTypeEnum = z.enum(["freelance", "full-time", "consulting", "advisory"])

export const profileEditSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(32)
      .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
    full_name: z.string().min(1),
    headline: z.string().optional(),
    bio: z.string().optional(),
    avatar_url: z.string().optional(),
    location: z.string().optional(),
    timezone: z.string().optional(),
    website_url: z.string().optional(),
    linkedin_url: z.string().optional(),
    discipline: disciplineSchema,
    seniority: z
      .union([z.literal(""), z.enum(["junior", "mid", "senior", "lead", "executive"])])
      .transform((v) => (v === "" ? null : v)),
    availability: z.enum(["available", "open", "unavailable"]),
    work_type: z.array(workTypeEnum).default([]),
    skills: z.string(),
    tools: z.string(),
    industries: z.string(),
    looking_for: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const urlCheck = (
      val: string | undefined,
      path: "avatar_url" | "website_url" | "linkedin_url",
      label: string
    ) => {
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
    urlCheck(data.avatar_url, "avatar_url", "avatar URL")
    urlCheck(data.website_url, "website_url", "website URL")
    urlCheck(data.linkedin_url, "linkedin_url", "LinkedIn URL")
  })

/** Parsed / stored shape (after transforms). */
export type ProfileEditValues = z.infer<typeof profileEditSchema>
/** Form + server action payload shape (before transforms). */
export type ProfileEditInput = z.input<typeof profileEditSchema>

export const inviteProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  full_name: z.string().min(1),
  headline: z.string().min(1),
})

export type InviteProfileValues = z.infer<typeof inviteProfileSchema>

export const profileOnboardingSchema = inviteProfileSchema.extend({
  discipline: disciplineSchema,
})

export type ProfileOnboardingValues = z.infer<typeof profileOnboardingSchema>
