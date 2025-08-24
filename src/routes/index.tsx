import LandingPage from "@/components/pages/landing-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      {
        title: "Evaly - Open Source Testing Platform for Educators",
      },
      {
        name: "description",
        content: "Create, distribute, and analyze tests with zero hassle. Built for classrooms, designed for simplicity. Free and open source.",
      },
    ],
  }),
});
