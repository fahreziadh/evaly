import SectionStats from "./results.section-stats";
import SectionProgress from "./results.section-progress";
import SectionLeaderboards from "./results.section-leaderboards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultSectionSubmission from "./results.section-submission";
import ResultsSectionReport from "./results.section-report";
import { useNavigate, useSearch } from "@tanstack/react-router";
const Results = () => {
  const search = useSearch({ from: "/(organizer)/app/tests/details" });
  const navigate = useNavigate({ from: "/app/tests/details" });

  return (
    <div className="grid grid-cols-6 gap-4">
      <SectionStats className="col-span-6" />
      <SectionProgress className="col-span-4" />
      <SectionLeaderboards className="col-span-2" />
      <Tabs
        className="col-span-6 mt-4"
        value={search.resultsTab}
        onValueChange={(value) => {
          navigate({
            search: {
              ...search,
              resultsTab: value as "submission" | "report",
            },
          });
        }}
      >
        <TabsList>
          <TabsTrigger
            value="submission"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Submission
          </TabsTrigger>
          <TabsTrigger
            value="report"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Report
          </TabsTrigger>
        </TabsList>
        <TabsContent value="submission">
          <ResultSectionSubmission />
        </TabsContent>
        <TabsContent value="report">
          <ResultsSectionReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
