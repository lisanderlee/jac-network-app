"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { buildDirectoryQueryString } from "@/lib/directory-params"
import type { DirectoryFilters } from "@/types/index"

const disciplines = [
  "creative",
  "strategy",
  "technology",
  "production",
  "marketing",
] as const

const availabilities: NonNullable<DirectoryFilters["availability"]>[] = [
  "available",
  "open",
  "unavailable",
]

const workTypes: NonNullable<DirectoryFilters["work_type"]>[] = [
  "freelance",
  "full-time",
  "consulting",
  "advisory",
]

export function DirectoryFilterPanel({
  initial,
}: {
  initial: DirectoryFilters & { page: number }
}) {
  const router = useRouter()
  const [query, setQuery] = useState(initial.query)
  const [discipline, setDiscipline] = useState<string>(initial.discipline ?? "")
  const [availability, setAvailability] = useState<string>(initial.availability ?? "")
  const [workType, setWorkType] = useState<string>(initial.work_type ?? "")
  const [skills, setSkills] = useState(initial.skills.join(", "))
  const [tools, setTools] = useState(initial.tools.join(", "))
  const [location, setLocation] = useState(initial.location ?? "")

  const filterState = useMemo(
    (): DirectoryFilters & { page: number } => ({
      query: query.trim(),
      discipline: discipline
        ? (discipline as NonNullable<DirectoryFilters["discipline"]>)
        : null,
      availability: availability
        ? (availability as NonNullable<DirectoryFilters["availability"]>)
        : null,
      work_type: workType ? (workType as NonNullable<DirectoryFilters["work_type"]>) : null,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tools: tools
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      location: location.trim() || null,
      page: 0,
    }),
    [query, discipline, availability, workType, skills, tools, location]
  )

  function apply() {
    const qs = buildDirectoryQueryString(filterState)
    router.push(`/directory${qs}`)
  }

  function clearAll() {
    setQuery("")
    setDiscipline("")
    setAvailability("")
    setWorkType("")
    setSkills("")
    setTools("")
    setLocation("")
    router.push("/directory")
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
        <Label htmlFor="dir-q">Search</Label>
        <Input
          id="dir-q"
          placeholder="Name, skills, bio…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dir-discipline">Discipline</Label>
        <select
          id="dir-discipline"
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
        >
          <option value="">Any</option>
          {disciplines.map((d) => (
            <option key={d} value={d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dir-availability">Availability</Label>
        <select
          id="dir-availability"
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="">Any</option>
          {availabilities.map((a) => (
            <option key={a} value={a}>
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dir-work">Work type</Label>
        <select
          id="dir-work"
          className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        >
          <option value="">Any</option>
          {workTypes.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dir-skills">Skills (comma-separated)</Label>
        <Input
          id="dir-skills"
          placeholder="e.g. strategy, motion"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dir-tools">Tools (comma-separated)</Label>
        <Input
          id="dir-tools"
          placeholder="e.g. Figma, After Effects"
          value={tools}
          onChange={(e) => setTools(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dir-loc">Location</Label>
        <Input
          id="dir-loc"
          placeholder="City or region"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && apply()}
        />
      </div>

      <Button type="button" className="w-full" onClick={apply}>
        Apply filters
      </Button>
    </aside>
  )
}
