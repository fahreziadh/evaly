'use client'

import { cn } from '@/lib/utils'
import { useMutationState } from '@tanstack/react-query'
import { CheckIcon, ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useTransition } from 'react'
import { toast } from 'sonner'

import ParticipantAccount from '@/components/shared/account/participant-account'
import { Link } from '@/components/shared/progress-bar'
import { useProgressRouter } from '@/components/shared/progress-bar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { trpc } from '@/trpc/trpc.client'

import { TestAttempt, TestAttemptWithSection } from '@/types/test.attempt'

const Navbar = ({ attempt }: { attempt: TestAttemptWithSection }) => {
  return (
    <div
      className={cn(
        'bg-background flex h-14 flex-row items-center justify-between px-4'
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/s/${attempt.testId}`}>
              <Button variant={'ghost'} size={'icon'}>
                <ChevronLeft />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Are you sure want to go back?</TooltipContent>
        </Tooltip>

        <h1 className="font-medium">
          {attempt.testSection?.title || `Section ${attempt.testSection?.order}`}
        </h1>
      </div>
      <div className="flex flex-row items-center gap-2">
        <DialogSubmitAttempt attemptId={attempt.id} />
        <ParticipantAccount />
      </div>
    </div>
  )
}

const DialogSubmitAttempt = ({ attemptId }: { attemptId: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: attempt, isPending: isPendingAttempt } =
    trpc.participant.attempt.getAttemptById.useQuery(attemptId as string)

  const { data: attemptAnswers, isPending: isPendingAttemptAnswers } =
    trpc.participant.attempt.getAttemptAnswers.useQuery(
      {
        attemptId: attemptId as string
      },
      {
        enabled: !!attempt && isOpen
      }
    )

  const totalQuestions = attempt?.testSection?.question?.length
  const answeredQuestions = attemptAnswers?.length ?? 0
  const remainingQuestions = totalQuestions ? totalQuestions - answeredQuestions : 0

  // detect if user still updating the answer from card-question
  const listUpdatingAnswer = useMutationState({
    filters: {
      predicate: mutation => {
        return (
          mutation.state.status === 'pending' &&
          mutation.options.mutationKey?.[0] === 'post-answer'
        )
      }
    }
  })

  const isStillUpdatingAnswer = listUpdatingAnswer.length > 0

  const [isRedirecting, setIsRedirecting] = useTransition()
  const router = useProgressRouter()

  const {
    isPending: isSubmitting,
    data: dataUpdatedAttempt,
    mutate: submitAttempt,
    isError,
    error,
    reset: resetMutation
  } = trpc.participant.attempt.submitAttempt.useMutation({
    onSuccess() {
      toast.success('Attempt submitted successfully')
    },
    onError(error) {
      toast.error(error.message)
    }
  })

  const onGoToLobby = (data: TestAttempt) => {
    setIsRedirecting(() => {
      router.replace(`/s/${data.testId}`)
    })
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          // When closing, we reset the dialog state
          setIsOpen(false)
          // Reset the mutation state when dialog closes
          resetMutation()
        } else {
          setIsOpen(true)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" className="mr-4" disabled={isStillUpdatingAnswer}>
          Submit this section
        </Button>
      </DialogTrigger>
      <DialogContent>
        {isError ? (
          <DialogHeader>
            <DialogTitle>Oops, something went wrong!</DialogTitle>
            <DialogDescription>{error.message}</DialogDescription>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogHeader>
        ) : !dataUpdatedAttempt ? (
          <DialogHeader>
            <DialogTitle>Are you sure you want to submit this section?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
            <ul>
              {remainingQuestions > 0 && (
                <li className="text-red-500">
                  You have {remainingQuestions} questions left to answer.
                </li>
              )}
            </ul>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="default"
                onClick={() => submitAttempt({ attemptId })}
                disabled={
                  isSubmitting ||
                  isRedirecting ||
                  isStillUpdatingAnswer ||
                  isPendingAttempt ||
                  isPendingAttemptAnswers
                }
              >
                {isSubmitting
                  ? 'Submitting...'
                  : isRedirecting
                    ? 'Redirecting...'
                    : 'Yes, submit'}
              </Button>
            </DialogFooter>
          </DialogHeader>
        ) : (
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center gap-2">
              <CheckIcon className="size-6 text-green-500" />
              You have successfully submitted this section
            </DialogTitle>
            <DialogDescription>
              {dataUpdatedAttempt.nextSection
                ? 'You can now go to the next section or go to the lobby to see the result of this section.'
                : 'You can now go to the lobby to see the result.'}
            </DialogDescription>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => dataUpdatedAttempt && onGoToLobby(dataUpdatedAttempt)}
                >
                  Go to lobby
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default Navbar
