"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export function SignOutButton() {
  const router = useRouter()
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        await supabase.auth.signOut()
        router.push("/")
        router.refresh()
      }}
    >
      Sign out
    </Button>
  )
}
