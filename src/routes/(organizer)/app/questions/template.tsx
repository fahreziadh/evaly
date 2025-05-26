import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  testId: z.string().optional(),
  selectedSectionId: z.string().optional(),
  referenceId: z.string().optional(),
});
export const Route = createFileRoute("/(organizer)/app/questions/template")({
  component: RouteComponent,
  validateSearch: (search) => searchSchema.parse(search),
});

function RouteComponent() {
  return <div>Hello "/(organizer)/app/questions/template"!</div>;
}
