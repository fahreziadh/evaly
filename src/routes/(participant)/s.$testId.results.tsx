import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Target,
  Check,
  X,
  Sparkles,
  Crown,
  Medal,
  Award,
  Star,
  TrendingUp
} from "lucide-react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import LoadingScreen from "@/components/shared/loading-screen";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/(participant)/s/$testId/results")({
  component: RouteComponent,
});

function RouteComponent() {
  const { testId } = Route.useParams();
  const navigate = useNavigate();
  
  const results = useQuery(api.participant.testResult.getMyResults, {
    testId: testId as Id<"test">,
  });

  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  if (results === undefined) {
    return <LoadingScreen />;
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
              <p className="text-muted-foreground mb-4">
                You haven't completed this test yet or results are not available.
              </p>
              <Button onClick={() => navigate({ to: "/s/$testId", params: { testId } })}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const gradeConfig = getGradeConfig(results.grade);
  const GradeIcon = gradeConfig.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: "/s/$testId", params: { testId } })}
            className="-ml-2 h-8"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {gradeConfig.celebration && (
            <div className="flex items-center gap-1 text-success-foreground">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Great work</span>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className={`rounded-lg border p-6 mb-6 ${gradeConfig.bg} ${gradeConfig.border}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Results</h1>
              <p className="text-sm text-muted-foreground">Performance overview</p>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2 rounded border ${gradeConfig.border} ${gradeConfig.bg}`}>
              <GradeIcon className="h-4 w-4" />
              <span className="text-lg font-semibold">Grade {results.grade}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-semibold text-foreground">{results.percentage}%</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>

            <div className="text-center">
              <div className="text-xl font-semibold text-foreground">{results.totalScore}</div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>

            <div className="text-center">
              <div className="text-xl font-semibold text-foreground">{results.completedSectionsCount}</div>
              <div className="text-xs text-muted-foreground">Sections</div>
            </div>

            <div className="text-center">
              <div className="text-xl font-semibold text-foreground">{results.sectionsCount}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Progress</span>
              <span className="text-muted-foreground">{results.percentage}%</span>
            </div>
            <Progress value={results.percentage} className="h-2" />
          </div>
        </div>

        {/* Section Details */}
        <div className="bg-card rounded border">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Sections</h2>
            </div>

            <Tabs value={selectedSection || results.sections[0]?.sectionId} onValueChange={setSelectedSection}>
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-auto mb-4">
                {results.sections.map((section: any) => (
                  <TabsTrigger
                    key={section.sectionId}
                    value={section.sectionId}
                    className="flex flex-col items-center p-3 h-auto text-sm"
                  >
                    <div className="font-medium mb-1">{section.sectionTitle}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      section.percentage >= 80 ? 'bg-success/20 text-success-foreground' :
                      section.percentage >= 60 ? 'bg-warning/20 text-warning-foreground' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      {section.percentage}%
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {results.sections.map((section: any) => (
                <TabsContent key={section.sectionId} value={section.sectionId} className="mt-4">
                  <div className="space-y-4">
                    {/* Section Header */}
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h3 className="font-semibold text-foreground">{section.sectionTitle}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{formatDuration(section.duration)}</span>
                          <span>•</span>
                          <span>{new Date(section.completedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-foreground">{section.score}/{section.maxScore}</div>
                        <div className={`text-sm ${
                          section.percentage >= 80 ? 'text-success-foreground' :
                          section.percentage >= 60 ? 'text-warning-foreground' :
                          'text-destructive'
                        }`}>
                          {section.percentage}%
                        </div>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-3">
                      {section.questions.map((question: any, qIndex: number) => (
                        <div
                          key={question.questionId}
                          className={`border rounded p-4 ${
                            question.isCorrect ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0">
                              {question.isCorrect ? (
                                <Check className="w-4 h-4 text-success-foreground" />
                              ) : (
                                <X className="w-4 h-4 text-destructive" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-foreground">Q{qIndex + 1}</span>
                                <span className="text-sm text-muted-foreground">{question.type.replace('-', ' ')}</span>
                                <span className="text-xs text-muted-foreground">{question.pointValue}pts</span>
                              </div>

                              <div
                                className="text-sm text-foreground mb-3"
                                dangerouslySetInnerHTML={{ __html: question.question }}
                              />

                              {question.myAnswer && (
                                <div className="text-sm mb-2">
                                  <span className="text-muted-foreground">Your answer: </span>
                                  <span className="text-foreground">
                                    {question.myAnswer.answerText && question.myAnswer.answerText}
                                    {question.myAnswer.answerOptions && question.options && (
                                      question.options
                                        .filter((opt: any) => question.myAnswer!.answerOptions!.includes(opt.id))
                                        .map((opt: any) => opt.text)
                                        .join(', ')
                                    )}
                                  </span>
                                </div>
                              )}

                              {!question.isCorrect && question.options && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Correct: </span>
                                  <span className="text-success-foreground">
                                    {question.options
                                      .filter((opt: any) => opt.isCorrect)
                                      .map((opt: any) => opt.text)
                                      .join(', ')
                                    }
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}