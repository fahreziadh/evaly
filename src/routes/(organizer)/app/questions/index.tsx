import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlusCircle, WandSparkles, FolderOpen, Trash2, Edit, Package } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import LoadingScreen from "@/components/shared/loading-screen";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const Route = createFileRoute("/(organizer)/app/questions/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const questionBanks = useQuery(api.organizer.questionBank.getAll);
  const deleteQuestionBank = useMutation(api.organizer.questionBank.deleteById);
  const [deletingBankId, setDeletingBankId] = useState<string | null>(null);

  const handleDeleteQuestionBank = async (bankId: string) => {
    if (confirm("Are you sure you want to delete this question library? All questions in this library will also be deleted.")) {
      try {
        setDeletingBankId(bankId);
        await deleteQuestionBank({ id: bankId as Id<"questionBank"> });
      } catch (error) {
        console.error("Failed to delete question library:", error);
        alert("Failed to delete question library. Please try again.");
      } finally {
        setDeletingBankId(null);
      }
    }
  };

  const formatTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return null;
    return tags.slice(0, 3).join(", ") + (tags.length > 3 ? "..." : "");
  };

  if (questionBanks === undefined) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col">
          <h1 className="dashboard-title">Question Libraries</h1>
          <h2 className="dashboard-description">
            Organize your questions into reusable libraries ({questionBanks.length})
          </h2>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant={"outline"} disabled>
            <WandSparkles /> Generate with AI
          </Button>
          <Button
            onClick={() => {
              navigate({ to: "/app/questions/template", search: { mode: "bank" } });
            }}
          >
            <PlusCircle /> Create Library
          </Button>
        </div>
      </div>
      <div className="dashboard-margin">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Libraries ({questionBanks.length})</TabsTrigger>
            <TabsTrigger value="public" disabled>Public Libraries</TabsTrigger>
            <TabsTrigger value="ai-generated" disabled>AI Generated</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionBanks.length === 0 ? (
            <Card className="col-span-full p-8 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No question libraries yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first question library to organize and reuse questions.
              </p>
              <Button
                onClick={() => {
                  navigate({ to: "/app/questions/template", search: { mode: "bank" } });
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Question Library
              </Button>
            </Card>
          ) : (
            questionBanks.map((bank) => {
              return (
                <Card 
                  key={bank._id} 
                  className="hover:border-primary/30 group relative cursor-pointer transition-colors"
                  onClick={() => {
                    navigate({ to: "/app/questions/bank", search: { bankId: bank._id } });
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FolderOpen className="h-5 w-5 text-primary" />
                          {bank.title}
                        </CardTitle>
                        {bank.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {bank.description.length > 80 
                              ? bank.description.substring(0, 80) + "..." 
                              : bank.description}
                          </p>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteQuestionBank(bank._id);
                          }}
                          disabled={deletingBankId === bank._id}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">
                        {bank.questionCount} questions
                      </Badge>
                      {bank.isPublic && (
                        <Badge variant="outline">Public</Badge>
                      )}
                      {formatTags(bank.tags || []) && (
                        <Badge variant="outline">
                          {formatTags(bank.tags || [])}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Created {dayjs(bank._creationTime).fromNow()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
