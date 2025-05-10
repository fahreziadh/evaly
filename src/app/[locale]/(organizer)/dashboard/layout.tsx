"use client";

import React from "react";
import Provider from "./provider";
import DashboardSidebar from "@/components/shared/dashboard-sidebar";
import DashboardMobileNavbar from "@/components/shared/dashboard-sidebar/dashboard-mobile-navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {

  return (
    <Provider>
      <DashboardSidebar />
      <main className="flex flex-col flex-1">
        <DashboardMobileNavbar />
        {children}
      </main>
    </Provider>
  );
};

export default Layout;
