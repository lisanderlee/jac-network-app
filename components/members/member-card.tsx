import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { MemberProfile } from "@/types/index"

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?"
}

function availabilityLabel(a: string | null) {
  if (!a) return "—"
  return a.charAt(0).toUpperCase() + a.slice(1)
}

export function MemberCard({ member }: { member: MemberProfile }) {
  const topSkills = (member.skills ?? []).slice(0, 4)

  return (
    <Link href={`/directory/${member.username}`}>
      <Card className="hover:bg-muted/40 h-full transition-colors">
        <div className="flex gap-4 p-4">
          <div className="bg-muted text-muted-foreground flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold">
            {member.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.avatar_url}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              initials(member.full_name)
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold">{member.full_name}</p>
              {member.is_featured ? (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              ) : null}
            </div>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {member.headline ?? "—"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="capitalize">
                {member.discipline}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {availabilityLabel(member.availability)}
              </Badge>
            </div>
            {topSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {topSkills.map((s) => (
                  <span
                    key={s}
                    className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  )
}
