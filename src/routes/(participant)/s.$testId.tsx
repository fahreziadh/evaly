import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(participant)/s/$testId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { testId } = Route.useParams();
  return <div>{testId}</div>;
}
