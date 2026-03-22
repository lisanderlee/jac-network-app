export type Discipline = "creative" | "strategy" | "technology" | "production" | "marketing"

export type Availability = "available" | "open" | "unavailable"

export type WorkType = "freelance" | "full-time" | "consulting" | "advisory"

export interface MemberProfile {
  id: string
  username: string
  full_name: string
  headline: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  timezone: string | null
  website_url: string | null
  linkedin_url: string | null
  discipline: string
  seniority: string | null
  work_type: string[] | null
  availability: string | null
  skills: string[] | null
  tools: string[] | null
  industries: string[] | null
  looking_for: string | null
  is_featured: boolean
  member_since: string
}

export interface DirectoryFilters {
  query: string
  discipline: Discipline | null
  availability: Availability | null
  work_type: WorkType | null
  skills: string[]
  tools: string[]
  location: string | null
}
