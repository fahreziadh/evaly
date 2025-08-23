import SectionStats from "./results.section-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResultSectionSubmission from "./results.section-submission";
import ResultsSectionSummary from "./results.section-summary";
import ResultsLeaderboard from "./results.section-leaderboard";
import { useNavigate, useSearch } from "@tanstack/react-router";
import type { Id } from "@convex/_generated/dataModel";
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
        value={search.resultsTab || "leaderboard"}
        onValueChange={(value) => {
          navigate({
            search: {
              ...search,
              resultsTab: value as "leaderboard" | "submission" | "summary",
            },
          });
        }}
      >
        <TabsList className="mb-4">
          <TabsTrigger
            value="leaderboard"
            className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            Leaderboard
          </TabsTrigger>
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
        <TabsContent value="leaderboard">
          <ResultsLeaderboard testId={search.testId as Id<"test">} />
        </TabsContent>
        <TabsContent value="submission">
          <ResultSectionSubmission />
        </TabsContent>
        <TabsContent value="summary">
          <ResultsSectionSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
