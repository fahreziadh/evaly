import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  Mail,
  Timer,
  XCircle,
  XIcon
} from 'lucide-react'
import { useMemo, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerNavbar,
  DrawerTitle
} from '@/components/ui/drawer'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { trpc } from '@/trpc/trpc.client'

import { ExportDialogDetails } from './export-dialog-details'
import { Section, Submission } from './types'

dayjs.extend(relativeTime)

interface SubmissionDrawerProps {
  submission: Submission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  sections: Section[]
  testId: string
}

export const SubmissionDrawer = ({
  submission,
  open,
  onOpenChange,
  sections,
  testId
}: SubmissionDrawerProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview')

  // Fetch detailed submission data when drawer is open
  const { data: submissionDetails, isLoading } =
    trpc.organization.test.getTestResultsByParticipant.useQuery(
      {
        id: testId,
        email: submission?.email || ''
      },
      {
        enabled: !!submission?.email
      }
    )

  // Use the detailed questions from the API response
  const questions = useMemo(() => {
    if (!submissionDetails) return []
    return submissionDetails.questions || []
  }, [submissionDetails])

  // Group questions by section
  const questionsBySection = useMemo(() => {
    if (!questions.length) return {}

    return questions.reduce(
      (acc, question) => {
        const sectionId = question.sectionId
        if (!acc[sectionId]) {
          acc[sectionId] = []
        }
        acc[sectionId].push(question)
        return acc
      },
      {} as Record<string, typeof questions>
    )
  }, [questions])

  if (!submission) return null

  // Calculate section performance
  const getSectionPerformance = (sectionId: string) => {
    const answered = submission.sectionAnswers?.[sectionId] || 0
    const correct = submission.sectionCorrect?.[sectionId] || 0
    const wrong = submission.sectionWrong?.[sectionId] || 0
    const section = sections.find(s => s.id === sectionId)
    const total = section?.questionsCount || 0
    const unanswered = total - answered
    const score = total > 0 ? Math.round((correct / total) * 100) : 0

    return { answered, correct, wrong, unanswered, total, score }
  }

  // Get progress color based on score
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600'
    if (score >= 60) return 'bg-amber-600'
    return 'bg-red-600'
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-dvh">
        <DrawerNavbar
          onBack={() => onOpenChange(false)}
          titleComponent={
            <DrawerHeader className="py-0 text-left">
              <div className="flex items-center gap-3">
                <Avatar className="border-primary/10 h-10 w-10 border-2">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(submission.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DrawerTitle className="font-semibold">{submission.name}</DrawerTitle>
                  <DrawerDescription className="text-muted-foreground flex items-center gap-2 text-sm leading-1">
                    <Mail className="h-3 w-3" /> {submission.email}
                    {submission.submittedAt && (
                      <>
                        <span className="mx-1">•</span>
                        <Calendar className="h-3 w-3" />{' '}
                        {dayjs(submission.submittedAt).format('MMM D, YYYY')}
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
            className="container max-w-4xl py-6"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-8">
                {/* Status Card */}
                <Card className="border-none">
                  <CardHeader className="px-0">
                    <CardTitle className="flex items-center gap-2 font-medium">
                      <BarChart3 className="text-primary h-5 w-5" />
                      Test Performance
                    </CardTitle>
                    <CardDescription>
                      {submission.status === 'in-progress' ? (
                        <div className="flex items-center gap-1 text-amber-500">
                          <Timer className="h-4 w-4" />
                          <span>This test is still in progress</span>
                        </div>
                      ) : submission.status === 'test-ended' ? (
                        <div className="flex items-center gap-1 text-red-500">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Time&apos;s up before completion</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Calendar className="text-muted-foreground h-4 w-4" />
                          <span>
                            Completed on{' '}
                            {submission.submittedAt
                              ? dayjs(submission.submittedAt).format(
                                  'MMMM D, YYYY [at] h:mm A'
                                )
                              : 'Unknown date'}
                          </span>
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="mt-2 grid grid-cols-2 gap-6 md:grid-cols-4">
                      <div className="flex flex-col border border-dashed p-3">
                        <div className={`text-2xl font-medium`}>
                          {submission.score}%
                        </div>
                        <div className="text-muted-foreground text-sm">Score</div>
                      </div>

                      <div className="flex flex-col border border-dashed p-3">
                        <div className="text-3xl font-medium">
                          #{submission.rank || '-'}
                        </div>
                        <div className="text-muted-foreground mt-1 text-sm">Rank</div>
                      </div>

                      <div className="flex flex-col border border-dashed p-3">
                        <div className="text-3xl font-medium">{submission.correct}</div>
                        <div className="text-muted-foreground text-sm">Correct</div>
                      </div>

                      <div className="flex flex-col border border-dashed p-3">
                        <div className="text-3xl font-medium">{submission.wrong}</div>
                        <div className="text-muted-foreground text-sm">Wrong</div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Progress</span>
                        <span className="font-medium">
                          {submission.answered}/{submission.totalQuestions} questions
                        </span>
                      </div>

                      <Progress
                        value={(submission.answered / submission.totalQuestions) * 100}
                      />

                      <div className="text-muted-foreground mt-2 flex justify-between px-1 text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="size-4 text-green-600" />
                          <span>{submission.correct} correct</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="size-4 text-red-600" />
                          <span>{submission.wrong} wrong</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HelpCircle className="text-muted-foreground size-4" />
                          <span>{submission.unanswered} unanswered</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 mt-8 flex items-center justify-between rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="text-muted-foreground h-4 w-4" />
                        <span>
                          Started:{' '}
                          {submission.startedAt
                            ? dayjs(submission.startedAt).format('h:mm A')
                            : 'Unknown'}
                        </span>
                      </div>
                      {submission.submittedAt && (
                        <div className="flex items-center gap-1">
                          <Clock className="text-muted-foreground h-4 w-4" />
                          <span>
                            Submitted: {dayjs(submission.submittedAt).format('h:mm A')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Section Performance */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 px-1 font-medium">
                    <BarChart3 className="text-primary h-5 w-5" />
                    Section Performance
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {sections.map((section, index) => {
                      const performance = getSectionPerformance(section.id)
                      return (
                        <Card key={section.id} className="overflow-hidden">
                          <CardHeader className={`py-3`}>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base font-medium">
                                {section.name || `Section ${index + 1}`}
                              </CardTitle>
                              <Badge>{performance.score}%</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="border-t border-dashed pt-6">
                            <div className="grid grid-cols-4 gap-4">
                              <div className="flex flex-col border border-dashed p-3">
                                <span className="text-lg">
                                  {performance.answered}/{performance.total}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  Answered
                                </span>
                              </div>
                              <div className="flex flex-col border border-dashed p-3">
                                <span className="text-lg">{performance.correct}</span>
                                <span className="text-muted-foreground text-xs">
                                  Correct
                                </span>
                              </div>
                              <div className="flex flex-col border border-dashed p-3">
                                <span className="text-lg">{performance.wrong}</span>
                                <span className="text-muted-foreground text-xs">
                                  Wrong
                                </span>
                              </div>
                              <div className="flex flex-col border border-dashed p-3">
                                <span className="font-medium">
                                  {performance.unanswered}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  Unanswered
                                </span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Progress
                                value={performance.score}
                                className={`h-2 ${getProgressColor(performance.score)}`}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="questions"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-medium">Questions</CardTitle>
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
                          <HelpCircle className="text-muted-foreground size-4" />
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
                  <div className="flex flex-col items-center justify-center gap-3 py-20">
                    <div className="relative">
                      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                        <Loader2 className="text-primary h-8 w-8 animate-spin" />
                      </div>
                      <div className="bg-primary absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <span className="text-muted-foreground font-medium">
                      Loading questions...
                    </span>
                  </div>
                ) : (
                  <Accordion type="multiple" className="min-h-dvh w-full space-y-4">
                    {sections.map((section, i) => {
                      const sectionQuestions = questionsBySection[section.id] || []
                      const performance = getSectionPerformance(section.id)

                      return (
                        <Card key={section.id} className="">
                          <AccordionItem value={section.id} className="border-none">
                            <AccordionTrigger className="hover:bg-primary/5 cursor-pointer px-6 py-4 transition-colors">
                              <div className="flex flex-1 items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {section.name || `Section ${i + 1}`}
                                  </span>
                                  <Badge className={`ml-2`} variant={'outline'}>
                                    {performance.score}%
                                  </Badge>
                                </div>
                                <div className="mr-4 flex items-center gap-2 text-sm">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="size-4 text-green-600" />
                                    {performance.correct}
                                  </span>
                                  <span className="text-muted-foreground/50">/</span>
                                  <span className="flex items-center gap-1">
                                    <XIcon className="size-4 text-red-600" />
                                    {performance.wrong}
                                  </span>
                                  <span className="text-muted-foreground/50">/</span>
                                  <span className="flex items-center gap-1">
                                    <HelpCircle className="text-muted-foreground size-4" />
                                    {performance.unanswered}
                                  </span>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="border-t border-dashed px-0 pt-4">
                              <div className="space-y-4 px-4">
                                {sectionQuestions.map((question, index) => (
                                  <div key={question.id} className="border">
                                    <div className={`border-b border-dashed p-4`}>
                                      <div className="bgbl flex items-start gap-3">
                                        <div className="mt-0.5 flex-shrink-0">
                                          {question.isCorrect === true ? (
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500/10">
                                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            </div>
                                          ) : question.isCorrect === false ? (
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10">
                                              <XCircle className="h-4 w-4 text-red-600" />
                                            </div>
                                          ) : (
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-500/10">
                                              <HelpCircle className="text-muted-foreground h-4 w-4" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                          <div className="flex justify-between">
                                            <h4 className="font-medium">
                                              Question {index + 1}
                                            </h4>
                                            <Badge
                                              variant="outline"
                                              className="capitalize shadow-sm"
                                            >
                                              {question.type?.replace(/_/g, ' ') ||
                                                'Unknown'}
                                            </Badge>
                                          </div>
                                          <div
                                            className="custom-prose text-sm"
                                            dangerouslySetInnerHTML={{
                                              __html: question.text || ''
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-4">
                                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="bg-primary/10 space-y-2 rounded-lg p-3">
                                          <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wider uppercase">
                                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                                            Correct Answer
                                          </p>
                                          <div
                                            className="custom-prose text-sm font-medium"
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                question.correctAnswer ||
                                                'Not available'
                                            }}
                                          />
                                        </div>
                                        <div
                                          className={`space-y-2 rounded-lg p-3 ${
                                            question.isCorrect === true
                                              ? 'bg-green-500/10'
                                              : question.isCorrect === false
                                                ? 'bg-red-500/10'
                                                : 'bg-primary/10'
                                          }`}
                                        >
                                          <p className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wider uppercase">
                                            {question.isCorrect === true ? (
                                              <CheckCircle2 className="size-3 text-green-600" />
                                            ) : question.isCorrect === false ? (
                                              <XCircle className="size-3 text-red-600" />
                                            ) : (
                                              <HelpCircle className="text-muted-foreground size-3" />
                                            )}
                                            Participant&apos;s Answer
                                          </p>
                                          <div
                                            className={`text-sm font-medium ${
                                              question.isCorrect === true
                                                ? 'text-green-600'
                                                : question.isCorrect === false
                                                  ? 'text-red-600'
                                                  : 'text-muted-foreground italic'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                question.participantAnswer ||
                                                'Not answered'
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
                      )
                    })}
                  </Accordion>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter className="border-t py-3">
          <div className="container flex max-w-4xl items-center justify-between gap-2">
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
  )
}
