"use server"

import { InviteEmail } from "@/emails/InviteEmail"
import { assertAdmin } from "@/lib/auth"
import type { ActionResult } from "@/lib/action-result"
import { getAppOrigin, resend } from "@/lib/resend"
import { createAdminClient } from "@/lib/supabase/admin"
import { randomBytes } from "crypto"

export async function approveAndInvite(applicationId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await assertAdmin()
    const admin = createAdminClient()

    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const { data: application, error } = await admin
      .from("applications")
      .update({
        status: "invited",
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        invite_token: token,
        invite_sent_at: new Date().toISOString(),
        invite_expires_at: expiresAt.toISOString(),
      })
      .eq("id", applicationId)
      .eq("status", "pending")
      .select()
      .single()

    if (error || !application) {
      return { success: false, error: error?.message ?? "Could not update application" }
    }

    const from = process.env.RESEND_FROM_EMAIL
    if (process.env.RESEND_API_KEY && from) {
      const inviteUrl = `${getAppOrigin()}/invite/${token}`
      await resend.emails.send({
        from,
        to: application.email,
        subject: "Your invitation to JAC Network",
        react: InviteEmail({
          name: application.full_name,
          inviteUrl,
        }),
      })
    }

    return { success: true, data: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unauthorized"
    return { success: false, error: message }
  }
}

export async function rejectApplication(applicationId: string): Promise<ActionResult<null>> {
  try {
    const { userId } = await assertAdmin()
    const admin = createAdminClient()

    const { error } = await admin
      .from("applications")
      .update({
        status: "rejected",
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", applicationId)
      .eq("status", "pending")

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: null }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unauthorized"
    return { success: false, error: message }
  }
}
