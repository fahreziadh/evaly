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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate({ to: "/s/$testId", params: { testId } })}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Test
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
              <p className="text-gray-600 mt-1">Your performance summary</p>
            </div>
            <div className={`px-6 py-3 rounded-lg border-2 ${getGradeColor(results.grade)}`}>
              <div className="text-center">
                <div className="text-2xl font-bold">{results.grade}</div>
                <div className="text-sm font-medium">{results.percentage}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Results Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Overall Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {results.totalScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  out of {results.maxPossibleScore} points
                </div>
                <Progress value={results.percentage} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {results.completedSectionsCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  of {results.sectionsCount} sections completed
                </div>
                <Badge variant={results.isCompleted ? "success" : "secondary"} className="mt-2">
                  {results.isCompleted ? "Complete" : "In Progress"}
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.percentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Score
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getGradeColor(results.grade)}`}>
                  <Award className="w-4 h-4 mr-1" />
                  Grade {results.grade}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Section Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedSection || results.sections[0]?.sectionId} onValueChange={setSelectedSection}>
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {results.sections.map((section: any) => (
                  <TabsTrigger 
                    key={section.sectionId} 
                    value={section.sectionId}
                    className="flex flex-col items-center p-3"
                  >
                    <div className="font-medium">{section.sectionTitle}</div>
                    <div className="text-sm text-muted-foreground">
                      {section.score}/{section.maxScore} ({section.percentage}%)
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {results.sections.map((section: any) => (
                <TabsContent key={section.sectionId} value={section.sectionId}>
                  <div className="space-y-4 mt-4">
                    {/* Section Summary */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg">{section.sectionTitle}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completed on {new Date(section.completedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {section.score}/{section.maxScore}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="inline w-4 h-4 mr-1" />
                          {formatDuration(section.duration)}
                        </div>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-3">
                      {section.questions.map((question: any, qIndex: number) => (
                        <Card key={question.questionId} className="border-l-4 border-l-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-muted-foreground">
                                    Question {qIndex + 1}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {question.type.replace('-', ' ')}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {question.pointValue} {question.pointValue === 1 ? 'point' : 'points'}
                                  </span>
                                </div>
                                <div 
                                  className="prose prose-sm mb-3" 
                                  dangerouslySetInnerHTML={{ __html: question.question }}
                                />
                                
                                {/* Show participant's answer */}
                                {question.myAnswer && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <div className="text-sm font-medium text-blue-900 mb-1">Your Answer:</div>
                                    {question.myAnswer.answerText && (
                                      <div className="text-sm">{question.myAnswer.answerText}</div>
                                    )}
                                    {question.myAnswer.answerOptions && question.options && (
                                      <div className="space-y-1">
                                        {question.options
                                          .filter((opt: any) => question.myAnswer!.answerOptions!.includes(opt.id))
                                          .map((opt: any) => (
                                            <div key={opt.id} className="text-sm">• {opt.text}</div>
                                          ))
                                        }
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <div className="ml-4">
                                {question.isCorrect ? (
                                  <div className="flex items-center text-green-600">
                                    <CheckCircle className="w-5 h-5 mr-1" />
                                    <span className="text-sm font-medium">Correct</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center text-red-600">
                                    <XCircle className="w-5 h-5 mr-1" />
                                    <span className="text-sm font-medium">Incorrect</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}