export type ProfileRole = "member" | "admin"

export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "invited"
  | "completed"

export interface ProfileRow {
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
  role: ProfileRole
  is_featured: boolean
  member_since: string
  updated_at: string
}

export interface ApplicationRow {
  id: string
  email: string
  full_name: string
  linkedin_url: string | null
  website_url: string | null
  discipline: string
  headline: string
  motivation: string
  referral: string | null
  status: ApplicationStatus
  reviewed_by: string | null
  reviewed_at: string | null
  invite_token: string | null
  invite_sent_at: string | null
  invite_expires_at: string | null
  created_at: string
}

export interface OpportunityRow {
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
