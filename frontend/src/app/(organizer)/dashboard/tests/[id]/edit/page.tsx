"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import Questions from "./_components/questions/questions";
import Header from "./_components/header";
import Setting from "./_components/setting/setting";
import { useTabsState } from "./_hooks/use-tabs-state";
import BackButton from "@/components/shared/back-button";
const DetailTestPage = () => {
  const [tabs, setTabs] = useTabsState();

  return (
    <div className="container min-h-dvh pb-10">
      <BackButton className="mb-2" fallbackUrl="/dashboard" />
      <Tabs defaultValue="questions" value={tabs} onValueChange={setTabs}>
        <Header />
        <TabsContent value="questions">
          <Questions />
        </TabsContent>
        <TabsContent value="settings">
          <Setting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailTestPage;
