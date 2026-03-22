import Link from "next/link"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button-variants"
import { getSessionAndProfile } from "@/lib/auth"
import { getMemberByUsername } from "@/lib/search"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const profile = await getMemberByUsername(username)

  if (!profile) {
    notFound()
  }

  const session = await getSessionAndProfile()
  const isOwn = session?.user?.id === profile.id

  const skills = profile.skills ?? []
  const tools = profile.tools ?? []
  const industries = profile.industries ?? []
  const workTypes = profile.work_type ?? []

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Link
          href="/directory"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← Directory
        </Link>
        {isOwn ? (
          <Link href="/profile/edit" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Edit profile
          </Link>
        ) : null}
      </div>

      <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="bg-muted text-muted-foreground flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full text-2xl font-semibold">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            profile.full_name
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase() || "?"
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">{profile.full_name}</h1>
            {profile.is_featured ? (
              <Badge variant="secondary">Featured</Badge>
            ) : null}
          </div>
          <p className="text-muted-foreground">@{profile.username}</p>
          {profile.headline ? (
            <p className="text-lg leading-relaxed">{profile.headline}</p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline" className="capitalize">
              {profile.discipline}
            </Badge>
            {profile.seniority ? (
              <Badge variant="outline" className="capitalize">
                {profile.seniority}
              </Badge>
            ) : null}
            {profile.availability ? (
              <Badge variant="outline" className="capitalize">
                {profile.availability}
              </Badge>
            ) : null}
            {workTypes.map((w) => (
              <Badge key={w} variant="secondary">
                {w}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {profile.bio ? (
        <section>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            About
          </h2>
          <p className="whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
        </section>
      ) : null}

      {profile.location ? (
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground font-medium">Location:</span> {profile.location}
          {profile.timezone ? ` · ${profile.timezone}` : null}
        </p>
      ) : null}

      {(profile.website_url || profile.linkedin_url) && (
        <div className="flex flex-wrap gap-4 text-sm">
          {profile.website_url ? (
            <a
              href={profile.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              Website
            </a>
          ) : null}
          {profile.linkedin_url ? (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              LinkedIn
            </a>
          ) : null}
        </div>
      )}

      {profile.looking_for ? (
        <section>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Looking for
          </h2>
          <p>{profile.looking_for}</p>
        </section>
      ) : null}

      {skills.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Skills
          </h2>
          <ul className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <li key={s}>
                <span className="bg-muted rounded-md px-2 py-1 text-sm">{s}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tools.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Tools
          </h2>
          <ul className="flex flex-wrap gap-2">
            {tools.map((t) => (
              <li key={t}>
                <span className="bg-muted rounded-md px-2 py-1 text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {industries.length > 0 ? (
        <section>
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Industries
          </h2>
          <ul className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <li key={i}>
                <span className="bg-muted rounded-md px-2 py-1 text-sm">{i}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-muted-foreground text-xs">
        Member since {new Date(profile.member_since).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
      </p>
    </div>
  )
}
