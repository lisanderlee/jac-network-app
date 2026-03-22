"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { updateProfile } from "@/app/(app)/profile/edit/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  profileEditSchema,
  type ProfileEditInput,
  type ProfileEditValues,
} from "@/lib/validations/profile"

const disciplines = ["creative", "strategy", "technology", "production", "marketing"] as const

const workTypes = ["freelance", "full-time", "consulting", "advisory"] as const

export function ProfileEditForm({
  initialUsername,
  defaultValues,
}: {
  initialUsername: string
  defaultValues: ProfileEditInput
}) {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<ProfileEditInput, unknown, ProfileEditValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues,
  })

  const selectedWork = form.watch("work_type") ?? []

  async function onSubmit(values: ProfileEditValues) {
    setFormError(null)
    const result = await updateProfile(values)
    if (!result.success) {
      setFormError(result.error)
      return
    }
    if (result.data.username !== initialUsername) {
      router.push(`/directory/${result.data.username}`)
    } else {
      router.refresh()
    }
  }

  function toggleWorkType(w: (typeof workTypes)[number]) {
    const current = form.getValues("work_type") ?? []
    if (current.includes(w)) {
      form.setValue(
        "work_type",
        current.filter((x) => x !== w)
      )
    } else {
      form.setValue("work_type", [...current, w])
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href={`/directory/${initialUsername}`} className="text-muted-foreground hover:text-foreground text-sm">
          ← View profile
        </Link>
        <Link href="/directory" className="text-muted-foreground hover:text-foreground text-sm">
          Directory
        </Link>
      </div>

      {formError ? (
        <p className="text-destructive text-sm" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" autoComplete="username" {...form.register("username")} />
          {form.formState.errors.username ? (
            <p className="text-destructive text-sm">{form.formState.errors.username.message}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" autoComplete="name" {...form.register("full_name")} />
          {form.formState.errors.full_name ? (
            <p className="text-destructive text-sm">{form.formState.errors.full_name.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" placeholder="One line about what you do" {...form.register("headline")} />
        {form.formState.errors.headline ? (
          <p className="text-destructive text-sm">{form.formState.errors.headline.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={5} {...form.register("bio")} />
        {form.formState.errors.bio ? (
          <p className="text-destructive text-sm">{form.formState.errors.bio.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input id="avatar_url" type="url" placeholder="https://…" {...form.register("avatar_url")} />
        {form.formState.errors.avatar_url ? (
          <p className="text-destructive text-sm">{form.formState.errors.avatar_url.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...form.register("location")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input id="timezone" placeholder="e.g. America/New_York" {...form.register("timezone")} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="website_url">Website</Label>
          <Input id="website_url" type="url" {...form.register("website_url")} />
          {form.formState.errors.website_url ? (
            <p className="text-destructive text-sm">{form.formState.errors.website_url.message}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="linkedin_url">LinkedIn</Label>
          <Input id="linkedin_url" type="url" {...form.register("linkedin_url")} />
          {form.formState.errors.linkedin_url ? (
            <p className="text-destructive text-sm">{form.formState.errors.linkedin_url.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="discipline">Discipline</Label>
          <select
            id="discipline"
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
            {...form.register("discipline")}
          >
            {disciplines.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="seniority">Seniority</Label>
          <select
            id="seniority"
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
            {...form.register("seniority")}
          >
            <option value="">—</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="executive">Executive</option>
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="availability">Availability</Label>
        <select
          id="availability"
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          {...form.register("availability")}
        >
          <option value="available">Available</option>
          <option value="open">Open</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium">Work type</legend>
        <div className="flex flex-wrap gap-3">
          {workTypes.map((w) => (
            <label key={w} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedWork.includes(w)}
                onChange={() => toggleWorkType(w)}
              />
              {w}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Textarea id="skills" rows={2} placeholder="strategy, motion, brand" {...form.register("skills")} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tools">Tools (comma-separated)</Label>
        <Textarea id="tools" rows={2} placeholder="Figma, After Effects" {...form.register("tools")} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="industries">Industries (comma-separated)</Label>
        <Textarea id="industries" rows={2} {...form.register("industries")} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="looking_for">Looking for</Label>
        <Textarea id="looking_for" rows={3} {...form.register("looking_for")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Saving…" : "Save profile"}
      </Button>
    </form>
  )
}
