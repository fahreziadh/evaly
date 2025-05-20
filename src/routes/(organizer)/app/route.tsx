import LoginOrganizerPage from "@/components/pages/login-organizer";
import OrganizerOnboarding from "@/components/pages/organizer-onboarding";
import DashboardNavbar from "@/components/shared/dashboard-navbar/dashboard-navbar";
import LoadingScreen from "@/components/shared/loading-screen";
import { api } from "@convex/_generated/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Unauthenticated,
  AuthLoading,
  Authenticated,
  useQuery,
} from "convex/react";

export const Route = createFileRoute("/(organizer)/app")({
  component: App,
  head: () => ({
    meta: [
      {
        title: "Evaly Dashboard",
      },
      {
        name: "description",
        content: "Evaly - Create and manage your tests",
      },
    ],
  }),
});

function App() {
  const user = useQuery(api.organizer.profile.getProfile);
  return (
    <>
      <AuthLoading>
        <LoadingScreen />
      </AuthLoading>
      <Unauthenticated>
        <LoginOrganizerPage />
      </Unauthenticated>
      <Authenticated>
        {user && !user?.selectedOrganizationId ? (
          <OrganizerOnboarding defaultFullname={user?.name} />
        ) : (
          <>
            <DashboardNavbar />
            <main className="container dashboard-margin">
              <Outlet />
            </main>
          </>
        )}
      </Authenticated>
    </>
  );
}
