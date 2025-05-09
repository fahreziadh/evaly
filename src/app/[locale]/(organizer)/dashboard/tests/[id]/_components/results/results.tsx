import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQueryState } from "nuqs";
import Submissions from "../(deprecated) submissions";

const Results = () => {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "report",
  });
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Total Submissions</p>
          <h1 className="text-2xl font-semibold">12</h1>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Completition Rate</p>
          <h1 className="text-2xl font-semibold">84%</h1>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Average Score</p>
          <h1 className="text-2xl font-semibold">60</h1>
        </Card>
        <Card className="p-4">
          <p className="text-muted-foreground text-sm">Average Time</p>
          <h1 className="text-2xl font-semibold">100m</h1>
        </Card>
      </div>
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
            variant={activeTab === "submissions" ? "outline-solid" : "outline"}
            rounded
            onClick={() => setActiveTab("submissions")}
          >
            Submissions
          </Button>
        </div>
        <Button variant={"default"}>Export</Button>
      </div>
      <Submissions />
    </div>
  );
};

export default Results;
