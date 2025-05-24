import LoadingScreen from "@/components/shared/loading-screen";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  testId: z.string().optional(),
  selectedSectionId: z.string().optional(),
  questionId: z.string().catch(""),
});

export const Route = createFileRoute("/(organizer)/app/questions/details")({
  component: lazyRouteComponent(
    () => import("@/components/pages/question-details")
  ),
  pendingComponent:LoadingScreen,
  validateSearch: (search) => searchSchema.parse(search),
});
