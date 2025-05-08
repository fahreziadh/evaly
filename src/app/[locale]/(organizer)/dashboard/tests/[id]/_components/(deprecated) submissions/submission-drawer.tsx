import { useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  XCircle,
  HelpCircle,
  Loader2,
  Clock,
  BarChart3,
  Calendar,
  Mail,
  Timer,
  AlertCircle,
  CheckCircle2,
  XIcon,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerNavbar,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Submission, Section } from "./types";
import { ExportDialogDetails } from "./export-dialog-details";
import { trpc } from "@/trpc/trpc.client";

dayjs.extend(relativeTime);

interface SubmissionDrawerProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: Section[];
  testId: string;
}

export const SubmissionDrawer = ({
  submission,
  open,
  onOpenChange,
  sections,
  testId,
}: SubmissionDrawerProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Fetch detailed submission data when drawer is open
  const { data: submissionDetails, isLoading } = trpc.organization.test.getTestResultsByParticipant.useQuery({
    id: testId,
    email: submission?.email || "",
  },{
    enabled: !!submission?.email,
  });

  // Use the detailed questions from the API response
  const questions = useMemo(() => {
    if (!submissionDetails) return [];
    return submissionDetails.questions || [];
  }, [submissionDetails]);

  // Group questions by section
  const questionsBySection = useMemo(() => {
    if (!questions.length) return {};

    return questions.reduce(
      (acc, question) => {
        const sectionId = question.sectionId;
        if (!acc[sectionId]) {
          acc[sectionId] = [];
        }
        acc[sectionId].push(question);
        return acc;
      },
      {} as Record<string, typeof questions>
    );
  }, [questions]);

  if (!submission) return null;

  // Calculate section performance
  const getSectionPerformance = (sectionId: string) => {
    const answered = submission.sectionAnswers?.[sectionId] || 0;
    const correct = submission.sectionCorrect?.[sectionId] || 0;
    const wrong = submission.sectionWrong?.[sectionId] || 0;
    const section = sections.find((s) => s.id === sectionId);
    const total = section?.questionsCount || 0;
    const unanswered = total - answered;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { answered, correct, wrong, unanswered, total, score };
  };

  // Get progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-amber-600";
    return "bg-red-600";
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-dvh">
        <DrawerNavbar
          onBack={() => onOpenChange(false)}
          titleComponent={
            <DrawerHeader className="text-left py-0">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(submission.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DrawerTitle className="font-semibold">
                    {submission.name}
                  </DrawerTitle>
                  <DrawerDescription className="text-sm text-muted-foreground leading-1 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {submission.email}
                    {submission.submittedAt && (
                      <>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3" />{" "}
                        {dayjs(submission.submittedAt).format("MMM D, YYYY")}
                      </>
                    )}
                  </DrawerDescription>
                </div>
              </div>
            </DrawerHeader>
          }
        />

        <div className="overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="container max-w-4xl py-6 "
          >
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-8 ">
                {/* Status Card */}
                <Card className="border-none">
                  <CardHeader className="px-0">
                    <CardTitle className="font-medium flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Test Performance
                    </CardTitle>
                    <CardDescription>
                      {submission.status === "in-progress" ? (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Timer className="h-4 w-4" />
                          <span>This test is still in progress</span>
                        </div>
                      ) : submission.status === "test-ended" ? (
                        <div className="flex items-center gap-1 text-red-500">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Time&apos;s up before completion</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Completed on{" "}
                            {submission.submittedAt
                              ? dayjs(submission.submittedAt).format(
                                  "MMMM D, YYYY [at] h:mm A"
                                )
                              : "Unknown date"}
                          </span>
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-2">
                      <div className="flex flex-col p-3 border border-dashed">
                        <div className={`text-2xl font-medium`}>
                          {submission.score}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Score
                        </div>
                      </div>

                      <div className="flex flex-col p-3 border border-dashed">
                        <div className="text-3xl font-medium">
                          #{submission.rank || "-"}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Rank
                        </div>
                      </div>

                      <div className="flex flex-col p-3 border border-dashed">
                        <div className="text-3xl font-medium">
                          {submission.correct}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Correct
                        </div>
                      </div>

                      <div className="flex flex-col p-3 border border-dashed">
                        <div className="text-3xl font-medium">
                          {submission.wrong}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Wrong
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Progress</span>
                        <span className="font-medium">
                          {submission.answered}/{submission.totalQuestions}{" "}
                          questions
                        </span>
                      </div>

                      <Progress
                        value={
                          (submission.answered / submission.totalQuestions) *
                          100
                        }
                      />

                      <div className="flex justify-between text-sm text-muted-foreground mt-2 px-1">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="size-4 text-green-600" />
                          <span>{submission.correct} correct</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="size-4 text-red-600" />
                          <span>{submission.wrong} wrong</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HelpCircle className="size-4 text-muted-foreground" />
                          <span>{submission.unanswered} unanswered</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between text-sm p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Started:{" "}
                          {submission.startedAt
                            ? dayjs(submission.startedAt).format("h:mm A")
                            : "Unknown"}
                        </span>
                      </div>
                      {submission.submittedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Submitted:{" "}
                            {dayjs(submission.submittedAt).format("h:mm A")}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Section Performance */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2 px-1">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Section Performance
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {sections.map((section, index) => {
                      const performance = getSectionPerformance(section.id);
                      return (
                        <Card key={section.id} className="overflow-hidden">
                          <CardHeader className={`py-3`}>
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base font-medium">
                                {section.name || `Section ${index + 1}`}
                              </CardTitle>
                              <Badge>{performance.score}%</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6 border-t border-dashed">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="flex flex-col p-3 border border-dashed">
                                <span className="text-lg">
                                  {performance.answered}/{performance.total}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Answered
                                </span>
                              </div>
                              <div className="flex flex-col p-3 border border-dashed">
                                <span className="text-lg">
                                  {performance.correct}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Correct
                                </span>
                              </div>
                              <div className="flex flex-col p-3 border border-dashed">
                                <span className="text-lg">
                                  {performance.wrong}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Wrong
                                </span>
                              </div>
                              <div className="flex flex-col p-3 border border-dashed">
                                <span className="font-medium">
                                  {performance.unanswered}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Unanswered
                                </span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Progress
                                value={performance.score}
                                className={`h-2 ${getProgressColor(
                                  performance.score
                                )}`}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="questions"
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="font-medium">
                        Questions
                      </CardTitle>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="size-5 text-green-600" />
                          <span>Correct</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XIcon className="size-5 text-red-600" />
                          <span>Wrong</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HelpCircle className="size-4 text-muted-foreground" />
                          <span>Unanswered</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      Review all questions and answers for this submission
                    </CardDescription>
                  </CardHeader>
                </Card>

                {isLoading ? (
                  <div className="flex flex-col justify-center items-center py-20 gap-3">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <span className="text-muted-foreground font-medium">
                      Loading questions...
                    </span>
                  </div>
                ) : (
                  <Accordion
                    type="multiple"
                    className="w-full min-h-dvh space-y-4"
                  >
                    {sections.map((section, i) => {
                      const sectionQuestions =
                        questionsBySection[section.id] || [];
                      const performance = getSectionPerformance(section.id);

                      return (
                        <Card key={section.id} className="">
                          <AccordionItem
                            value={section.id}
                            className="border-none"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-primary/5 transition-colors cursor-pointer">
                              <div className="flex flex-1 justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {section.name || `Section ${i + 1}`}
                                  </span>
                                  <Badge className={`ml-2`} variant={"outline"}>
                                    {performance.score}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm mr-4">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="size-4 text-green-600" />
                                    {performance.correct}
                                  </span>
                                  <span className="text-muted-foreground/50">
                                    /
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <XIcon className="size-4 text-red-600" />
                                    {performance.wrong}
                                  </span>
                                  <span className="text-muted-foreground/50">
                                    /
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <HelpCircle className="size-4 text-muted-foreground" />
                                    {performance.unanswered}
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-0 pt-4 border-t border-dashed">
                              <div className="space-y-4 px-4">
                                {sectionQuestions.map((question, index) => (
                                  <div key={question.id} className="border">
                                    <div
                                      className={`p-4 border-b border-dashed`}
                                    >
                                      <div className="flex items-start gap-3 bgbl">
                                        <div className="mt-0.5 flex-shrink-0">
                                          {question.isCorrect === true ? (
                                            <div className="h-7 w-7 rounded-full bg-green-500/10 flex items-center justify-center">
                                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            </div>
                                          ) : question.isCorrect === false ? (
                                            <div className="h-7 w-7 rounded-full bg-red-500/10 flex items-center justify-center">
                                              <XCircle className="h-4 w-4 text-red-600" />
                                            </div>
                                          ) : (
                                            <div className="h-7 w-7 rounded-full bg-gray-500/10 flex items-center justify-center">
                                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="space-y-2 flex-1">
                                          <div className="flex justify-between">
                                            <h4 className="font-medium">
                                              Question {index + 1}
                                            </h4>
                                            <Badge
                                              variant="outline"
                                              className="capitalize shadow-sm"
                                            >
                                              {question.type?.replace(
                                                /_/g,
                                                " "
                                              ) || "Unknown"}
                                            </Badge>
                                          </div>
                                          <div
                                            className="text-sm custom-prose "
                                            dangerouslySetInnerHTML={{
                                              __html: question.text || "",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 p-3 rounded-lg bg-primary/10">
                                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                                            Correct Answer
                                          </p>
                                          <div
                                            className="text-sm font-medium custom-prose"
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                question.correctAnswer ||
                                                "Not available",
                                            }}
                                          />
                                        </div>
                                        <div
                                          className={`space-y-2 p-3 rounded-lg ${
                                            question.isCorrect === true
                                              ? "bg-green-500/10"
                                              : question.isCorrect === false
                                                ? "bg-red-500/10"
                                                : "bg-primary/10"
                                          }`}
                                        >
                                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            {question.isCorrect === true ? (
                                              <CheckCircle2 className="size-3 text-green-600" />
                                            ) : question.isCorrect === false ? (
                                              <XCircle className="size-3 text-red-600" />
                                            ) : (
                                              <HelpCircle className="size-3 text-muted-foreground" />
                                            )}
                                            Participant&apos;s Answer
                                          </p>
                                          <div
                                            className={`text-sm font-medium ${
                                              question.isCorrect === true
                                                ? "text-green-600"
                                                : question.isCorrect === false
                                                  ? "text-red-600"
                                                  : "text-muted-foreground italic"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                question.participantAnswer ||
                                                "Not answered",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Card>
                      );
                    })}
                  </Accordion>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter className="border-t py-3">
          <div className="container max-w-4xl flex justify-between items-center gap-2">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
            <ExportDialogDetails
              submission={submission}
              testName={testId}
              questions={questions}
              sections={sections}
            />
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
