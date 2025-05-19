import LoadingScreen from "@/components/shared/loading-screen";
import { lazy, Suspense } from "react";

const SectionStats = lazy(() => import("./results.section-stats"));
const SectionProgress = lazy(() => import("./results.section-progress"));
const SectionLeaderboards = lazy(
  () => import("./results.section-leaderboards")
);

const Results = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="grid grid-cols-6 gap-4">
        <SectionStats className="col-span-6" />
        <SectionProgress className="col-span-4" />
        <SectionLeaderboards className="col-span-2" />
      </div>
    </Suspense>
  );
};

export default Results;
