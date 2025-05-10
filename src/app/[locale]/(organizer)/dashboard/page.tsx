"use client";

import { Suspense } from "react";
import DashboardPageClient from "./page.client";
import LoadingScreen from "@/components/shared/loading/loading-screen";

export const dynamic = "force-static";

const Page = () => {
  return (
    <div className="dashboard-margin">
      <Suspense fallback={<LoadingScreen />}>
        <DashboardPageClient />
      </Suspense>
    </div>
  );
};
export default Page;
