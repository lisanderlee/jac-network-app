import Link from "next/link"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-border flex items-center justify-between gap-4 border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold">Admin</span>
          <Link
            href="/admin/applications"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
          >
            Applications
          </Link>
        </div>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          Back to app
        </Link>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  )
}
