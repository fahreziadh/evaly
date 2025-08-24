import LoginOrganizerPage from "@/components/pages/login-organizer";
import OrganizerOnboarding from "@/components/pages/organizer-onboarding";
import DashboardSidebar from "@/components/shared/dashboard-sidebar/dashboard-sidebar";
import MobileSidebar from "@/components/shared/dashboard-sidebar/mobile-sidebar";
import LoadingScreen from "@/components/shared/loading-screen";
import { DashboardNotFound } from "@/components/pages/dashboard-not-found";
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
  notFoundComponent: DashboardNotFound,
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
          <div className="container flex flex-col lg:flex-row lg:gap-10">
            {/* <DashboardNavbar /> */}
            <DashboardSidebar className="hidden lg:flex w-[240px] sticky top-0 h-dvh pt-10 pb-5"/>
            <MobileSidebar className="lg:hidden" />
            <main className="flex-1 pt-4 lg:pt-10 pb-5">
              <Outlet />
            </main>
          </div>
        )}
      </Authenticated>
    </>
  );
}
