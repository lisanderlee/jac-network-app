import { redirect } from "next/navigation"

import { ProfileEditForm } from "@/app/(app)/profile/edit/profile-edit-form"
import { getSessionAndProfile } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { ProfileEditInput } from "@/lib/validations/profile"

export const dynamic = "force-dynamic"

export default async function ProfileEditPage() {
  const session = await getSessionAndProfile()
  if (!session?.user) {
    redirect("/")
  }

  const supabase = await createServerSupabaseClient()
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "username, full_name, headline, bio, avatar_url, location, timezone, website_url, linkedin_url, discipline, seniority, availability, work_type, skills, tools, industries, looking_for"
    )
    .eq("id", session.user.id)
    .single()

  if (error || !profile) {
    redirect("/")
  }

  const defaultValues: ProfileEditInput = {
    username: profile.username,
    full_name: profile.full_name,
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    avatar_url: profile.avatar_url ?? "",
    location: profile.location ?? "",
    timezone: profile.timezone ?? "",
    website_url: profile.website_url ?? "",
    linkedin_url: profile.linkedin_url ?? "",
    discipline: profile.discipline as ProfileEditInput["discipline"],
    seniority: (profile.seniority ?? "") as ProfileEditInput["seniority"],
    availability: profile.availability as ProfileEditInput["availability"],
    work_type: (profile.work_type ?? []) as ProfileEditInput["work_type"],
    skills: (profile.skills ?? []).join(", "),
    tools: (profile.tools ?? []).join(", "),
    industries: (profile.industries ?? []).join(", "),
    looking_for: profile.looking_for ?? "",
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update how you appear in the member directory. Comma-separated lists become tags for search.
        </p>
      </div>
      <ProfileEditForm initialUsername={profile.username} defaultValues={defaultValues} />
    </div>
  )
}
