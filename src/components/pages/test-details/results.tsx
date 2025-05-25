import SectionStats from "./results.section-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultSectionSubmission from "./results.section-submission";
import ResultsSectionSummary from "./results.section-summary";
import { useNavigate, useSearch } from "@tanstack/react-router";
const Results = () => {
  const search = useSearch({ from: "/(organizer)/app/tests/details" });
  const navigate = useNavigate({ from: "/app/tests/details" });

  return (
    <div className="grid grid-cols-6 gap-4">
      <SectionStats className="col-span-6" />
      {/* <SectionProgress className="col-span-4" />
      <SectionLeaderboards className="col-span-2" /> */}
      <Tabs
        className="col-span-6 mt-4"
        value={search.resultsTab}
        onValueChange={(value) => {
          navigate({
            search: {
              ...search,
              resultsTab: value as "submission" | "summary",
            },
          });
        }}
      >
        <TabsList>
          <TabsTrigger
            value="summary"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="submission"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Submission
          </TabsTrigger>
        </TabsList>
        <TabsContent value="submission">
          <ResultSectionSubmission />
        </TabsContent>
        <TabsContent value="report">
          <ResultsSectionSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
