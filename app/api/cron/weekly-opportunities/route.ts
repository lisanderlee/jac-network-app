import { NextResponse } from "next/server"

import { WeeklyOpportunitiesDigest } from "@/emails/WeeklyOpportunitiesDigest"
import { getMemberRecipientEmails } from "@/lib/member-digest-emails"
import { listRecentActiveOpportunitiesForDigest } from "@/lib/opportunities"
import { getAppOrigin } from "@/lib/resend"
import { resend } from "@/lib/resend"

/** Last 7 days of new listings (rolling window). */
function sinceSevenDaysAgoIso(): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 7)
  return d.toISOString()
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is not configured" }, { status: 500 })
  }

  const auth = request.headers.get("authorization")
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const from = process.env.RESEND_FROM_EMAIL
  if (!process.env.RESEND_API_KEY || !from) {
    return NextResponse.json({ ok: false, error: "Resend is not configured" }, { status: 500 })
  }

  try {
    const since = sinceSevenDaysAgoIso()
    const [opportunities, emails] = await Promise.all([
      listRecentActiveOpportunitiesForDigest(since),
      getMemberRecipientEmails(),
    ])

    const origin = getAppOrigin()
    const boardUrl = `${origin.replace(/\/$/, "")}/opportunities`

    let sent = 0
    for (const to of emails) {
      const { error } = await resend.emails.send({
        from,
        to,
        subject:
          opportunities.length === 0
            ? "JAC Network — weekly opportunities"
            : `JAC Network — ${opportunities.length} new opportunit${opportunities.length === 1 ? "y" : "ies"}`,
        react: WeeklyOpportunitiesDigest({
          opportunities: opportunities.map((o) => ({
            id: o.id,
            title: o.title,
            type: o.type,
          })),
          boardUrl,
        }),
      })
      if (!error) sent++
    }

    return NextResponse.json({
      ok: true,
      recipients: emails.length,
      sent,
      listingsInWindow: opportunities.length,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
