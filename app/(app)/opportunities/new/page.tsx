import { OpportunityForm } from "@/app/(app)/opportunities/new/opportunity-form"

export default function NewOpportunityPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Post an opportunity</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Share roles, projects, collaborations, or events with the network. Listings can be marked filled when
          closed.
        </p>
      </div>
      <OpportunityForm />
    </div>
  )
}
