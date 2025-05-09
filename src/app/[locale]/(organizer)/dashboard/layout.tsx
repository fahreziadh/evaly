import React from "react";
import Provider from "./provider";
import { trpc } from "@/trpc/trpc.server";
import { TRPCError } from "@trpc/server";
import DashboardSidebar from "@/components/shared/dashboard-sidebar";
import DashboardMobileNavbar from "@/components/shared/dashboard-sidebar/dashboard-mobile-navbar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const dataUser = await trpc.organization.profile().catch((error) => {
    if (error instanceof TRPCError && error.code === "UNAUTHORIZED") {
      return null;
    }
    throw error;
  });
  const isLoggedIn = !!dataUser;

  return (
    <Provider isLoggedIn={isLoggedIn}>
      <DashboardSidebar />
      <main className="flex flex-col flex-1">
        <DashboardMobileNavbar />
        {children}
      </main>
    </Provider>
  );
};

export default Layout;
