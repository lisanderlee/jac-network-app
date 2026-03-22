import { DirectoryFilterPanel } from "@/components/directory/directory-filter-panel"
import { MemberGrid } from "@/components/members/member-grid"
import { parseDirectorySearchParams } from "@/lib/directory-params"
import { searchMembers } from "@/lib/search"
export const dynamic = "force-dynamic"

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const parsed = parseDirectorySearchParams(sp)
  const { page, ...filters } = parsed

  const { members, count } = await searchMembers(filters, page)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start">
      <DirectoryFilterPanel
        key={JSON.stringify(parsed)}
        initial={parsed}
      />
      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Member directory</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Search and filter the network. Profiles are private to members.
          </p>
        </div>
        <MemberGrid members={members} count={count} filters={parsed} />
      </div>
    </div>
  )
}
