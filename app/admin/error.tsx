"use client"

import { useEffect } from "react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-4 py-16 text-center">
      <h2 className="text-lg font-semibold">Admin area error</h2>
      <p className="text-muted-foreground text-sm">{error.message}</p>
      <button
        type="button"
        className="text-primary text-sm font-medium underline-offset-4 hover:underline"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
