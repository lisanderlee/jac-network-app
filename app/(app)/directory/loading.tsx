import { Card } from "@/components/ui/card"

export default function DirectoryLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row">
      <div className="bg-muted/50 h-96 w-full shrink-0 animate-pulse rounded-xl lg:w-72" />
      <div className="min-w-0 flex-1 space-y-4">
        <div className="bg-muted/50 h-8 w-48 animate-pulse rounded-md" />
        <div className="bg-muted/50 h-4 w-full max-w-md animate-pulse rounded-md" />
        <ul className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <Card className="p-4">
                <div className="flex gap-4">
                  <div className="bg-muted size-14 shrink-0 animate-pulse rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-full animate-pulse rounded" />
                    <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
