import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true
  if (pathname.startsWith("/apply")) return true
  if (pathname.startsWith("/login")) return true
  if (pathname.startsWith("/invite")) return true
  if (pathname.startsWith("/auth")) return true
  return false
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((c) => {
    to.cookies.set(c.name, c.value, c)
  })
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    if (user && pathname.startsWith("/invite")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle()

      if (profile) {
        const redirect = NextResponse.redirect(new URL("/dashboard", request.url))
        copyCookies(supabaseResponse, redirect)
        return redirect
      }
    }
    if (user && pathname.startsWith("/login")) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle()

      if (profile) {
        const redirect = NextResponse.redirect(new URL("/dashboard", request.url))
        copyCookies(supabaseResponse, redirect)
        return redirect
      }
    }
    return supabaseResponse
  }

  if (!user) {
    const redirect = NextResponse.redirect(new URL("/", request.url))
    copyCookies(supabaseResponse, redirect)
    return redirect
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle()

  if (pathname.startsWith("/admin")) {
    if (profile?.role !== "admin") {
      const redirect = NextResponse.redirect(new URL("/dashboard", request.url))
      copyCookies(supabaseResponse, redirect)
      return redirect
    }
    return supabaseResponse
  }

  if (!profile) {
    const redirect = NextResponse.redirect(new URL("/", request.url))
    copyCookies(supabaseResponse, redirect)
    return redirect
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
