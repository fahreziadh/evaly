import LoadingScreen from "@/components/shared/loading-screen";
import usePresence from "@/hooks/presence/use-presence";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { DataModel } from "@convex/_generated/dataModel";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/(participant)/s/$testId/$attemptId")({
  component: RouteComponent,
  pendingComponent: LoadingScreen,
});

function RouteComponent() {
  const user = useQuery(api.participant.profile.getProfile);

  // const [] = usePresence(testId, )

  if (user === undefined) {
    return <LoadingScreen />;
  }

  if (user === null) {
    return notFound();
  }

  return <AttemptPage user={user} />;
}

const AttemptPage = ({ user }: { user: DataModel["users"]["document"] }) => {
  const { attemptId, testId } = Route.useParams();
  const [data, presence, updateData] = usePresence(testId as Id<"test">, user._id, {})

  return <div>{JSON.stringify({ data, presence })}</div>;
};
