import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusCircle, WandSparkles } from "lucide-react";

export const Route = createFileRoute('/(organizer)/app/questions/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div>
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col">
          <h1 className="dashboard-title">Questions</h1>
          <h2 className="dashboard-description">
            Collection of your questions
          </h2>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant={"outline"}>
            <WandSparkles /> Generate with AI
          </Button>
          <Button>
            <PlusCircle /> Create
          </Button>
        </div>
      </div>
      <div className="dashboard-margin">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="from-test">Used by Test</TabsTrigger>
            <TabsTrigger value="ai-generated">AI Generated</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-2 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((e) => (
            <Link to="/app/questions/template">
              <Card className="p-4 hover:border-primary/30">
                <h1>Judul soal</h1>
                <div className="text-muted-foreground text-sm">
                  <p>- Ini adalah contoh highlight...</p>
                  <p className="opacity-75">- Kalau ini juga sama aja...</p>
                  <p className="opacity-50">- Gimana kalau yang ini...</p>
                </div>
                <div className="flex flex-row flex-wrap gap-2 mt-2">
                  <Badge variant={"secondary"}>IPA</Badge>
                  <Badge variant={"secondary"}>IPS</Badge>
                  <Badge variant={"secondary"}>KIMIA</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
