import { Tabs, TabsContent } from "@/components/ui/tabs";
import Headers from "./headers";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@convex/_generated/api";
import { lazy, Suspense, useEffect } from "react";
import { QuestionEditorSkeleton, TestResultsSkeleton } from "@/components/ui/skeleton-loaders";
import { ContentPlaceholder } from "@/components/ui/loading-states";
import Settings from "./settings";
import Share from "./share";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { NotFound } from "../not-found";
const Questions = lazy(() => import("./questions"));
const Results = lazy(() => import("./results"));

export default function TestsDetails() {

  const { tabs, testId, selectedSection, resultsTab } = useSearch({
    from: "/(organizer)/app/tests/details",
  });

  const dataTest = useQuery(api.organizer.test.getTestById, {
    testId: testId as Id<"test">,
  });

  const navigate = useNavigate({ from: "/app/tests/details" });
  const testSections = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<"test">,
  });

  useEffect(() => {
    if (testSections?.length && !selectedSection && tabs === "questions") {
      navigate({
        search: {
          tabs: "questions",
          testId,
          selectedSection: testSections[0]._id,
          resultsTab
        },
        replace: true,
      });
    }
  }, [testSections, navigate, testId, selectedSection, tabs]);

  if (dataTest === null) {
    return <NotFound />
  }

  return (
    <Tabs
      value={tabs}
      onValueChange={(value) => {
        navigate({
          search: {
            tabs: value as "questions" | "results" | "settings" | "share",
            testId,
            selectedSection,
            resultsTab
          },
        });
      }}
    >
      <Headers />
      <div className="mt-2 pb-20">
        <TabsContent value="questions">
          {selectedSection ? (
            <Suspense fallback={<QuestionEditorSkeleton />}>
              <Questions
                selectedSectionId={selectedSection as Id<"testSection">}
                testId={testId as Id<"test">}
              />
            </Suspense>
          ) : (
            <ContentPlaceholder 
              title="Loading section..." 
              description="Please wait while we load the questions"
            />
          )}
        </TabsContent>
        <TabsContent value="results">
          <Suspense fallback={<TestResultsSkeleton />}>
            <Results />
          </Suspense>
        </TabsContent>
        <TabsContent value="settings">
          <Settings />
        </TabsContent>
        <TabsContent value="share">
          <Share testId={testId as Id<"test">} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
