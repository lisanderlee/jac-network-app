import Link from "next/link"

import { MemberCard } from "@/components/members/member-card"
import { buttonVariants } from "@/components/ui/button-variants"
import { buildDirectoryQueryString } from "@/lib/directory-params"
import { getDirectoryPageSize } from "@/lib/search"
import { cn } from "@/lib/utils"
import type { DirectoryFilters, MemberProfile } from "@/types/index"

export function MemberGrid({
  members,
  count,
  filters,
}: {
  members: MemberProfile[]
  count: number
  filters: DirectoryFilters & { page: number }
}) {
  const pageSize = getDirectoryPageSize()
  const page = filters.page
  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  const hasPrev = page > 0
  const hasNext = (page + 1) * pageSize < count

  if (members.length === 0) {
    return (
      <div className="border-border bg-muted/30 rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">No members match these filters.</p>
        <p className="text-muted-foreground mt-1 text-xs">Try clearing search or widening filters.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-muted-foreground text-sm">
        {count} member{count === 1 ? "" : "s"}
        {totalPages > 1 ? ` · Page ${page + 1} of ${totalPages}` : null}
      </p>
      <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {members.map((m) => (
          <li key={m.id}>
            <MemberCard member={m} />
          </li>
        ))}
      </ul>
      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2">
          {hasPrev ? (
            <Link
              href={`/directory${buildDirectoryQueryString(filters, { page: page - 1 })}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Previous
            </Link>
          ) : (
            <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50")}>
              Previous
            </span>
          )}
          {hasNext ? (
            <Link
              href={`/directory${buildDirectoryQueryString(filters, { page: page + 1 })}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Next
            </Link>
          ) : (
            <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-50")}>
              Next
            </span>
          )}
        </div>
      ) : null}
    </div>
  )
}
