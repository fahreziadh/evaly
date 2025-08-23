import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Trash2, Plus, Settings } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import LoadingScreen from "@/components/shared/loading-screen";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const searchSchema = z.object({
  bankId: z.string(),
});

export const Route = createFileRoute("/(organizer)/app/questions/bank")({
  component: RouteComponent,
  validateSearch: (search) => searchSchema.parse(search),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { bankId } = Route.useSearch();
  
  const questionBank = useQuery(api.organizer.questionBank.getById, {
    id: bankId as Id<"questionBank">,
  });
  
  const questions = useQuery(api.organizer.questionBank.getQuestions, {
    questionBankId: bankId as Id<"questionBank">,
  });

  const addQuestion = useMutation(api.organizer.questionBank.addQuestion);
  const deleteQuestion = useMutation(api.organizer.question.deleteById);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  const updateQuestionBank = useMutation(api.organizer.questionBank.update);

  const handleSaveEdit = async () => {
    if (!questionBank) return;
    
    try {
      await updateQuestionBank({
        id: questionBank._id,
        title: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update question library:", error);
      alert("Failed to update question library. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    if (questionBank) {
      setEditedTitle(questionBank.title);
      setEditedDescription(questionBank.description || "");
    }
    setIsEditing(false);
  };

  const handleAddQuestion = async (type: any) => {
    try {
      const questionId = await addQuestion({
        questionBankId: bankId as Id<"questionBank">,
        type,
      });
      
      // Navigate to question editor
      navigate({
        to: "/app/questions/details",
        search: { questionId, bankId },
      });
    } catch (error) {
      console.error("Failed to add question:", error);
      alert("Failed to add question. Please try again.");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    try {
      setDeletingQuestionId(questionId);
      await deleteQuestion({ id: questionId as Id<"question"> });
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Failed to delete question. Please try again.");
    } finally {
      setDeletingQuestionId(null);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "multiple-choice": return "Multiple Choice";
      case "yes-or-no": return "Yes/No";
      case "text-field": return "Text Field";
      case "file-upload": return "File Upload";
      case "fill-the-blank": return "Fill the Blank";
      case "audio-response": return "Audio Response";
      case "video-response": return "Video Response";
      case "dropdown": return "Dropdown";
      case "matching-pairs": return "Matching Pairs";
      case "slider-scale": return "Slider Scale";
      default: return type;
    }
  };

  const extractTextFromHtml = (htmlString: string) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || "";
  };

  if (questionBank === undefined || questions === undefined) {
    return <LoadingScreen />;
  }

  if (!questionBank) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Question Library Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The question library you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => navigate({ to: "/app/questions" })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Question Libraries
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row items-center gap-3 mb-6">
        <Button 
          variant="secondary" 
          size="icon-sm" 
          onClick={() => navigate({ to: "/app/questions" })}
        >
          <ArrowLeft />
        </Button>
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Question library title"
                className="text-xl font-bold"
              />
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Optional description"
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="dashboard-title">{questionBank.title}</h1>
              {questionBank.description && (
                <p className="dashboard-description">{questionBank.description}</p>
              )}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setEditedTitle(questionBank.title);
              setEditedDescription(questionBank.description || "");
              setIsEditing(true);
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Edit Library
          </Button>
          <Button onClick={() => handleAddQuestion("multiple-choice")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Library Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Library Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Questions</Label>
              <p className="text-2xl font-bold">{questions.length}</p>
            </div>
            <Separator />
            <div>
              <Label className="text-sm font-medium">Created</Label>
              <p className="text-sm text-muted-foreground">
                {dayjs(questionBank._creationTime).fromNow()}
              </p>
            </div>
            {questionBank.tags && questionBank.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {questionBank.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="lg:col-span-3 space-y-3">
          {questions.length === 0 ? (
            <Card className="p-8 text-center">
              <Plus className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No questions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your question library by adding your first question.
              </p>
              <Button onClick={() => handleAddQuestion("multiple-choice")}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Question
              </Button>
            </Card>
          ) : (
            questions.map((question, index) => {
              const questionText = extractTextFromHtml(question.question);
              const preview = questionText.length > 120 
                ? questionText.substring(0, 120) + "..." 
                : questionText || "No question text";

              return (
                <Card key={question._id} className="group hover:border-primary/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 cursor-pointer" 
                           onClick={() => navigate({
                             to: "/app/questions/details",
                             search: { questionId: question._id, bankId },
                           })}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Q{index + 1}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {getQuestionTypeLabel(question.type)}
                          </Badge>
                        </div>
                        <h3 className="font-medium mb-2">
                          {questionText || "Untitled Question"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{preview}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteQuestion(question._id);
                          }}
                          disabled={deletingQuestionId === question._id}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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