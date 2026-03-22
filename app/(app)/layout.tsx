import { AppNav } from "@/components/shared/app-nav"
import { getSessionAndProfile } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionAndProfile()
  const isAdmin = session?.profile?.role === "admin"

  return (
    <div className="flex min-h-full flex-col">
      <AppNav isAdmin={isAdmin} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
