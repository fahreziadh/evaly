import { api } from '@convex/_generated/api'
import type { DataModel, Id } from '@convex/_generated/dataModel'
import { useMutation } from 'convex/react'

import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

const CardQuestion = ({
  question,
  answers,
  attemptId,
  testId
}: {
  question: DataModel['question']['document']
  answers?: DataModel['testAttemptAnswer']['document']
  attemptId: Id<'testAttempt'>
  testId: Id<'test'>
}) => {
  const setAnswer = useMutation(
    api.participant.testAttemptAnswer.setAnswer
  ).withOptimisticUpdate((localStore, args) => {
    const existingAnswers = localStore.getQuery(
      api.participant.testAttemptAnswer.getByAttemptId,
      {
        testAttemptId: attemptId as Id<'testAttempt'>
      }
    )

    if (existingAnswers) {
      localStore.setQuery(
        api.participant.testAttemptAnswer.getByAttemptId,
        {
          testAttemptId: attemptId as Id<'testAttempt'>
        },
        existingAnswers.map(answer => {
          if (answer.questionId === question._id) {
            return { ...answer, ...args }
          }
          return answer
        })
      )
    }
  })
  const handleSubmitAnswer = ({
    answerOptions,
    answerText
  }: {
    answerOptions?: string[]
    answerText?: string
  }) => {
    setAnswer({
      testAttemptId: attemptId as Id<'testAttempt'>,
      testSectionId: question.referenceId as Id<'testSection'>,
      questionId: question._id,
      answerOptions,
      answerText,
      testId
    })
  }
  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <span className="text-muted-foreground mb-1 text-sm">
          Question {question.order}
        </span>
        <span className="text-muted-foreground flex flex-row items-center gap-2 text-sm">
          {/* {isPendingAnswer ? (
          <>
            <Loader2 className="size-3 animate-spin" /> Saving...
          </>
        ) : null} */}
        </span>
      </div>
      <div
        className="custom-prose lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{
          __html: question.question ?? 'No question found'
        }}
      />

      {/* Option-based question */}
      {question.type === 'multiple-choice' || question.type === 'yes-or-no' ? (
        <div className="mt-4 flex flex-col gap-3">
          {question.options?.map(option => (
            <button
              key={option.id}
              onClick={() => handleSubmitAnswer({ answerOptions: [option.id] })}
              className={cn(
                'h-auto w-max max-w-full rounded-md border px-3 py-1 text-start transition-all',
                answers?.answerOptions?.includes(option.id)
                  ? 'border-primary bg-secondary'
                  : 'border-border hover:border-primary/50 active:border-primary active:bg-primary/5'
              )}
            >
              {/* {option.id === targetOptionId && isPendingAnswer ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                String.fromCharCode(65 + i)
              )} */}
              <div
                className={cn('custom-prose prose-sm max-w-full text-ellipsis')}
                dangerouslySetInnerHTML={{
                  __html: option.text ?? 'No option found'
                }}
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Text-based question */}
      {question.type === 'text-field' ? (
        <div className="mt-8 flex flex-col gap-3">
          <Textarea
            // {...register("answerText")}
            className="resize-none p-4 lg:text-base"
            placeholder="Type your answer here..."
          />
          {/* {isDirty && answerText !== "" && (
            <Button
              variant="default"
              size="sm"
              className="w-max"
              onClick={handleSubmit(handleSubmitAnswer)}
            >
              Save
            </Button>
          )} */}
        </div>
      ) : null}
    </div>
  )
}

export default CardQuestion
