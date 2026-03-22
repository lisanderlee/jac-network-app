"use server"

import type { ActionResult } from "@/lib/action-result"
import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { inviteProfileSchema } from "@/lib/validations/profile"

export async function completeInviteProfile(
  token: string,
  input: { username: string; full_name: string; headline: string }
): Promise<ActionResult<null>> {
  const parsed = inviteProfileSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().formErrors.join(", ") || "Invalid profile" }
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return { success: false, error: "You need to be signed in to complete your profile." }
  }

  const admin = createAdminClient()
  const { data: application, error: fetchError } = await admin
    .from("applications")
    .select("*")
    .eq("invite_token", token)
    .maybeSingle()

  if (fetchError || !application) {
    return { success: false, error: "Invalid invite link." }
  }

  if (application.status !== "invited") {
    return { success: false, error: "This invite is no longer valid." }
  }

  if (application.email.toLowerCase() !== user.email.toLowerCase()) {
    return { success: false, error: "Sign in with the same email this invite was sent to." }
  }

  if (application.invite_expires_at && new Date(application.invite_expires_at) < new Date()) {
    return { success: false, error: "This invite has expired." }
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    username: parsed.data.username,
    full_name: parsed.data.full_name,
    headline: parsed.data.headline,
    discipline: application.discipline,
    availability: "open",
    work_type: [],
    skills: [],
    tools: [],
    industries: [],
    role: "member",
  })

  if (insertError) {
    if (insertError.code === "23505") {
      return { success: false, error: "That username is already taken." }
    }
    return { success: false, error: insertError.message }
  }

  const { error: updateError } = await admin
    .from("applications")
    .update({
      status: "completed",
      invite_token: null,
      invite_expires_at: null,
    })
    .eq("id", application.id)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true, data: null }
}
