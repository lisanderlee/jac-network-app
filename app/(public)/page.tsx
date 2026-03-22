import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
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
