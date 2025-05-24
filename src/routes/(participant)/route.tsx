import LoginParticipantPage from "@/components/pages/login-participant";
import LoadingScreen from "@/components/shared/loading-screen";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated
} from "convex/react";

export const Route = createFileRoute("/(participant)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AuthLoading>
        <LoadingScreen />
      </AuthLoading>
      <Unauthenticated>
        <LoginParticipantPage />
      </Unauthenticated>
      <Authenticated>
        <Outlet />
      </Authenticated>
    </>
  );
}
