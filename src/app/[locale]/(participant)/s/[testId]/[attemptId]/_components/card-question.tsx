import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { trpc } from '@/trpc/trpc.client'

import { Question } from '@/types/question'
import { UpdateTestAttemptAnswer } from '@/types/test.attempt'

const CardQuestion = ({
  question,
  i,
  defaultAnswer,
  attemptId
}: {
  question: Partial<Question>
  i: number
  defaultAnswer?: UpdateTestAttemptAnswer
  attemptId: string
}) => {
  const [targetOptionId, setTargetOptionId] = useState<string | null>(null)

  const {
    reset,
    control,
    register,
    formState: { isDirty },
    handleSubmit,
    watch
  } = useForm<UpdateTestAttemptAnswer>({
    defaultValues: defaultAnswer
  })

  const answerText = watch('answerText')

  useEffect(() => {
    if (defaultAnswer !== undefined) {
      reset(defaultAnswer)
    }
  }, [defaultAnswer, reset])

  const { mutate: postAnswer, isPending: isPendingAnswer } =
    trpc.participant.attempt.submitAnswer.useMutation({
      onError(error) {
        toast.error(error.message)
      },
      onSuccess(data) {
        reset(data)
      }
    })

  // Handle option select for option based question
  const handleSubmitAnswer = (data: UpdateTestAttemptAnswer) => {
    postAnswer({
      data: {
        ...data,
        questionId: question.id
      },
      attemptId
    })
  }

  return (
    <div className="py-12">
      <div className="flex flex-row items-center justify-between">
        <span className="text-muted-foreground text-sm">Question {i + 1}</span>
        <span className="text-muted-foreground flex flex-row items-center gap-2 text-sm">
          {isPendingAnswer ? (
            <>
              <Loader2 className="size-3 animate-spin" /> Saving...
            </>
          ) : null}
        </span>
      </div>
      <div className="mt-2">
        <div
          className="custom-prose lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: question.question ?? 'No question found'
          }}
        />

        {/* Option-based question */}
        {question.type === 'multiple-choice' || question.type === 'yes-or-no' ? (
          <Controller
            control={control}
            name="answerOptions"
            render={({ field }) => (
              <div className="mt-8 flex flex-col">
                {question.options?.map((option, i) => (
                  <div
                    key={option.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-2 pt-3 hover:opacity-70 md:gap-4',
                      field.value?.includes(option.id)
                        ? 'underline underline-offset-4'
                        : ''
                    )}
                    onClick={() => {
                      if (isPendingAnswer) return
                      setTargetOptionId(option.id)
                      handleSubmitAnswer({
                        // Synchronize the answer with the backend
                        answerOptions: [option.id]
                      })
                    }}
                  >
                    <Button
                      variant={field.value?.includes(option.id) ? 'default' : 'outline'}
                      size={'icon-sm'}
                    >
                      {option.id === targetOptionId && isPendingAnswer ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        String.fromCharCode(65 + i)
                      )}
                    </Button>
                    <p className="flex-1 pt-0.5 text-sm md:text-base">{option.text}</p>
                  </div>
                ))}
              </div>
            )}
          />
        ) : null}

        {/* Text-based question */}
        {question.type === 'text-field' ? (
          <div className="mt-8 flex flex-col gap-3">
            <Textarea
              {...register('answerText')}
              className="resize-none p-4 lg:text-base"
              placeholder="Type your answer here..."
            />
            {isDirty && answerText !== '' && (
              <Button
                variant="default"
                size="sm"
                className="w-max"
                onClick={handleSubmit(handleSubmitAnswer)}
              >
                Save
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CardQuestion
