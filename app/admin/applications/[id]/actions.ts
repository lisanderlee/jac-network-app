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

    const from = process.env.RESEND_FROM_EMAIL
    if (!process.env.RESEND_API_KEY?.trim()) {
      return {
        success: false,
        error:
          "Invite email is not configured: set RESEND_API_KEY in your deployment environment (Vercel → Settings → Environment Variables).",
      }
    }
    if (!from?.trim()) {
      return {
        success: false,
        error:
          "Invite email is not configured: set RESEND_FROM_EMAIL to a verified sender in Resend (e.g. onboarding@yourdomain.com).",
      }
    }

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

    const inviteUrl = `${getAppOrigin()}/invite/${token}`

    let sendError: { message: string } | null = null
    try {
      const { error: err } = await resend.emails.send({
        from,
        to: application.email,
        subject: "Your invitation to JAC Network",
        react: InviteEmail({
          name: application.full_name,
          inviteUrl,
        }),
      })
      if (err) sendError = err
    } catch (e) {
      sendError = { message: e instanceof Error ? e.message : "Unknown email error" }
    }

    if (sendError) {
      await admin
        .from("applications")
        .update({
          status: "pending",
          reviewed_by: null,
          reviewed_at: null,
          invite_token: null,
          invite_sent_at: null,
          invite_expires_at: null,
        })
        .eq("id", applicationId)

      return {
        success: false,
        error: `Invite email failed: ${sendError.message}. Application was left as pending so you can try again after fixing Resend (domain verification, API key, or recipient rules).`,
      }
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
