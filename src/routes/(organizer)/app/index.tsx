import CardTest from "@/components/shared/card-test";
import DialogCreateTest from "@/components/shared/dialog-create-test";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/(organizer)/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const data = useQuery(api.organizer.test.getTests);

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
      <Tabs className="dashboard-margin mb-2" defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="finished">Finished</TabsTrigger>
        </TabsList>
      </Tabs>

      {data && data.length > 0 ? (
        <div className="flex flex-col border divide-y rounded-lg overflow-clip">
          {data.map((e) => (
            <CardTest data={e} key={e._id} />
          ))}
        </div>
      ) : null}

      {data?.length === 0 ? (
        <div className="flex flex-col text-start justify-center border p-6 rounded-lg">
          <h1 className="text-xl font-medium">No tests yet</h1>
          <h2 className="max-w-md mt-2 text-muted-foreground mb-4">
            Create a new test to get started
          </h2>
          <DialogCreateTest />
        </div>
      ) : null}

      {/* Loading */}
      {data === undefined ? (
        <div className="flex flex-col min-h-dvh gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full " />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : null}
    </div>
  );
}
