"use server"

import { revalidatePath } from "next/cache"

import type { ActionResult } from "@/lib/action-result"
import { getSessionAndProfile } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { profileEditSchema } from "@/lib/validations/profile"

function parseCommaList(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
}

export async function updateProfile(input: unknown): Promise<ActionResult<{ username: string }>> {
  const session = await getSessionAndProfile()
  if (!session?.user) {
    return { success: false, error: "Not signed in" }
  }

  const parsed = profileEditSchema.safeParse(input)
  if (!parsed.success) {
    const flat = parsed.error.flatten()
    const fieldMsgs = Object.values(flat.fieldErrors)
      .flat()
      .filter(Boolean)
    const msg = [...fieldMsgs, ...flat.formErrors].join(", ")
    return { success: false, error: msg || "Invalid form" }
  }

  const data = parsed.data
  const skills = parseCommaList(data.skills)
  const tools = parseCommaList(data.tools)
  const industries = parseCommaList(data.industries)

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("profiles")
    .update({
      username: data.username,
      full_name: data.full_name,
      headline: data.headline?.trim() || null,
      bio: data.bio?.trim() || null,
      avatar_url: data.avatar_url?.trim() || null,
      location: data.location?.trim() || null,
      timezone: data.timezone?.trim() || null,
      website_url: data.website_url?.trim() || null,
      linkedin_url: data.linkedin_url?.trim() || null,
      discipline: data.discipline,
      seniority: data.seniority,
      availability: data.availability,
      work_type: data.work_type,
      skills,
      tools,
      industries,
      looking_for: data.looking_for?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id)

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "That username is already taken." }
    }
    return { success: false, error: error.message }
  }

  revalidatePath("/directory")
  revalidatePath(`/directory/${data.username}`)
  revalidatePath("/profile/edit")

  return { success: true, data: { username: data.username } }
}
