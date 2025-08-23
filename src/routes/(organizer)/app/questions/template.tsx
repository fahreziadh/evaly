import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";
import type { DataModel } from "@convex/_generated/dataModel";

const searchSchema = z.object({
  testId: z.string().optional(),
  selectedSectionId: z.string().optional(),
  referenceId: z.string().optional(),
  mode: z.enum(["bank", "question"]).optional().default("bank"),
});

export const Route = createFileRoute("/(organizer)/app/questions/template")({
  component: RouteComponent,
  validateSearch: (search) => searchSchema.parse(search),
});

type QuestionType = DataModel["question"]["document"]["type"];

interface QuestionTemplate {
  type: QuestionType;
  name: string;
  description: string;
  icon: string;
}

const questionTemplates: QuestionTemplate[] = [
  {
    type: "multiple-choice",
    name: "Multiple Choice",
    description: "Choose from multiple options with one or more correct answers",
    icon: "📝",
  },
  {
    type: "yes-or-no",
    name: "Yes/No",
    description: "Simple binary choice question",
    icon: "✅",
  },
  {
    type: "text-field",
    name: "Text Field",
    description: "Open-ended text response",
    icon: "💬",
  },
  {
    type: "file-upload",
    name: "File Upload",
    description: "Allow participants to upload files",
    icon: "📎",
  },
  {
    type: "fill-the-blank",
    name: "Fill the Blank",
    description: "Complete sentences with missing words",
    icon: "⬜",
  },
  {
    type: "audio-response",
    name: "Audio Response",
    description: "Record audio answers",
    icon: "🎵",
  },
  {
    type: "video-response",
    name: "Video Response",
    description: "Record video answers",
    icon: "🎥",
  },
  {
    type: "dropdown",
    name: "Dropdown",
    description: "Select from dropdown options",
    icon: "📋",
  },
  {
    type: "matching-pairs",
    name: "Matching Pairs",
    description: "Match related items together",
    icon: "🔗",
  },
  {
    type: "slider-scale",
    name: "Slider Scale",
    description: "Rate on a numerical scale",
    icon: "📊",
  },
];

function RouteComponent() {
  const navigate = useNavigate();
  const { mode } = Route.useSearch();
  const createQuestionBank = useMutation(api.organizer.questionBank.create);
  const createQuestion = useMutation(api.organizer.question.create);
  const [creatingType, setCreatingType] = useState<QuestionType | null>(null);
  const [isCreatingBank, setIsCreatingBank] = useState(false);
  const [bankTitle, setBankTitle] = useState("");
  const [bankDescription, setBankDescription] = useState("");

  const handleCreateQuestionBank = async () => {
    if (!bankTitle.trim()) {
      alert("Please enter a title for your question library.");
      return;
    }

    try {
      setIsCreatingBank(true);
      const bankId = await createQuestionBank({
        title: bankTitle,
        description: bankDescription || undefined,
      });
      
      // Navigate to the new library
      navigate({
        to: "/app/questions/library",
        search: { bankId },
      });
    } catch (error) {
      console.error("Failed to create question library:", error);
      alert("Failed to create question library. Please try again.");
    } finally {
      setIsCreatingBank(false);
    }
  };

  const handleCreateQuestion = async (type: QuestionType) => {
    try {
      setCreatingType(type);
      const questionId = await createQuestion({ type });
      
      // Navigate to question details page
      navigate({
        to: "/app/questions/details",
        search: { questionId },
      });
    } catch (error) {
      console.error("Failed to create question:", error);
      alert("Failed to create question. Please try again.");
    } finally {
      setCreatingType(null);
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center gap-3 mb-6">
        <Button 
          variant={"secondary"} 
          size={"icon-sm"} 
          onClick={() => navigate({ to: "/app/questions" })}
        >
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="dashboard-title">
            {mode === "bank" ? "Create Question Library" : "Choose Question Type"}
          </h1>
          <h2 className="dashboard-description">
            {mode === "bank" 
              ? "Create a reusable collection of questions" 
              : "Select the type of question you want to create"}
          </h2>
        </div>
      </div>

      {mode === "bank" ? (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Package className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle>Create Question Library</CardTitle>
              <p className="text-sm text-muted-foreground">
                Question libraries help you organize and reuse questions across multiple tests.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Library Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Mathematics Quiz Library"
                  value={bankTitle}
                  onChange={(e) => setBankTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what this question library contains"
                  value={bankDescription}
                  onChange={(e) => setBankDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleCreateQuestionBank}
                disabled={isCreatingBank || !bankTitle.trim()}
                className="w-full"
              >
                {isCreatingBank ? "Creating..." : "Create Question Library"}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionTemplates.map((template) => (
            <Card 
              key={template.type} 
              className="p-6 hover:border-primary/30 cursor-pointer transition-colors"
              onClick={() => handleCreateQuestion(template.type)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="text-4xl">{template.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <p className="text-muted-foreground text-sm">{template.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={creatingType === template.type}
                  className="w-full"
                >
                  {creatingType === template.type ? "Creating..." : "Select"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
