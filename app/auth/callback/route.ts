import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

/**
 * Exchanges Supabase PKCE `code` from the email-confirmation / magic-link redirect
 * into a session cookie, then sends the user to `next` (e.g. back to /invite/[token]).
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/"

  const error = url.searchParams.get("error")
  const errorDescription = url.searchParams.get("error_description")

  if (error || errorDescription) {
    const params = new URLSearchParams()
    if (error) params.set("error", error)
    if (errorDescription) params.set("error_description", errorDescription)
    if (url.searchParams.get("error_code")) {
      params.set("error_code", url.searchParams.get("error_code")!)
    }
    return NextResponse.redirect(`${url.origin}/?${params.toString()}`)
  }

  if (!code) {
    return NextResponse.redirect(url.origin)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
      },
    },
  })

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    const params = new URLSearchParams({
      error: "access_denied",
      error_description: exchangeError.message,
    })
    return NextResponse.redirect(`${url.origin}/?${params.toString()}`)
  }

  const safeNext = next.startsWith("/") ? next : "/"
  return NextResponse.redirect(`${url.origin}${safeNext}`)
}
