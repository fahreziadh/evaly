"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import Header from "./_components/header";
import { useTabsState } from "./_hooks/use-tabs-state";
import Setting from "./_components/setting/setting";
import Questions from "./_components/questions/questions";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useSearchParams } from "next/navigation";
import { useSelectedSection } from "./_hooks/use-selected-section";
import { useEffect } from "react";
// import Share from "./_components/share";
// import Setting from "./_components/setting/setting";
// import Questions from "./_components/questions/questions";
// import Results from "./_components/results/results";

const PageClient = () => {
  const [tab, setTab] = useTabsState("questions");
  const testId = useSearchParams().get("testId") as Id<"test">;
  const [selectedSection, setSelectedSection] = useSelectedSection();
  const dataSections = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<"test">,
  });

  useEffect(() => {
    if (dataSections && dataSections.length && !selectedSection) {
      setSelectedSection(dataSections[0]._id);
    }
  }, [dataSections, selectedSection, setSelectedSection]);

  return (
    <Tabs
      className="container min-h-dvh pb-10 dashboard-margin"
      defaultValue="questions"
      value={tab}
      onValueChange={setTab}
    >
      <Header />
      <TabsContent value="settings">
        <Setting />
      </TabsContent>
      <TabsContent value="questions">
        {selectedSection && (
          <Questions selectedSection={selectedSection} />
        )}
      </TabsContent>
      {/* <TabsContent value="results">
        <Results />
      </TabsContent>
     
      <TabsContent value="share">
        <Share />
      </TabsContent> */}
    </Tabs>
  );
};

export default PageClient;
