import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Check,
  X,
  User,
  Calendar,
  Clock,
  FileText
} from "lucide-react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import LoadingScreen from "@/components/shared/loading-screen";
import { useState } from "react";

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
        <Card className="max-w-md p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
            <p className="text-muted-foreground mb-4">
              You haven't completed this test yet or results are not available.
            </p>
            <Button onClick={() => navigate({ to: "/s/$testId", params: { testId } })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Test
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Calculate total time across all sections
  const totalTime = results.sections.reduce((sum: number, section: any) => sum + section.duration, 0);

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
        </div>

        {/* Participant & Test Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Participant Details */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">Participant Details</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name: </span>
                    <span className="text-foreground">{results.participant?.name || 'Anonymous'}</span>
                  </div>
                  {results.participant?.email && (
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      <span className="text-foreground">{results.participant.email}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">ID: </span>
                    <span className="text-foreground font-mono text-xs">{results.participant?.id?.slice(-8) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Test Information */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">Test Information</h3>
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Title: </span>
                    <span className="text-foreground">{results.test?.title}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type: </span>
                    <span className="text-foreground capitalize">{results.test?.type}</span>
                  </div>
                  {results.test?.heldAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Held: </span>
                      <span className="text-foreground">{results.test.heldAt}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Organization: </span>
                    <span className="text-foreground">{results.organization?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Results</h1>
              <p className="text-sm text-muted-foreground">Test completed</p>
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">{results.percentage}%</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">{results.sectionsCount}</div>
              <div className="text-sm text-muted-foreground">Sections</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">{formatDuration(totalTime)}</div>
              <div className="text-sm text-muted-foreground">Total time</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={results.percentage} className="h-2" />
          </div>
        </div>

        {/* Section Details */}
        <div className="rounded">
            {results.sections.length === 1 ? (
              // Single section - show directly
              results.sections.map((section: any) => (
                <div key={section.sectionId} className="space-y-4">
                  {/* Questions */}
                  <div className="space-y-3">
                    {section.questions.map((question: any, qIndex: number) => (
                      <div
                        key={question.questionId}
                        className="border rounded p-4"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0">
                            {question.isCorrect ? (
                              <Check className="w-4 h-4 text-foreground" />
                            ) : (
                              <X className="w-4 h-4 text-foreground" />
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
                                <span className="text-foreground">
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
              ))
            ) : (
              // Multiple sections - show section overview + expandable details
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Section Results</h2>
                </div>

                {/* Section Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {results.sections.map((section: any, index: number) => (
                    <Card
                      key={section.sectionId}
                      className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 border-2"
                      onClick={() => setSelectedSection(selectedSection === section.sectionId ? null : section.sectionId)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-base">{section.sectionTitle}</h3>
                            <p className="text-sm text-muted-foreground">Section {index + 1}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-foreground">{section.percentage}%</div>
                            <div className="text-xs text-muted-foreground">{section.score}/{section.maxScore}</div>
                          </div>
                        </div>

                        <Progress value={section.percentage} className="h-2" />

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(section.duration)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(section.completedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="text-center pt-2 border-t">
                          <span className="text-xs text-muted-foreground">
                            {selectedSection === section.sectionId ? 'Click to collapse' : 'Click to view questions'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Expanded Section Details */}
                {selectedSection && results.sections
                  .filter((section: any) => section.sectionId === selectedSection)
                  .map((section: any) => (
                    <Card key={section.sectionId} className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{section.sectionTitle}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{formatDuration(section.duration)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(section.completedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-foreground">{section.score}/{section.maxScore}</div>
                            <div className="text-lg font-medium text-muted-foreground">{section.percentage}%</div>
                          </div>
                        </div>

                        {/* Questions */}
                        <div className="space-y-3">
                          {section.questions.map((question: any, qIndex: number) => (
                            <div
                              key={question.questionId}
                              className={`border-2 rounded-lg p-4 ${
                                question.isCorrect 
                                  ? 'border-green-200 bg-green-50/50' 
                                  : 'border-red-200 bg-red-50/50'
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  {question.isCorrect ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <X className="w-5 h-5 text-red-600" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="font-semibold text-foreground">Q{qIndex + 1}</span>
                                    <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded">
                                      {question.type.replace('-', ' ')}
                                    </span>
                                    <span className="text-sm font-medium text-foreground bg-background px-2 py-1 rounded">
                                      {question.pointValue} pts
                                    </span>
                                  </div>

                                  <div
                                    className="text-sm text-foreground mb-3 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: question.question }}
                                  />

                                  {question.myAnswer && (
                                    <div className="bg-background rounded-lg p-3 mb-2">
                                      <div className="text-sm">
                                        <span className="font-medium text-muted-foreground">Your answer: </span>
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
                                    </div>
                                  )}

                                  {!question.isCorrect && question.options && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                      <div className="text-sm">
                                        <span className="font-medium text-green-800">Correct answer: </span>
                                        <span className="text-green-900">
                                          {question.options
                                            .filter((opt: any) => opt.isCorrect)
                                            .map((opt: any) => opt.text)
                                            .join(', ')
                                          }
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}