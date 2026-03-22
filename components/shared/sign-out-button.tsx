"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useBrowserSupabaseClient } from "@/lib/supabase/client"

export function SignOutButton() {
  const router = useRouter()
  const supabase = useBrowserSupabaseClient()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={!supabase}
      onClick={async () => {
        if (!supabase) return
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
      }}
    >
      Sign out
    </Button>
  )
}
