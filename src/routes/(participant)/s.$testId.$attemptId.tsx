import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(participant)/s/$testId/$attemptId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { attemptId } = Route.useParams();
  return <div>{attemptId}</div>;
}