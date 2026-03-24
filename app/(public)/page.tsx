import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

function parseAuthErrorDescription(
  sp: Record<string, string | string[] | undefined>
): string | null {
  const raw = sp.error_description
  const s = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : null
  if (!s) return null
  try {
    return decodeURIComponent(s.replace(/\+/g, " "))
  } catch {
    return s.replace(/\+/g, " ")
  }
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const authErrorDesc = parseAuthErrorDescription(sp)
  const authErrorCode = typeof sp.error_code === "string" ? sp.error_code : undefined
  const showAuthError = Boolean(sp.error || authErrorDesc)

  return (
    <div className="flex flex-1 flex-col">
      {showAuthError ? (
        <div
          className="border-destructive/30 bg-destructive/10 text-destructive border-b px-6 py-3 text-center text-sm"
          role="alert"
        >
          <p className="font-medium">Email link issue</p>
          <p className="text-destructive/90 mt-1 max-w-2xl mx-auto">
            {authErrorCode === "otp_expired"
              ? "This confirmation link expired or was already used. Go back to your invite page and try creating your account again, or log in if you already confirmed your email."
              : authErrorDesc ??
                "Something went wrong with the sign-in link. Request a new invite or try logging in."}
          </p>
        </div>
      ) : null}
      <header className="border-border flex items-center justify-between gap-4 border-b px-6 py-4">
        <span className="text-sm font-semibold tracking-tight">JAC Network</span>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: "outline" }))}>
            Log in
          </Link>
          <Link href="/apply" className={cn(buttonVariants())}>
            Apply to join
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <p className="text-muted-foreground max-w-xl text-sm font-medium uppercase tracking-widest">
          Private talent network
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
          Discover collaborators across advertising, marketing, and technology.
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
          A curated, members-only community. Request access — we review every application.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/apply" className={cn(buttonVariants({ size: "lg" }))}>
            Request an invite
          </Link>
          <Link href="/apply" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Apply
          </Link>
        </div>
      </main>
    </div>
  )
}
