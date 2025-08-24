import LandingPage from "@/components/pages/landing-page";
import { createFileRoute } from "@tanstack/react-router";
import { fetchGitHubStars } from "@/lib/github";

export const Route = createFileRoute("/")({
  component: LandingPage,
  loader: async () => {
    const stars = await fetchGitHubStars("fahreziadh/evaly");
    return { stars };
  },
  staleTime: 1000 * 60 * 60 * 4, // 4 hours cache
  gcTime: 1000 * 60 * 60 * 8,    // 8 hours garbage collection
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
