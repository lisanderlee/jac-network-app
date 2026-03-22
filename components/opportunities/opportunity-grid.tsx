import Link from "next/link"

import { OpportunityCard } from "@/components/opportunities/opportunity-card"
import { buttonVariants } from "@/components/ui/button-variants"
import { buildOpportunityQueryString } from "@/lib/opportunity-params"
import { getOpportunityPageSize } from "@/lib/opportunities"
import { cn } from "@/lib/utils"
import type { OpportunityFilters, OpportunityWithPoster } from "@/types/index"

export function OpportunityGrid({
  opportunities,
  count,
  filters,
  currentUserId,
}: {
  opportunities: OpportunityWithPoster[]
  count: number
  filters: OpportunityFilters & { page: number }
  currentUserId: string | null
}) {
  const pageSize = getOpportunityPageSize()
  const page = filters.page
  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  const hasPrev = page > 0
  const hasNext = (page + 1) * pageSize < count

  if (opportunities.length === 0) {
    return (
      <div className="border-border bg-muted/30 rounded-xl border border-dashed p-12 text-center">
        <p className="text-muted-foreground text-sm">No opportunities match these filters.</p>
        <p className="text-muted-foreground mt-1 text-xs">Try clearing filters or post a new listing.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-muted-foreground text-sm">
        {count} listing{count === 1 ? "" : "s"}
        {totalPages > 1 ? ` · Page ${page + 1} of ${totalPages}` : null}
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {opportunities.map((o) => (
          <li key={o.id}>
            <OpportunityCard opportunity={o} currentUserId={currentUserId} />
          </li>
        ))}
      </ul>
      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2">
          {hasPrev ? (
            <Link
              href={`/opportunities${buildOpportunityQueryString(filters, { page: page - 1 })}`}
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
              href={`/opportunities${buildOpportunityQueryString(filters, { page: page + 1 })}`}
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
