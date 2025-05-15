import CardTest from "@/components/shared/card-test";
import DialogCreateTest from "@/components/shared/dialog-create-test";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = useQuery(api.organizer.test.getTests);

  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-[30vh] text-center">
        <FileSpreadsheet className="size-16 text-muted-foreground mb-6" />
        <h1 className="text-xl font-medium">No tests yet</h1>
        <h2 className="max-w-md mt-2 text-muted-foreground mb-4">
          Create a new test to get started
        </h2>
        <DialogCreateTest />
      </div>
    );
  }
  return (
    <div className="container dashboard-margin">
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
        <div className="flex flex-col mt-10 min-h-dvh gap-4">
          {data.map((e) => (
            <CardTest data={e} key={e._id} />
          ))}
        </div>
      ) : null}

      {/* Loading */}
      {data === undefined ? (
        <div className="flex flex-col mt-10 min-h-dvh gap-4">
          <Skeleton className="h-20 w-full bg-card border" />
          <Skeleton className="h-20 w-full bg-card border" />
          <Skeleton className="h-20 w-full bg-card border" />
          <Skeleton className="h-20 w-full bg-card border" />
          <Skeleton className="h-20 w-full bg-card border" />
        </div>
      ) : null}
    </div>
  );
}
