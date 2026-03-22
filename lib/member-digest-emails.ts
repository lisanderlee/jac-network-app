import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Emails for users who have a profile row (approved members).
 * Uses Auth Admin API + profiles id set (service role only).
 */
export async function getMemberRecipientEmails(): Promise<string[]> {
  const admin = createAdminClient()
  const { data: profiles, error } = await admin.from("profiles").select("id")
  if (error) throw error
  const ids = new Set((profiles ?? []).map((p) => p.id))

  const emails: string[] = []
  let page = 1
  for (;;) {
    const { data, error: listErr } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (listErr) throw listErr
    if (!data.users.length) break
    for (const u of data.users) {
      if (u.email && ids.has(u.id)) emails.push(u.email)
    }
    if (data.users.length < 1000) break
    page++
  }

  return [...new Set(emails)]
}
