"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { approveAndInvite, rejectApplication } from "@/app/admin/applications/[id]/actions"
import { Button } from "@/components/ui/button"

export function ApplicationReviewActions({ applicationId }: { applicationId: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null)

  async function onApprove() {
    setError(null)
    setLoading("approve")
    const result = await approveAndInvite(applicationId)
    setLoading(null)
    if (!result.success) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  async function onReject() {
    setError(null)
    setLoading("reject")
    const result = await rejectApplication(applicationId)
    setLoading(null)
    if (!result.success) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-3 border-t pt-6">
      {error ? <p className="text-destructive text-sm">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled={loading !== null} onClick={onApprove}>
          {loading === "approve" ? "Sending…" : "Approve and send invite"}
        </Button>
        <Button type="button" variant="outline" disabled={loading !== null} onClick={onReject}>
          {loading === "reject" ? "Updating…" : "Reject"}
        </Button>
      </div>
    </div>
  )
}
