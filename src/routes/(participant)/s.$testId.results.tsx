import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Award,
  Target
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
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "text-green-600 bg-green-50 border-green-200";
      case "B": return "text-blue-600 bg-blue-50 border-blue-200";
      case "C": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "D": return "text-orange-600 bg-orange-50 border-orange-200";
      case "F": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-5xl mx-auto px-4">
        {/* Compact Header */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate({ to: "/s/$testId", params: { testId } })}
            className="mb-3 -ml-2"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Test
          </Button>
          
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Test Results</h1>
                <p className="text-sm text-gray-600">Your performance summary</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{results.totalScore}</div>
                  <div className="text-xs text-muted-foreground">/ {results.maxPossibleScore}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{results.percentage}%</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-md border ${getGradeColor(results.grade)}`}>
              <div className="text-center">
                <div className="text-xl font-bold">{results.grade}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Stats Bar */}
        <div className="bg-white rounded-lg p-3 mb-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="font-medium">Progress:</span>
                <Progress value={results.percentage} className="w-20 h-2" />
                <span className="text-xs text-muted-foreground">{results.percentage}%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{results.completedSectionsCount}/{results.sectionsCount} sections</span>
              </div>
              <Badge variant={results.isCompleted ? "success" : "secondary"} className="text-xs">
                {results.isCompleted ? "Complete" : "In Progress"}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Grade Distribution</div>
            </div>
          </div>
        </div>

        {/* Section Results */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Section Results
            </h2>
          </div>
          <div className="p-4">
            <Tabs value={selectedSection || results.sections[0]?.sectionId} onValueChange={setSelectedSection}>
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 h-auto p-1">
                {results.sections.map((section: any) => (
                  <TabsTrigger 
                    key={section.sectionId} 
                    value={section.sectionId}
                    className="flex flex-col items-center p-2 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <div className="font-medium text-sm">{section.sectionTitle}</div>
                    <div className="text-xs opacity-80">
                      {section.score}/{section.maxScore} ({section.percentage}%)
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {results.sections.map((section: any) => (
                <TabsContent key={section.sectionId} value={section.sectionId} className="mt-3">
                  <div className="space-y-3">
                    {/* Compact Section Summary */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <h3 className="font-medium">{section.sectionTitle}</h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(section.completedAt).toLocaleDateString()} • 
                          <Clock className="inline w-3 h-3 mx-1" />
                          {formatDuration(section.duration)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          {section.score}/{section.maxScore}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {section.percentage}% score
                        </div>
                      </div>
                    </div>

                    {/* Streamlined Questions */}
                    <div className="space-y-2">
                      {section.questions.map((question: any, qIndex: number) => (
                        <div key={question.questionId} className={`border rounded-md p-3 ${question.isCorrect ? 'border-l-4 border-l-green-400 bg-green-50/30' : 'border-l-4 border-l-red-400 bg-red-50/30'}`}>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {question.isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">Q{qIndex + 1}</span>
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    {question.type.replace('-', ' ')}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {question.pointValue}pt
                                  </span>
                                </div>
                                <span className={`text-xs font-medium ${question.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  {question.isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                              </div>
                              
                              <div 
                                className="prose prose-sm mb-2 text-sm" 
                                dangerouslySetInnerHTML={{ __html: question.question }}
                              />
                              
                              <div className="space-y-2">
                                {/* Compact answer display */}
                                {question.myAnswer && (
                                  <div className="p-2 bg-blue-50 rounded text-xs">
                                    <span className="font-medium text-blue-900">Your answer: </span>
                                    {question.myAnswer.answerText && (
                                      <span>{question.myAnswer.answerText}</span>
                                    )}
                                    {question.myAnswer.answerOptions && question.options && (
                                      <span>
                                        {question.options
                                          .filter((opt: any) => question.myAnswer!.answerOptions!.includes(opt.id))
                                          .map((opt: any) => opt.text)
                                          .join(', ')
                                        }
                                      </span>
                                    )}
                                  </div>
                                )}

                                {!question.isCorrect && question.options && (
                                  <div className="p-2 bg-green-50 rounded text-xs">
                                    <span className="font-medium text-green-900">Correct: </span>
                                    <span className="text-green-700">
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