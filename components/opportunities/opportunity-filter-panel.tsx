"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { buildOpportunityQueryString } from "@/lib/opportunity-params"
import type { OpportunityFilters } from "@/types/index"

const types: NonNullable<OpportunityFilters["type"]>[] = ["job", "project", "collab", "event"]

const locationTypes: NonNullable<OpportunityFilters["location_type"]>[] = ["remote", "hybrid", "on-site"]

export function OpportunityFilterPanel({
  initial,
}: {
  initial: OpportunityFilters & { page: number }
}) {
  const router = useRouter()
  const [type, setType] = useState<string>(initial.type ?? "")
  const [locationType, setLocationType] = useState<string>(initial.location_type ?? "")
  const [skills, setSkills] = useState(initial.skills.join(", "))

  const filterState = useMemo(
    (): OpportunityFilters & { page: number } => ({
      type: type ? (type as NonNullable<OpportunityFilters["type"]>) : null,
      location_type: locationType
        ? (locationType as NonNullable<OpportunityFilters["location_type"]>)
        : null,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      page: 0,
    }),
    [type, locationType, skills]
  )

  function apply() {
    router.push(`/opportunities${buildOpportunityQueryString(filterState)}`)
  }

  function clearAll() {
    setType("")
    setLocationType("")
    setSkills("")
    router.push("/opportunities")
  }

  return (
    <aside className="border-border bg-card w-full shrink-0 space-y-4 rounded-xl border p-4 lg:sticky lg:top-20 lg:w-72">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
          onClick={clearAll}
        >
          Clear
        </button>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="opp-type">Type</Label>
        <select
          id="opp-type"
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Any</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="opp-loc-type">Location</Label>
        <select
          id="opp-loc-type"
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
        >
          <option value="">Any</option>
          {locationTypes.map((lt) => (
            <option key={lt} value={lt}>
              {lt.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="opp-skills">Skills (comma-separated)</Label>
        <Input
          id="opp-skills"
          placeholder="e.g. strategy, motion"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
      </div>

      <Button type="button" className="w-full" onClick={apply}>
        Apply filters
      </Button>
    </aside>
  )
}
