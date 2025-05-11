import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";
import Stats from "./stats";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Report from "./report";
import Summary from "./summary";
import Submissions from "./submissions";

const Results = () => {
  const [activeTab, setActiveTab] = useQueryState("resultTab", {
    defaultValue: "report",
  });

  return (
    <div>
      <Stats />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mt-6 mb-3 flex flex-row items-center justify-between gap-3">
          <div className="flex flex-row items-center gap-2">
            <Button
              variant={activeTab === "report" ? "outline-solid" : "outline"}
              rounded
              onClick={() => setActiveTab("report")}
            >
              Report
            </Button>
            <Button
              variant={activeTab === "summary" ? "outline-solid" : "outline"}
              rounded
              onClick={() => setActiveTab("summary")}
            >
              Summary
            </Button>
            <Button
              variant={
                activeTab === "submissions" ? "outline-solid" : "outline"
              }
              rounded
              onClick={() => setActiveTab("submissions")}
            >
              Submissions
            </Button>
          </div>
          <Button variant={"default"}>Export</Button>
        </div>
        <TabsContent value="report">
          <Report />
        </TabsContent>
        <TabsContent value="summary">
          <Summary />
        </TabsContent>
        <TabsContent value="submissions">
          <Submissions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
