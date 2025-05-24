import Whistlist from "@/components/pages/whistlist";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Whistlist,
  head: () => ({
    meta: [
      {
        title: "Evaly",
      },
    ],
  }),
});
