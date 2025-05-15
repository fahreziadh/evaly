import { Tabs, TabsContent } from "@/components/ui/tabs";
import Headers from "./headers";
import Questions from "./questions";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useEffect } from "react";
import { TextShimmer } from "@/components/ui/text-shimmer";
import Settings from "./settings";
import Share from "./share";
import { useNavigate, useSearch } from "@tanstack/react-router";

export default function TestsDetails() {
  const { tabs, testId, selectedSection } = useSearch({from: "/app/tests/details"});
  const navigate = useNavigate({from: "/app/tests/details"});
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
        },
        replace: true,
      });
    }
  }, [testSections, navigate, testId, selectedSection, tabs]);

  return (
    <Tabs
      className="container dashboard-margin gap-6"
      value={tabs}
      onValueChange={(value) => {
        navigate({
          search: {
            tabs: value as "questions" | "results" | "settings" | "share",
            testId,
            selectedSection,
          },
        });
      }}
    >
      <Headers />
      <TabsContent value="questions">
        {selectedSection ? (
          <Questions
            selectedSectionId={selectedSection as Id<"testSection">}
            testId={testId as Id<"test">}
          />
        ) : (
          <TextShimmer className="w-full h-full">
            Loading section...
          </TextShimmer>
        )}
      </TabsContent>
      <TabsContent value="results"></TabsContent>
      <TabsContent value="settings">
        <Settings />
      </TabsContent>
      <TabsContent value="share">
        <Share testId={testId as Id<"test">} />
      </TabsContent>
    </Tabs>
  );
}
