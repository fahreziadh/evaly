import { convexQuery } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import type { DataModel, Id } from '@convex/_generated/dataModel'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { ConvexError } from 'convex/values'
import {
  CheckCircleIcon,
  CheckIcon,
  FileSearch,
  FileText,
  LockIcon
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { NotFound } from '@/components/pages/not-found'
import LoadingScreen from '@/components/shared/loading-screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import { testTypeFormatter } from '@/lib/test-type-formatter'

import NavbarLobby from './-components/navbar.lobby'

export const Route = createFileRoute('/(participant)/s/$testId/')({
  component: RouteComponent,
  async loader(ctx) {
    const [, test] = await Promise.all([
      ctx.context.queryClient.ensureQueryData(
        convexQuery(api.participant.testSection.getByTestId, {
          testId: ctx.params.testId as Id<'test'>
        })
      ),
      ctx.context.queryClient.ensureQueryData(
        convexQuery(api.participant.test.getById, {
          id: ctx.params.testId as Id<'test'>
        })
      )
    ])

    return test
  },
  head(ctx) {
    return {
      meta: [
        {
          title: ctx.loaderData?.title || 'Untitled Test' + ' - Evaly',
          description: ctx.loaderData?.description
        }
      ]
    }
  }
})

function RouteComponent() {
  const user = useQuery(api.participant.profile.getProfile)
  const { testId } = Route.useParams()
  const { data: test } = useSuspenseQuery(
    convexQuery(api.participant.test.getById, {
      id: testId
    })
  )

  if (test === undefined || user === undefined) {
    return <LoadingScreen />
  }

  if (test === null || user === null) {
    return <NotFound />
  }

  return (
    <>
      <NavbarLobby user={user} />
      <div className="container mt-[5vh] max-w-2xl pb-20 md:mt-[10vh]">
        <h1 className="mb-4 text-xl font-semibold">{test.title || 'Untitled Test'}</h1>

        <QuickInfo test={test} />
        <TestSections test={test} />
        {test.description?.replace('<p></p>', '').length ? (
          <>
            <h1 className="mt-8 font-semibold">Description</h1>
            <div
              className="custom-prose mt-2"
              dangerouslySetInnerHTML={{ __html: test.description || '' }}
            />
          </>
        ) : null}
      </div>
    </>
  )
}

const QuickInfo = ({ test }: { test: DataModel['test']['document'] }) => {
  const { data: testSections } = useSuspenseQuery(
    convexQuery(api.participant.testSection.getByTestId, {
      testId: test._id
    })
  )

  return (
    <div className="flex flex-row flex-wrap">
      <div className="flex items-center gap-3 text-sm">
        {test.finishedAt ? (
          <Badge>
            <CheckCircleIcon />
            Test Finished
          </Badge>
        ) : null}
        <Badge variant={'secondary'}>{testTypeFormatter(test.type)}</Badge>
        {testSections && testSections?.length > 1 ? (
          <Badge variant={'secondary'}>
            <FileSearch className="text-muted-foreground h-4 w-4" />
            <span>{testSections.length} Sections</span>
          </Badge>
        ) : null}
        <Badge variant={'secondary'}>
          <FileText className="text-muted-foreground h-4 w-4" />
          <span>
            {testSections?.reduce((acc, curr) => acc + curr.numOfQuestions, 0)}{' '}
            Questions
          </span>
        </Badge>
      </div>
    </div>
  )
}

const TestSections = ({ test }: { test: DataModel['test']['document'] }) => {
  const navigate = useNavigate()
  const [startTestSectionId, setStartTestSectionId] = useState<Id<'testSection'>>()
  const { data: testSections } = useSuspenseQuery(
    convexQuery(api.participant.testSection.getByTestId, {
      testId: test._id
    })
  )

  const testAttempts = useQuery(
    api.participant.testAttempt.getByTestIdAndParticipantId,
    {
      testId: test._id
    }
  )

  const startTestAttempt = useMutation(api.participant.testAttempt.start)

  const handleStartTestAttempt = async (testSectionId: Id<'testSection'>) => {
    setStartTestSectionId(testSectionId)
    try {
      const testAttempt = await startTestAttempt({ testSectionId })
      navigate({
        to: '/s/$testId/$attemptId',
        params: {
          testId: test._id,
          attemptId: testAttempt._id
        }
      })
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.data : 'Unknown error')
    } finally {
      setStartTestSectionId(undefined)
    }
  }

  if (testSections?.length === 0) {
    return (
      <div className="mt-8">
        <h1 className="font-semibold">Sections</h1>
        <p className="text-muted-foreground text-sm">
          No sections found for this test.
        </p>
      </div>
    )
  }

  if (testSections?.length === 1) {
    const isFinished =
      testAttempts === undefined ||
      testAttempts?.find(attempt => attempt.testSectionId === testSections[0]._id)
        ?.finishedAt !== undefined

    return (
      <Button
        disabled={testAttempts === undefined || !!startTestSectionId || isFinished}
        variant={'default'}
        className="mt-4 w-max px-4 select-none"
        onClick={() => handleStartTestAttempt(testSections[0]._id)}
      >
        {startTestSectionId ? 'Starting...' : null}
        {testAttempts === undefined ? 'Loading...' : null}
        {testAttempts && isFinished ? (
          <>
            <CheckIcon />
            Finished
          </>
        ) : null}
        {!isFinished && !startTestSectionId && !testAttempts ? 'Start Test' : null}
        {testAttempts && !isFinished && !startTestSectionId ? 'Continue Test' : null}
      </Button>
    )
  }

  return (
    <>
      <h1 className="mt-8 font-semibold">Sections</h1>
      <Card className="mt-3 divide-y">
        {testSections?.map(section => {
          const attempt = testAttempts?.find(
            attempt => attempt.testSectionId === section._id
          )
          const attemptFinished = attempt?.finishedAt !== undefined
          return (
            <div
              key={section._id}
              className="hover:bg-secondary flex flex-row items-center px-6 py-3 transition hover:border-solid"
            >
              <div className="flex flex-1 flex-row items-center gap-2">
                <h1 className="text-sm font-medium">
                  {section.order}. {section.title || `Section ${section.order}`}
                </h1>
                <Badge variant={'outline'}>
                  {section.numOfQuestions} Question
                  {section.numOfQuestions <= 1 ? '' : 's'}
                </Badge>
              </div>
              <div>
                {attemptFinished ? (
                  <Badge variant="success">
                    <CheckIcon /> Finished
                  </Badge>
                ) : test.finishedAt ? (
                  <Badge variant="outline">Test Ended</Badge>
                ) : (
                  <Button
                    disabled={
                      testAttempts === undefined ||
                      !!test.finishedAt ||
                      startTestSectionId === section._id
                    }
                    variant={'outline'}
                    size={'sm'}
                    className="px-3 select-none"
                    onClick={() => handleStartTestAttempt(section._id)}
                  >
                    {test.finishedAt ? <LockIcon /> : null}
                    {startTestSectionId === section._id
                      ? 'Starting...'
                      : attempt
                        ? 'Continue'
                        : 'Start'}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </Card>
    </>
  )
}
