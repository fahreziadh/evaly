'use client'

import { useParams } from 'next/navigation'

import { usePathname, useRouter } from '@/i18n/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { trpc } from '@/trpc/trpc.client'

import CardQuestion from './_components/card-question'
import Navbar from './_components/navbar'

const Page = () => {
  const { attemptId, testId } = useParams()
  const router = useRouter()
  const pathName = usePathname()
  const {
    data: attempt,
    isPending: isPendingAttempt,
    error: errorAttempt
  } = trpc.participant.attempt.getAttemptById.useQuery(attemptId as string)

  const { data: attemptAnswers, isPending: isPendingAttemptAnswers } =
    trpc.participant.attempt.getAttemptAnswers.useQuery({
      attemptId: attemptId as string
    })

  if (isPendingAttempt || isPendingAttemptAnswers) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    )
  }

  if (errorAttempt) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-2xl font-medium">
        <h1>{errorAttempt.message}</h1>
        {errorAttempt.data?.code === 'UNAUTHORIZED' && (
          <Button onClick={() => router.push(`/login?callbackURL=${pathName}`)}>
            Login
          </Button>
        )}
        {errorAttempt.data?.code === 'FORBIDDEN' && (
          <Button onClick={() => router.push(`/s/${testId}`)}>Go to Home</Button>
        )}
      </div>
    )
  }

  const listQuestions = attempt?.testSection?.question

  if (!listQuestions) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>No questions found</p>
      </div>
    )
  }

  return (
    <>
      <Navbar attempt={attempt} />
      <div className="container flex max-w-[900px] flex-col divide-y divide-dashed select-none">
        {listQuestions.map((question, i) => (
          <CardQuestion
            key={question.id}
            question={question}
            i={i}
            attemptId={attemptId as string}
            defaultAnswer={attemptAnswers?.find(
              answer => answer.questionId === question.id
            )}
          />
        ))}
      </div>
    </>
  )
}

export default Page
