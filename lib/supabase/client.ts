"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

export function createBrowserSupabaseClient(): SupabaseClient {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}

/**
 * Browser Supabase client, created only after mount. Use this instead of
 * calling createBrowserSupabaseClient in useMemo so static prerender / SSR
 * never reads NEXT_PUBLIC_* env (avoids build failures when env is only
 * available at runtime, and matches client-only Supabase usage).
 */
export function useBrowserSupabaseClient(): SupabaseClient | null {
  const [client, setClient] = useState<SupabaseClient | null>(null)
  useEffect(() => {
    setClient(createBrowserSupabaseClient())
  }, [])
  return client
}
