"use server"

import { revalidatePath } from "next/cache"

import type { ActionResult } from "@/lib/action-result"
import { getSessionAndProfile } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { opportunityFormSchema } from "@/lib/validations/opportunity"

function parseCommaList(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
}

export async function createOpportunity(input: unknown): Promise<ActionResult<{ id: string }>> {
  const session = await getSessionAndProfile()
  if (!session?.user) {
    return { success: false, error: "Not signed in" }
  }

  const parsed = opportunityFormSchema.safeParse(input)
  if (!parsed.success) {
    const flat = parsed.error.flatten()
    const fieldMsgs = Object.values(flat.fieldErrors)
      .flat()
      .filter(Boolean)
    const msg = [...fieldMsgs, ...flat.formErrors].join(", ")
    return { success: false, error: msg || "Invalid form" }
  }

  const data = parsed.data
  const skills_needed = parseCommaList(data.skills_needed)

  const supabase = await createServerSupabaseClient()
  const { data: row, error } = await supabase
    .from("opportunities")
    .insert({
      posted_by: session.user.id,
      title: data.title,
      type: data.type,
      description: data.description,
      skills_needed,
      location_type: data.location_type,
      location: data.location?.trim() || null,
      compensation: data.compensation?.trim() || null,
      engagement: data.engagement,
      deadline: data.deadline ?? null,
      is_active: true,
    })
    .select("id")
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/opportunities")
  return { success: true, data: { id: row.id } }
}

export async function closeOpportunity(opportunityId: string): Promise<ActionResult<void>> {
  const session = await getSessionAndProfile()
  if (!session?.user) {
    return { success: false, error: "Not signed in" }
  }

  const supabase = await createServerSupabaseClient()

  const { data: existing, error: fetchErr } = await supabase
    .from("opportunities")
    .select("posted_by")
    .eq("id", opportunityId)
    .maybeSingle()

  if (fetchErr) {
    return { success: false, error: fetchErr.message }
  }
  if (!existing) {
    return { success: false, error: "Opportunity not found" }
  }
  if (existing.posted_by !== session.user.id) {
    return { success: false, error: "You can only update your own listings" }
  }

  const { error } = await supabase
    .from("opportunities")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", opportunityId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/opportunities")
  revalidatePath(`/opportunities/${opportunityId}`)
  return { success: true, data: undefined }
}

/** Form actions must return void — use this with `<form action={...}>`. */
export async function markOpportunityFilled(opportunityId: string): Promise<void> {
  const result = await closeOpportunity(opportunityId)
  if (!result.success) {
    throw new Error(result.error)
  }
}
