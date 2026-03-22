import Link from "next/link"

import { LoginForm } from "@/app/(public)/login/login-form"

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-4 py-16">
      <div className="text-center">
        <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
          ← Home
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Log in</h1>
        <p className="text-muted-foreground mt-2 text-sm">Members only. Use the email and password from your invite.</p>
      </div>
      <LoginForm />
    </div>
  )
}
