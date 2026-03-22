import Link from "next/link"

import { ApplicationForm } from "@/app/(public)/apply/application-form"

export default function ApplyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16">
      <div>
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Apply to join</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Tell us about yourself. We review every application.
        </p>
      </div>
      <ApplicationForm />
    </div>
  )
}
