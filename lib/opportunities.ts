import { createAdminClient } from "@/lib/supabase/admin"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Opportunity, OpportunityFilters, OpportunityWithPoster } from "@/types/index"

const PAGE_SIZE = 20

const selectCols =
  "id, posted_by, title, type, description, skills_needed, location_type, location, compensation, engagement, deadline, is_active, created_at, updated_at"

export function getOpportunityPageSize(): number {
  return PAGE_SIZE
}

function attachPosters<T extends Opportunity>(
  rows: T[],
  posters: { id: string; username: string; full_name: string }[]
): OpportunityWithPoster[] {
  const map = new Map(posters.map((p) => [p.id, p]))
  return rows.map((row) => {
    const p = map.get(row.posted_by)
    return {
      ...row,
      poster_username: p?.username ?? null,
      poster_full_name: p?.full_name ?? null,
    }
  })
}

export async function listOpportunities(
  filters: OpportunityFilters,
  page = 0,
  pageSize = PAGE_SIZE
): Promise<{ opportunities: OpportunityWithPoster[]; count: number }> {
  const supabase = await createServerSupabaseClient()

  let query = supabase
    .from("opportunities")
    .select(selectCols, { count: "exact" })
    .eq("is_active", true)
    .range(page * pageSize, (page + 1) * pageSize - 1)
    .order("created_at", { ascending: false })

  if (filters.type) {
    query = query.eq("type", filters.type)
  }
  if (filters.location_type) {
    query = query.eq("location_type", filters.location_type)
  }
  if (filters.skills.length > 0) {
    query = query.overlaps("skills_needed", filters.skills)
  }

  const { data, count, error } = await query

  if (error) throw error

  const rows = (data ?? []) as Opportunity[]
  const posterIds = [...new Set(rows.map((r) => r.posted_by))]

  if (posterIds.length === 0) {
    return { opportunities: [], count: count ?? 0 }
  }

  const { data: profiles, error: pe } = await supabase
    .from("profiles")
    .select("id, username, full_name")
    .in("id", posterIds)

  if (pe) throw pe

  const opportunities = attachPosters(rows, (profiles ?? []) as { id: string; username: string; full_name: string }[])

  return { opportunities, count: count ?? 0 }
}

export async function getOpportunityById(id: string): Promise<OpportunityWithPoster | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from("opportunities").select(selectCols).eq("id", id).maybeSingle()

  if (error) throw error
  if (!data) return null

  const row = data as Opportunity
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name")
    .eq("id", row.posted_by)
    .maybeSingle()

  const p = profile as { username: string; full_name: string } | null

  return {
    ...row,
    poster_username: p?.username ?? null,
    poster_full_name: p?.full_name ?? null,
  }
}

/** Service role — for cron / digest only (no user session). */
export async function listRecentActiveOpportunitiesForDigest(
  sinceIso: string
): Promise<Pick<Opportunity, "id" | "title" | "type" | "created_at">[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("opportunities")
    .select("id, title, type, created_at")
    .eq("is_active", true)
    .gte("created_at", sinceIso)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as Pick<Opportunity, "id" | "title" | "type" | "created_at">[]
}
