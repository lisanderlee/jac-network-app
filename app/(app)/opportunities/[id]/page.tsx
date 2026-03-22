import Link from "next/link"
import { notFound } from "next/navigation"

import { markOpportunityFilled } from "@/app/(app)/opportunities/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSessionAndProfile } from "@/lib/auth"
import { getOpportunityById } from "@/lib/opportunities"

export const dynamic = "force-dynamic"

function typeLabel(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function locationLabel(l: string | null) {
  if (!l) return "—"
  return l.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [opportunity, session] = await Promise.all([getOpportunityById(id), getSessionAndProfile()])

  if (!opportunity) {
    notFound()
  }

  const currentUserId = session?.user.id ?? null
  const isOwner = currentUserId !== null && opportunity.posted_by === currentUserId
  const skills = opportunity.skills_needed ?? []

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/opportunities" className="text-muted-foreground hover:text-foreground text-sm">
          ← Opportunities
        </Link>
        {opportunity.poster_username ? (
          <Link
            href={`/directory/${opportunity.poster_username}`}
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            View poster profile
          </Link>
        ) : null}
      </div>

      {!opportunity.is_active ? (
        <p className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">This listing has been marked filled.</p>
      ) : null}

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{opportunity.title}</h1>
          <Badge variant="secondary" className="capitalize">
            {typeLabel(opportunity.type)}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Posted by{" "}
          <span className="text-foreground font-medium">{opportunity.poster_full_name ?? "Member"}</span>
          {opportunity.poster_username ? (
            <>
              {" "}
              <span className="text-muted-foreground/90">@{opportunity.poster_username}</span>
            </>
          ) : null}
          {" · "}
          {new Date(opportunity.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {opportunity.location_type ? (
          <Badge variant="outline">{locationLabel(opportunity.location_type)}</Badge>
        ) : null}
        {opportunity.location ? <Badge variant="outline">{opportunity.location}</Badge> : null}
        {opportunity.engagement ? <Badge variant="outline">{opportunity.engagement}</Badge> : null}
        {opportunity.compensation ? (
          <Badge variant="outline" className="font-normal">
            {opportunity.compensation}
          </Badge>
        ) : null}
        {opportunity.deadline ? (
          <span className="text-muted-foreground text-sm">
            Deadline {new Date(opportunity.deadline + "T12:00:00").toLocaleDateString()}
          </span>
        ) : null}
      </div>

      <section>
        <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">Description</h2>
        <p className="whitespace-pre-wrap leading-relaxed">{opportunity.description}</p>
      </section>

      {skills.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">Skills</h2>
          <ul className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <li key={s}>
                <span className="bg-muted rounded-md px-2 py-1 text-sm">{s}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {isOwner && opportunity.is_active ? (
        <form action={markOpportunityFilled.bind(null, opportunity.id)}>
          <Button type="submit" variant="outline">
            Mark as filled
          </Button>
        </form>
      ) : null}
    </div>
  )
}
