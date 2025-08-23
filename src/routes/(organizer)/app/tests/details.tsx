import TestsDetails from "@/components/pages/test-details";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  testId: z.string().catch(""),
  tabs: z
    .enum(["questions", "results", "settings", "share"]).default("questions"),
  resultsTab: z.enum(["leaderboard", "submission", "summary"]).optional().default("leaderboard"),
  selectedSection: z.string().optional(),
});

export const Route = createFileRoute("/(organizer)/app/tests/details")({
  component: TestsDetails,
  validateSearch: (search) => searchSchema.parse(search),
});
