"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { submitApplication } from "@/app/(public)/apply/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  applicationFormSchema,
  type ApplicationFormValues,
} from "@/lib/validations/application"

const disciplines = [
  "creative",
  "strategy",
  "technology",
  "production",
  "marketing",
] as const

export function ApplicationForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      email: "",
      full_name: "",
      linkedin_url: "",
      website_url: "",
      discipline: "creative",
      headline: "",
      motivation: "",
      referral: "",
    },
  })

  async function onSubmit(values: ApplicationFormValues) {
    setFormError(null)
    const result = await submitApplication(values)
    if (!result.success) {
      setFormError(result.error)
      return
    }
    router.push("/apply/success")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex max-w-lg flex-col gap-6">
      {formError ? (
        <p className="text-destructive text-sm" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" autoComplete="name" {...form.register("full_name")} />
        {form.formState.errors.full_name ? (
          <p className="text-destructive text-sm">{form.formState.errors.full_name.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="linkedin_url">LinkedIn URL (optional)</Label>
        <Input id="linkedin_url" type="url" {...form.register("linkedin_url")} />
        {form.formState.errors.linkedin_url ? (
          <p className="text-destructive text-sm">{form.formState.errors.linkedin_url.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="website_url">Website (optional)</Label>
        <Input id="website_url" type="url" {...form.register("website_url")} />
        {form.formState.errors.website_url ? (
          <p className="text-destructive text-sm">{form.formState.errors.website_url.message}</p>
        ) : null}
      </div>

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
        {form.formState.errors.discipline ? (
          <p className="text-destructive text-sm">{form.formState.errors.discipline.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="headline">What do you do in one sentence?</Label>
        <Input id="headline" {...form.register("headline")} />
        {form.formState.errors.headline ? (
          <p className="text-destructive text-sm">{form.formState.errors.headline.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="motivation">Why do you want to join?</Label>
        <Textarea id="motivation" rows={5} {...form.register("motivation")} />
        {form.formState.errors.motivation ? (
          <p className="text-destructive text-sm">{form.formState.errors.motivation.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="referral">How did you hear about us? (optional)</Label>
        <Input id="referral" {...form.register("referral")} />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  )
}
