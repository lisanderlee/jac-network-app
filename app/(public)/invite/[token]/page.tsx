import Link from "next/link"

import { InviteClient } from "@/app/(public)/invite/[token]/invite-client"

export const dynamic = "force-dynamic"
import { createAdminClient } from "@/lib/supabase/admin"

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()

  const { data: application, error } = await admin
    .from("applications")
    .select("id, email, full_name, headline, discipline, status, invite_expires_at")
    .eq("invite_token", token)
    .maybeSingle()

  if (error || !application) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Invalid invite</h1>
        <p className="text-muted-foreground">
          This link is not valid. If you were invited recently, ask for a new invite from the team.
        </p>
        <Link href="/" className="text-primary font-medium underline-offset-4 hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  if (application.status !== "invited") {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Invite already used</h1>
        <p className="text-muted-foreground">This invitation is no longer active.</p>
        <Link href="/" className="text-primary font-medium underline-offset-4 hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  if (application.invite_expires_at && new Date(application.invite_expires_at) < new Date()) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Invite expired</h1>
        <p className="text-muted-foreground">This link has expired. Contact the team for a new invite.</p>
        <Link href="/" className="text-primary font-medium underline-offset-4 hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-10 px-4 py-16">
      <div>
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
          ← Home
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">You are invited</h1>
        <p className="text-muted-foreground mt-2 text-lg">Create your account and finish your profile.</p>
      </div>

      <InviteClient
        token={token}
        application={{
          full_name: application.full_name,
          email: application.email,
          headline: application.headline,
          discipline: application.discipline,
        }}
      />
    </div>
  )
}
