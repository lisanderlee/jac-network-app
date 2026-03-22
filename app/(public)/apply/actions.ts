"use server"

import { ApplicationReceived } from "@/emails/ApplicationReceived"
import type { ActionResult } from "@/lib/action-result"
import { resend } from "@/lib/resend"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  applicationFormSchema,
  type ApplicationFormValues,
} from "@/lib/validations/application"

export async function submitApplication(
  input: ApplicationFormValues
): Promise<ActionResult<{ id: string }>> {
  const parsed = applicationFormSchema.safeParse(input)
  if (!parsed.success) {
    const flat = parsed.error.flatten()
    const fieldMsgs = Object.values(flat.fieldErrors)
      .flat()
      .filter(Boolean)
    const msg = [...fieldMsgs, ...flat.formErrors].join(", ")
    return { success: false, error: msg || "Invalid form" }
  }

  const data = parsed.data
  // Service role: public applicants are anon — RLS has INSERT but no SELECT, so
  // insert().select() fails. Server-only + Zod-validated payload is safe here.
  const supabase = createAdminClient()

  const { data: row, error } = await supabase
    .from("applications")
    .insert({
      email: data.email,
      full_name: data.full_name,
      linkedin_url: data.linkedin_url?.trim() || null,
      website_url: data.website_url?.trim() || null,
      discipline: data.discipline,
      headline: data.headline,
      motivation: data.motivation,
      referral: data.referral?.trim() || null,
      status: "pending",
    })
    .select("id")
    .single()

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "An application with this email already exists.",
      }
    }
    return { success: false, error: error.message }
  }

  const from = process.env.RESEND_FROM_EMAIL
  if (process.env.RESEND_API_KEY && from) {
    try {
      await resend.emails.send({
        from,
        to: data.email,
        subject: "We received your application",
        react: ApplicationReceived({ name: data.full_name }),
      })
    } catch {
      // Application is stored; email is best-effort
    }
  }

  return { success: true, data: { id: row.id } }
}
