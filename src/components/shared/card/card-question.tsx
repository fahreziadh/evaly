import { cn } from '@/lib/utils'
import { ArrowDown, ArrowUp, CheckIcon, Loader2, MousePointerClick } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import DialogDeleteQuestion from '@/components/shared/dialog/dialog-delete-question'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { trpc } from '@/trpc/trpc.client'

import { Question } from '@/types/question'

import { questionTypes } from '@/constants/question-type'

const CardQuestion = ({
  className,
  hideOptions = false,
  data,
  onClickEdit,
  onChangeOrder,
  onDeleteSuccess,
  previousQuestionId,
  nextQuestionId,
  previewOnly
}: {
  className?: string
  hideOptions?: boolean
  data?: Question
  previousQuestionId?: string
  nextQuestionId?: string
  onClickEdit?: () => void
  onChangeOrder?: (questions: { questionId: string; order: number }[]) => void
  onDeleteSuccess?: () => void
  previewOnly?: boolean
}) => {
  const t = useTranslations('Questions')
  const tTestDetail = useTranslations('TestDetail')
  const tCommon = useTranslations('Common')
  const [isMoving, setIsMoving] = useState<'up' | 'down'>()

  const {
    mutateAsync: updateBetweenQuestion,
    isPending: isPendingUpdateBetweenQuestion
  } = trpc.organization.question.updateOrder.useMutation({
    onSuccess() {
      toast.success(t('questionOrderUpdated'))
    },
    onError(error) {
      toast.error(error.message || tCommon('genericUpdateError'))
    }
  })

  const handleMove = async (direction: 'up' | 'down') => {
    if (!data) return
    const currentId = data.id
    setIsMoving(direction)

    // For moving up, we swap with the previous question
    // For moving down, we swap with the next question
    // The index of the question is not important, we just need to swap the order of the questions based on the order-key of the questions
    let questions: { questionId: string; order: number }[] = []

    if (direction === 'up') {
      questions = [
        {
          questionId: currentId,
          order: data.order - 1
        },
        {
          questionId: previousQuestionId as string,
          order: data.order
        }
      ]
    } else {
      questions = [
        {
          questionId: currentId,
          order: data.order + 1
        },
        {
          questionId: nextQuestionId as string,
          order: data.order
        }
      ]
    }

    // We already checked for undefined IDs above, so we can safely assert these are strings
    await updateBetweenQuestion(questions)
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : 'An unknown error occurred'
        )
      })
      .then(() => {
        setIsMoving(undefined)
        onChangeOrder?.(questions)
      })
  }
  const selectedType =
    data?.type && questionTypes[data.type]
      ? questionTypes[data.type]
      : questionTypes['multiple-choice']

  if (!data) return null

  return (
    <Card
      className={cn(
        'group cursor-pointer rounded-none border-transparent bg-transparent transition-all duration-100',
        data.order === 1 ? 'mt-6' : '',
        className
      )}
      onClick={onClickEdit}
    >
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="flex flex-row gap-4">
          <Badge variant={'secondary'}>
            {t('questionNumber', { number: data.order })}
          </Badge>
          {data.pointValue ? (
            <Badge variant={'secondary'}>
              {t('pointValue', { number: data.pointValue })}
            </Badge>
          ) : null}
          <Badge variant={'secondary'}>
            {selectedType.icon && <selectedType.icon size={12} />}
            {tTestDetail(selectedType.value)}
          </Badge>
        </div>
        {!previewOnly ? (
          <div className="invisible flex h-5 flex-row items-center justify-end group-hover:visible">
            <Button
              className="mr-2 hidden group-hover:flex"
              size={'xs'}
              variant={'secondary'}
            >
              <MousePointerClick className="size-4" />
              {t('clickToEdit')}
            </Button>

            {previousQuestionId ? (
              <Button
                onClick={e => {
                  e.stopPropagation()
                  handleMove('up')
                }}
                size={'icon-xs'}
                variant={'ghost'}
                disabled={isPendingUpdateBetweenQuestion && isMoving === 'up'}
              >
                {isMoving === 'up' ? (
                  <Loader2 className="text-muted-foreground animate-spin" />
                ) : (
                  <ArrowUp className="text-muted-foreground" />
                )}
              </Button>
            ) : null}

            {nextQuestionId ? (
              <Button
                onClick={e => {
                  e.stopPropagation()
                  handleMove('down')
                }}
                size={'icon-xs'}
                variant={'ghost'}
                disabled={
                  (isPendingUpdateBetweenQuestion && isMoving === 'down') ||
                  !nextQuestionId
                }
              >
                {isMoving === 'down' ? (
                  <Loader2 className="text-muted-foreground animate-spin" />
                ) : (
                  <ArrowDown className="text-muted-foreground" />
                )}
              </Button>
            ) : null}

            <DialogDeleteQuestion
              className="ml-2"
              questionId={data.id}
              onSuccess={() => {
                onDeleteSuccess?.()
              }}
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div
          className="custom-prose line-clamp-4 h-max max-h-[220px] min-h-[40px] max-w-full overflow-y-auto"
          dangerouslySetInnerHTML={{
            __html:
              !data.question || data.question === '<p></p>'
                ? ` <p class='text-muted-foreground italic'>${t('noQuestionContent')}. ${t('clickToEdit')}.</p>`
                : data.question
          }}
        />
        {!hideOptions ? (
          <div className="mt-4 mb-2 flex flex-col gap-x-10 gap-y-3 text-sm">
            {data.options?.map((option, i) => (
              <div
                key={option.id || `option-${i}`}
                className={cn(
                  'flex flex-row flex-wrap items-start gap-2',
                  option.isCorrect
                    ? 'font-medium text-emerald-600'
                    : 'text-muted-foreground'
                )}
              >
                {option.isCorrect ? (
                  <span className="lowercase">{String.fromCharCode(65 + i)}.</span>
                ) : (
                  <span className="text-muted-foreground lowercase">
                    {String.fromCharCode(65 + i)}.
                  </span>
                )}
                <span>{option.text || t('option', { number: i + 1 })}</span>
                {option.isCorrect ? <CheckIcon size={13} /> : null}
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default CardQuestion
