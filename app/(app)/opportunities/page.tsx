import Link from "next/link"

import { OpportunityFilterPanel } from "@/components/opportunities/opportunity-filter-panel"
import { OpportunityGrid } from "@/components/opportunities/opportunity-grid"
import { buttonVariants } from "@/components/ui/button-variants"
import { getSessionAndProfile } from "@/lib/auth"
import { parseOpportunitySearchParams } from "@/lib/opportunity-params"
import { listOpportunities } from "@/lib/opportunities"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const parsed = parseOpportunitySearchParams(sp)
  const { page, ...filters } = parsed

  const [{ opportunities, count }, session] = await Promise.all([
    listOpportunities(filters, page),
    getSessionAndProfile(),
  ])

  const currentUserId = session?.user.id ?? null

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start">
      <OpportunityFilterPanel key={JSON.stringify(parsed)} initial={parsed} />
      <div className="min-w-0 flex-1 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Jobs, projects, collabs, and events from members. Filter by type, skills, and location.
            </p>
          </div>
          <Link href="/opportunities/new" className={cn(buttonVariants({ size: "sm" }))}>
            Post an opportunity
          </Link>
        </div>
        <OpportunityGrid
          opportunities={opportunities}
          count={count}
          filters={parsed}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  )
}
