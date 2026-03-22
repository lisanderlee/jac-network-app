import Link from "next/link"

import { SignOutButton } from "@/components/shared/sign-out-button"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/directory", label: "Directory" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/profile/edit", label: "Profile" },
] as const

export function AppNav({ isAdmin }: { isAdmin: boolean }) {
  return (
    <header className="border-border bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-6">
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
          JAC Network
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link
              href="/admin/applications"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-foreground")}
            >
              Admin
            </Link>
          ) : null}
        </nav>
      </div>
      <SignOutButton />
    </header>
  )
}
