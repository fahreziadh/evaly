"use client";

import { Tabs } from "@/components/ui/tabs";
import Header from "./_components/header";
import { useTabsState } from "./_hooks/use-tabs-state";
// import Share from "./_components/share";
// import Setting from "./_components/setting/setting";
// import Questions from "./_components/questions/questions";
// import Results from "./_components/results/results";

const PageClient = () => {
  const [tab, setTab] = useTabsState("questions");

  return (
    <Tabs
      className="container min-h-dvh pb-10 dashboard-margin"
      defaultValue="questions"
      value={tab}
      onValueChange={setTab}
    >
      <Header />
      {/* <TabsContent value="settings">
        <Setting />
      </TabsContent>
      <TabsContent value="results">
        <Results />
      </TabsContent>
      <TabsContent value="questions">
        <Questions />
      </TabsContent>
      <TabsContent value="share">
        <Share />
      </TabsContent> */}
    </Tabs>
  );
};

export default PageClient;
