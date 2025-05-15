import LoginOrganizerPage from "@/components/pages/login-organizer";
import OrganizerOnboarding from "@/components/pages/organizer-onboarding";
import DashboardSidebar from "@/components/shared/dashboard-sidebar";
import DashboardMobileNavbar from "@/components/shared/dashboard-sidebar/dashboard-mobile-navbar";
import LoadingScreen from "@/components/shared/loading-screen";
import { SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@convex/_generated/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Unauthenticated,
  AuthLoading,
  Authenticated,
  useQuery,
} from "convex/react";

export const Route = createFileRoute("/app")({
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
          <SidebarProvider>
            <DashboardSidebar />
            <div className="flex-1">
              <DashboardMobileNavbar />
              <Outlet />
            </div>
          </SidebarProvider>
        )}
      </Authenticated>
    </>
  );
}
