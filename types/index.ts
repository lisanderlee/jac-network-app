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

export type OpportunityType = "job" | "project" | "collab" | "event"

export type OpportunityLocationType = "remote" | "hybrid" | "on-site"

export type OpportunityEngagement = "full-time" | "part-time" | "one-off" | "ongoing"

export interface Opportunity {
  id: string
  posted_by: string
  title: string
  type: string
  description: string
  skills_needed: string[] | null
  location_type: string | null
  location: string | null
  compensation: string | null
  engagement: string | null
  deadline: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface OpportunityWithPoster extends Opportunity {
  poster_username: string | null
  poster_full_name: string | null
}

export interface OpportunityFilters {
  type: OpportunityType | null
  skills: string[]
  location_type: OpportunityLocationType | null
}
