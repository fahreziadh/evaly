import TestsDetails from "@/components/pages/test-details";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  testId: z.string().catch(""),
  tabs: z
    .enum(["questions", "results", "settings", "share"])
    .catch("questions"),
  selectedSection: z.string().optional(),
});

export const Route = createFileRoute("/(organizer)/app/tests/details")({
  component: TestsDetails,
  validateSearch: (search) => searchSchema.parse(search),
});
