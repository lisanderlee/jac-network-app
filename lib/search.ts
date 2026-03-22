import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { DirectoryFilters, MemberProfile } from "@/types/index"

const PAGE_SIZE = 24

export function getDirectoryPageSize(): number {
  return PAGE_SIZE
}

export async function searchMembers(
  filters: DirectoryFilters,
  page = 0,
  pageSize = PAGE_SIZE
): Promise<{ members: MemberProfile[]; count: number }> {
  const supabase = await createServerSupabaseClient()

  const selectCols =
    "id, username, full_name, headline, bio, avatar_url, location, timezone, website_url, linkedin_url, discipline, seniority, work_type, availability, skills, tools, industries, looking_for, is_featured, member_since"

  let query = supabase
    .from("profiles")
    .select(selectCols, { count: "exact" })
    .range(page * pageSize, (page + 1) * pageSize - 1)
    .order("is_featured", { ascending: false })
    .order("member_since", { ascending: false })

  if (filters.query.trim()) {
    query = query.textSearch("search_vector", filters.query, {
      type: "websearch",
      config: "english",
    })
  }

  if (filters.discipline) {
    query = query.eq("discipline", filters.discipline)
  }
  if (filters.availability) {
    query = query.eq("availability", filters.availability)
  }
  if (filters.work_type) {
    query = query.contains("work_type", [filters.work_type])
  }
  if (filters.skills.length > 0) {
    query = query.overlaps("skills", filters.skills)
  }
  if (filters.tools.length > 0) {
    query = query.overlaps("tools", filters.tools)
  }
  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`)
  }

  const { data, count, error } = await query

  if (error) throw error

  return { members: (data ?? []) as MemberProfile[], count: count ?? 0 }
}

export async function getMemberByUsername(username: string): Promise<MemberProfile | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, username, full_name, headline, bio, avatar_url, location, timezone, website_url, linkedin_url, discipline, seniority, work_type, availability, skills, tools, industries, looking_for, is_featured, member_since"
    )
    .eq("username", username)
    .maybeSingle()

  if (error) throw error
  return data as MemberProfile | null
}
