"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { completeInviteProfile } from "@/app/(public)/invite/[token]/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBrowserSupabaseClient } from "@/lib/supabase/client"

type InvitePreview = {
  full_name: string
  email: string
  headline: string
  discipline: string
}

export function InviteClient({
  token,
  application,
}: {
  token: string
  application: InvitePreview
}) {
  const router = useRouter()
  const supabase = useBrowserSupabaseClient()
  const [step, setStep] = useState<"account" | "profile">("account")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState(application.full_name)
  const [headline, setHeadline] = useState(application.headline)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setStep("profile")
      }
    })
  }, [supabase])

  async function onCreateAccount(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (!supabase) {
      setError("Still loading. Try again in a moment.")
      return
    }

    setLoading(true)
    const { error: signError } = await supabase.auth.signUp({
      email: application.email,
      password,
    })
    setLoading(false)

    if (signError) {
      setError(signError.message)
      return
    }

    setStep("profile")
    router.refresh()
  }

  async function onCompleteProfile(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await completeInviteProfile(token, {
      username: username.trim(),
      full_name: fullName.trim(),
      headline: headline.trim(),
    })
    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    router.push("/directory")
    router.refresh()
  }

  if (step === "account") {
    return (
      <form onSubmit={onCreateAccount} className="mx-auto flex max-w-md flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold">Create your account</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Use the email address this invite was sent to.
          </p>
        </div>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={application.email} disabled readOnly />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading || !supabase}>
          {loading ? "Creating account…" : "Continue"}
        </Button>
      </form>
    )
  }

  return (
    <form onSubmit={onCompleteProfile} className="mx-auto flex max-w-md flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Your profile</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Choose a username and confirm how you appear to members.
        </p>
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          placeholder="your_handle"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
      </div>

      <p className="text-muted-foreground text-xs capitalize">Discipline: {application.discipline}</p>

      <Button type="submit" disabled={loading || !supabase}>
        {loading ? "Saving…" : "Finish and go to directory"}
      </Button>
    </form>
  )
}
