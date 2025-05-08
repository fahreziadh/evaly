import React from "react";
import Provider from "./provider";
import { DashboardNavbar } from "@/components/shared/dashboard-navbar";
import { trpc } from "@/trpc/trpc.server";
import { TRPCError } from "@trpc/server";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const dataUser = await trpc.organization.profile().catch((error) => {
    if (error instanceof TRPCError && error.code === "UNAUTHORIZED") {
      return null;
    }
    throw error;
  })
  const isLoggedIn = !!dataUser;

  return (
    <Provider isLoggedIn={isLoggedIn}>
      <DashboardNavbar />
      <main className="flex flex-col flex-1">{children}</main>
    </Provider>
  );
};

export default Layout;
