import Link from "next/link"

import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"
import { createAdminClient } from "@/lib/supabase/admin"
import type { ApplicationRow } from "@/types/database.types"

export default async function AdminApplicationsPage() {
  const admin = createAdminClient()
  const { data: applications, error } = await admin
    .from("applications")
    .select("id, full_name, email, discipline, status, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="p-8">
        <p className="text-destructive">Could not load applications: {error.message}</p>
      </div>
    )
  }

  const rows = (applications ?? []) as Pick<
    ApplicationRow,
    "id" | "full_name" | "email" | "discipline" | "status" | "created_at"
  >[]

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-1 text-sm">Review incoming requests to join.</p>
      </div>

      <ul className="divide-border divide-y rounded-lg border">
        {rows.length === 0 ? (
          <li className="text-muted-foreground p-6 text-sm">No applications yet.</li>
        ) : (
          rows.map((app) => (
            <li key={app.id}>
              <Link
                href={`/admin/applications/${app.id}`}
                className="hover:bg-muted/50 flex flex-wrap items-center justify-between gap-3 px-4 py-4 transition-colors"
              >
                <div>
                  <p className="font-medium">{app.full_name}</p>
                  <p className="text-muted-foreground text-sm">{app.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs capitalize">{app.discipline}</span>
                  <Badge variant="secondary" className="capitalize">
                    {app.status}
                  </Badge>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
