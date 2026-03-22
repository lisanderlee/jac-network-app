import Link from "next/link"

export default function ApplySuccessPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Application received</h1>
      <p className="text-muted-foreground text-lg">
        Thanks for applying. If you are a fit, you will receive an invitation by email.
      </p>
      <Link href="/" className="text-primary font-medium underline-offset-4 hover:underline">
        Back to home
      </Link>
    </div>
  )
}
