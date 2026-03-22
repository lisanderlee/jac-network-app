import Link from "next/link"
import { notFound } from "next/navigation"

import { ApplicationReviewActions } from "@/components/applications/application-review-actions"

export const dynamic = "force-dynamic"
import { Badge } from "@/components/ui/badge"
import { createAdminClient } from "@/lib/supabase/admin"
import type { ApplicationRow } from "@/types/database.types"

export default async function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const admin = createAdminClient()
  const { data: application, error } = await admin.from("applications").select("*").eq("id", id).single()

  if (error || !application) {
    notFound()
  }

  const app = application as ApplicationRow

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-10">
      <Link href="/admin/applications" className="text-muted-foreground hover:text-foreground text-sm">
        ← All applications
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{app.full_name}</h1>
          <p className="text-muted-foreground mt-1">{app.email}</p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {app.status}
        </Badge>
      </div>

      <dl className="grid gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Discipline</dt>
          <dd className="font-medium capitalize">{app.discipline}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Headline</dt>
          <dd>{app.headline}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Motivation</dt>
          <dd className="whitespace-pre-wrap">{app.motivation}</dd>
        </div>
        {app.linkedin_url ? (
          <div>
            <dt className="text-muted-foreground">LinkedIn</dt>
            <dd>
              <a href={app.linkedin_url} className="text-primary underline" target="_blank" rel="noreferrer">
                {app.linkedin_url}
              </a>
            </dd>
          </div>
        ) : null}
        {app.website_url ? (
          <div>
            <dt className="text-muted-foreground">Website</dt>
            <dd>
              <a href={app.website_url} className="text-primary underline" target="_blank" rel="noreferrer">
                {app.website_url}
              </a>
            </dd>
          </div>
        ) : null}
        {app.referral ? (
          <div>
            <dt className="text-muted-foreground">Referral</dt>
            <dd>{app.referral}</dd>
          </div>
        ) : null}
      </dl>

      {app.status === "pending" ? <ApplicationReviewActions applicationId={app.id} /> : null}
    </div>
  )
}
