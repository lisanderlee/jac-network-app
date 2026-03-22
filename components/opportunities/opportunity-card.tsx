import Link from "next/link"

import { markOpportunityFilled } from "@/app/(app)/opportunities/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { OpportunityWithPoster } from "@/types/index"

function typeLabel(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function locationLabel(l: string | null) {
  if (!l) return "—"
  return l.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function OpportunityCard({
  opportunity: o,
  currentUserId,
}: {
  opportunity: OpportunityWithPoster
  currentUserId: string | null
}) {
  const skills = (o.skills_needed ?? []).slice(0, 5)
  const isOwner = currentUserId !== null && o.posted_by === currentUserId

  return (
    <Card className="flex h-full flex-col p-4">
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <Link
              href={`/opportunities/${o.id}`}
              className="text-foreground hover:underline font-semibold leading-snug"
            >
              {o.title}
            </Link>
            <p className="text-muted-foreground text-xs">
              {o.poster_full_name ?? "Member"}
              {o.poster_username ? (
                <>
                  {" "}
                  <span className="text-muted-foreground/80">@{o.poster_username}</span>
                </>
              ) : null}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 capitalize">
            {typeLabel(o.type)}
          </Badge>
        </div>

        <p className="text-muted-foreground line-clamp-3 text-sm">{o.description}</p>

        <div className="flex flex-wrap gap-2 text-xs">
          {o.location_type ? (
            <Badge variant="outline">{locationLabel(o.location_type)}</Badge>
          ) : null}
          {o.engagement ? <Badge variant="outline">{o.engagement}</Badge> : null}
          {o.deadline ? (
            <span className="text-muted-foreground">
              Deadline {new Date(o.deadline + "T12:00:00").toLocaleDateString()}
            </span>
          ) : null}
        </div>

        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {skills.map((s) => (
              <span key={s} className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                {s}
              </span>
            ))}
            {(o.skills_needed?.length ?? 0) > 5 ? (
              <span className="text-muted-foreground text-xs">+{(o.skills_needed?.length ?? 0) - 5} more</span>
            ) : null}
          </div>
        ) : null}
      </div>

      {isOwner ? (
        <form action={markOpportunityFilled.bind(null, o.id)} className="mt-4 border-t pt-3">
          <Button type="submit" variant="outline" size="sm" className="w-full sm:w-auto">
            Mark as filled
          </Button>
        </form>
      ) : null}
    </Card>
  )
}
