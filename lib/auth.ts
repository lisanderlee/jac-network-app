import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { ProfileRole } from "@/types/database.types"

export async function getSessionAndProfile(): Promise<{
  user: { id: string; email?: string | null }
  profile: { id: string; role: ProfileRole } | null
} | null> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle()

  return {
    user: { id: user.id, email: user.email },
    profile: profile as { id: string; role: ProfileRole } | null,
  }
}

export async function assertAdmin(): Promise<{ userId: string }> {
  const session = await getSessionAndProfile()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  if (session.profile?.role !== "admin") {
    throw new Error("Forbidden")
  }
  return { userId: session.user.id }
}
