import type { OpportunityFilters } from "@/types/index"

const TYPES = new Set(["job", "project", "collab", "event"])
const LOC_TYPES = new Set(["remote", "hybrid", "on-site"])

function splitList(value: string | null | undefined): string[] {
  if (!value?.trim()) return []
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export function parseOpportunitySearchParams(
  searchParams: Record<string, string | string[] | undefined>
): OpportunityFilters & { page: number } {
  const get = (key: string): string | undefined => {
    const v = searchParams[key]
    if (Array.isArray(v)) return v[0]
    return v
  }

  const typeRaw = get("type")
  const type = typeRaw && TYPES.has(typeRaw) ? (typeRaw as OpportunityFilters["type"]) : null

  const locationTypeRaw = get("location_type")
  const location_type =
    locationTypeRaw && LOC_TYPES.has(locationTypeRaw)
      ? (locationTypeRaw as OpportunityFilters["location_type"])
      : null

  const pageRaw = get("page")
  const page = Math.max(0, parseInt(pageRaw ?? "0", 10) || 0)

  return {
    type,
    skills: splitList(get("skills")),
    location_type,
    page,
  }
}

export function buildOpportunityQueryString(
  filters: OpportunityFilters & { page?: number },
  overrides?: Partial<OpportunityFilters & { page?: number }>
): string {
  const merged: OpportunityFilters & { page: number } = {
    ...filters,
    ...overrides,
    page: overrides?.page ?? filters.page ?? 0,
  }
  const params = new URLSearchParams()

  if (merged.type) params.set("type", merged.type)
  if (merged.skills.length) params.set("skills", merged.skills.join(","))
  if (merged.location_type) params.set("location_type", merged.location_type)
  if (merged.page > 0) params.set("page", String(merged.page))

  const s = params.toString()
  return s ? `?${s}` : ""
}
