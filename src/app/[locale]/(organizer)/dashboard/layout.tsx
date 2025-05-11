import React, { Suspense } from "react";
import Provider from "./provider";
import DashboardSidebar from "@/components/shared/dashboard-sidebar";
import DashboardMobileNavbar from "@/components/shared/dashboard-sidebar/dashboard-mobile-navbar";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <Provider>
        <DashboardSidebar />
        <main className="flex flex-col flex-1">
          <DashboardMobileNavbar />
          {children}
        </main>
      </Provider>
    </Suspense>
  );
};

export default Layout;
