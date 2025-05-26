import { api } from '@convex/_generated/api'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { FileSpreadsheet } from 'lucide-react'

import CardTest from '@/components/shared/card-test'
import DialogCreateTest from '@/components/shared/dialog-create-test'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/(organizer)/app/')({
  component: RouteComponent
})

function RouteComponent() {
  const data = useQuery(api.organizer.test.getTests)

  if (data?.length === 0) {
    return (
      <div className="mt-[30vh] flex flex-col items-center justify-center text-center">
        <FileSpreadsheet className="text-muted-foreground mb-6 size-16" />
        <h1 className="text-xl font-medium">No tests yet</h1>
        <h2 className="text-muted-foreground mt-2 mb-4 max-w-md">
          Create a new test to get started
        </h2>
        <DialogCreateTest />
      </div>
    )
  }
  return (
    <div>
      <div className="flex flex-row items-start justify-between">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-description">
            Welcome to the dashboard. Here you can create and manage your tests.
          </p>
        </div>
        {data && data.length > 0 ? <DialogCreateTest /> : null}
      </div>

      {data && data.length > 0 ? (
        <div className="mt-10 flex min-h-dvh flex-col gap-4">
          {data.map(e => (
            <CardTest data={e} key={e._id} />
          ))}
        </div>
      ) : null}

      {/* Loading */}
      {data === undefined ? (
        <div className="mt-10 flex min-h-dvh flex-col gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : null}
    </div>
  )
}
