"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { createOpportunity } from "@/app/(app)/opportunities/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  opportunityFormSchema,
  type OpportunityFormInput,
  type OpportunityFormValues,
} from "@/lib/validations/opportunity"

const types = ["job", "project", "collab", "event"] as const
const locationTypes = ["remote", "hybrid", "on-site"] as const
const engagements = ["full-time", "part-time", "one-off", "ongoing"] as const

const defaultValues: OpportunityFormInput = {
  title: "",
  type: "project",
  description: "",
  skills_needed: "",
  location_type: "",
  location: "",
  compensation: "",
  engagement: "",
  deadline: "",
}

export function OpportunityForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<OpportunityFormInput, unknown, OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues,
  })

  async function onSubmit(values: OpportunityFormValues) {
    setFormError(null)
    const result = await createOpportunity(values)
    if (!result.success) {
      setFormError(result.error)
      return
    }
    router.push(`/opportunities/${result.data.id}`)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-wrap justify-between gap-2">
        <Link href="/opportunities" className="text-muted-foreground hover:text-foreground text-sm">
          ← Back to board
        </Link>
      </div>

      {formError ? (
        <p className="text-destructive text-sm" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...form.register("title")} placeholder="Short, specific title" />
        {form.formState.errors.title ? (
          <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
            {...form.register("type")}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="engagement">Engagement</Label>
          <select
            id="engagement"
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
            {...form.register("engagement")}
          >
            <option value="">—</option>
            {engagements.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={8}
          placeholder="Scope, timeline expectations, how to get in touch…"
          {...form.register("description")}
        />
        {form.formState.errors.description ? (
          <p className="text-destructive text-sm">{form.formState.errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="skills_needed">Skills needed (comma-separated)</Label>
        <Input id="skills_needed" placeholder="e.g. brand strategy, After Effects" {...form.register("skills_needed")} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="location_type">Work location</Label>
          <select
            id="location_type"
            className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
            {...form.register("location_type")}
          >
            <option value="">—</option>
            {locationTypes.map((lt) => (
              <option key={lt} value={lt}>
                {lt.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location detail</Label>
          <Input id="location" placeholder="City or region (optional)" {...form.register("location")} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="compensation">Compensation</Label>
          <Input id="compensation" placeholder="Day rate, salary range, etc." {...form.register("compensation")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="date" {...form.register("deadline")} />
        </div>
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Posting…" : "Post opportunity"}
      </Button>
    </form>
  )
}
