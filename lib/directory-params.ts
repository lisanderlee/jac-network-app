import type { DirectoryFilters } from "@/types/index"

const DISCIPLINES = new Set([
  "creative",
  "strategy",
  "technology",
  "production",
  "marketing",
])
const AVAIL = new Set(["available", "open", "unavailable"])
const WORK_TYPES = new Set(["freelance", "full-time", "consulting", "advisory"])

function splitList(value: string | null | undefined): string[] {
  if (!value?.trim()) return []
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export function parseDirectorySearchParams(
  searchParams: Record<string, string | string[] | undefined>
): DirectoryFilters & { page: number } {
  const get = (key: string): string | undefined => {
    const v = searchParams[key]
    if (Array.isArray(v)) return v[0]
    return v
  }

  const disciplineRaw = get("discipline")
  const discipline =
    disciplineRaw && DISCIPLINES.has(disciplineRaw) ? (disciplineRaw as DirectoryFilters["discipline"]) : null

  const availabilityRaw = get("availability")
  const availability =
    availabilityRaw && AVAIL.has(availabilityRaw)
      ? (availabilityRaw as DirectoryFilters["availability"])
      : null

  const workTypeRaw = get("work_type")
  const work_type =
    workTypeRaw && WORK_TYPES.has(workTypeRaw) ? (workTypeRaw as DirectoryFilters["work_type"]) : null

  const pageRaw = get("page")
  const page = Math.max(0, parseInt(pageRaw ?? "0", 10) || 0)

  return {
    query: get("q")?.trim() ?? "",
    discipline,
    availability,
    work_type,
    skills: splitList(get("skills")),
    tools: splitList(get("tools")),
    location: get("location")?.trim() || null,
    page,
  }
}

export function buildDirectoryQueryString(
  filters: DirectoryFilters & { page?: number },
  overrides?: Partial<DirectoryFilters & { page?: number }>
): string {
  const merged: DirectoryFilters & { page: number } = {
    ...filters,
    ...overrides,
    page: overrides?.page ?? filters.page ?? 0,
  }
  const params = new URLSearchParams()

  if (merged.query) params.set("q", merged.query)
  if (merged.discipline) params.set("discipline", merged.discipline)
  if (merged.availability) params.set("availability", merged.availability)
  if (merged.work_type) params.set("work_type", merged.work_type)
  if (merged.skills.length) params.set("skills", merged.skills.join(","))
  if (merged.tools.length) params.set("tools", merged.tools.join(","))
  if (merged.location) params.set("location", merged.location)
  if (merged.page > 0) params.set("page", String(merged.page))

  const s = params.toString()
  return s ? `?${s}` : ""
}
