'use client'

import { useParams } from 'next/navigation'

import {
  cn,
  insertQuestionsAtCorrectPosition,
  updateQuestionInArray
} from '@/lib/utils'
import { EyeIcon, EyeOffIcon, PlusIcon } from 'lucide-react'
import { Reorder } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

import CardQuestion from '@/components/shared/card/card-question'
import DialogAddQuestion from '@/components/shared/dialog/dialog-add-question'
import DialogEditQuestion from '@/components/shared/dialog/dialog-edit-question'
import LoadingScreen from '@/components/shared/loading/loading-screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { trpc } from '@/trpc/trpc.client'

import { Question } from '@/types/question'

import Header from './_components/header'

export const dynamic = 'force-static'

const Page = () => {
  const { templateId } = useParams<{ templateId: string }>()
  const [selectedEditQuestion, setSelectedEditQuestion] = useState<Question>()
  const { data: questionTemplate, isLoading: isLoadingQuestionTemplate } =
    trpc.organization.questionTemplate.getById.useQuery({
      id: templateId as string
    })
  const [localQuestions, setLocalQuestions] = useState<Question[]>([])
  const [hideOptions, setHideOptions] = useState(false)

  useEffect(() => {
    if (questionTemplate) {
      setLocalQuestions(questionTemplate.questions)
    }
  }, [questionTemplate])

  const isHavingOptions = useMemo(() => {
    return localQuestions.some(question => (question.options?.length || 0) > 0)
  }, [localQuestions])

  const onHandleChangeOrder = (
    changedQuestionOrders: {
      questionId: string
      order: number
    }[]
  ) => {
    // Update the local questions state to reflect the order changes immediately
    setLocalQuestions(prevQuestions => {
      // Create a copy of the previous questions
      const updatedQuestions = [...prevQuestions]

      // Update the order of each changed question
      changedQuestionOrders.forEach(({ questionId, order }) => {
        const questionIndex = updatedQuestions.findIndex(q => q.id === questionId)
        if (questionIndex !== -1) {
          updatedQuestions[questionIndex] = {
            ...updatedQuestions[questionIndex],
            order
          }
        }
      })

      // Sort the questions by their new order
      return updatedQuestions.sort((a, b) => a.order - b.order)
    })
  }

  return (
    <div className="dashboard-margin container">
      <Header templateId={templateId} />

      <div className="mt-10 flex flex-row items-center justify-between">
        <h1>
          List of questions{' '}
          <Badge variant={'outline'} className="ml-2">
            Total: {localQuestions.length}
          </Badge>
        </h1>

        <div className="flex flex-row items-center gap-2">
          {isHavingOptions ? (
            <Button
              variant={'ghost'}
              size={'sm'}
              onClick={() => setHideOptions(!hideOptions)}
            >
              {hideOptions ? <EyeOffIcon /> : <EyeIcon />} Options
            </Button>
          ) : null}
          <DialogAddQuestion
            showTabsOption={false}
            referenceId={templateId}
            onSuccessCreateQuestion={questions => {
              setSelectedEditQuestion(questions[0])
              setLocalQuestions(prev => [...prev, ...questions])
            }}
            order={localQuestions.length + 1}
            triggerButton={
              <Button size={'sm'} variant={'outline'}>
                <PlusIcon /> Add Question
              </Button>
            }
          />
        </div>
      </div>

      {!isLoadingQuestionTemplate ? (
        <Reorder.Group
          onReorder={() => {}}
          values={localQuestions}
          as="div"
          className={cn(
            'mt-4 flex flex-col overflow-clip',
            localQuestions.length > 0 ? 'pb-6' : ''
          )}
        >
          {localQuestions?.map((question, index) => (
            <Reorder.Item
              value={question}
              as="div"
              key={question.id}
              data-index={index}
              dragListener={false}
            >
              <CardQuestion
                key={question.id}
                onChangeOrder={onHandleChangeOrder}
                data={question}
                onDeleteSuccess={() => {
                  const findIndex = localQuestions.findIndex(q => q.id === question.id)
                  if (findIndex >= 0) {
                    // Update the order of questions after deletion
                    setLocalQuestions(prev => {
                      const filtered = prev.filter(q => q.id !== question.id)
                      return filtered.map((q, index) => ({
                        ...q,
                        order:
                          q.order && question.order && q.order > question.order
                            ? q.order - 1
                            : index + 1
                      }))
                    })
                  }
                }}
                onClickEdit={() => {
                  setSelectedEditQuestion(question)
                }}
                previousQuestionId={localQuestions[index - 1]?.id}
                nextQuestionId={localQuestions[index + 1]?.id}
                hideOptions={hideOptions}
              />
              <div
                className={cn(
                  'group/separator relative flex h-12 items-center justify-center',
                  index === localQuestions.length - 1 ? 'mt-4' : ''
                )}
              >
                <DialogAddQuestion
                  showTabsOption={false}
                  referenceId={templateId}
                  order={index + 2}
                  onSuccessCreateQuestion={questions => {
                    setLocalQuestions(prev =>
                      insertQuestionsAtCorrectPosition(prev, questions)
                    )
                    if (questions.length === 1) {
                      setSelectedEditQuestion(questions[0])
                    }
                  }}
                  triggerButton={
                    <Button
                      size={'xxs'}
                      variant={'outline'}
                      className={cn(
                        'absolute opacity-50 group-hover/separator:opacity-100 lg:opacity-0',
                        index === localQuestions.length - 1 ? 'lg:opacity-100' : ''
                      )}
                    >
                      <PlusIcon /> Add Question
                    </Button>
                  }
                />
                <div className="group-hover/separator:border-foreground/20 h-auto w-full border-b border-dashed" />
              </div>
            </Reorder.Item>
          ))}
          {localQuestions?.length === 0 ? (
            <div className="bg-secondary flex flex-col gap-4 p-6">
              <h1>No question found on this section</h1>
              <DialogAddQuestion
                showTabsOption={false}
                referenceId={templateId}
                onSuccessCreateQuestion={data => {
                  setLocalQuestions(data)
                  setSelectedEditQuestion(data[0])
                }}
              />
            </div>
          ) : null}
        </Reorder.Group>
      ) : (
        <LoadingScreen />
      )}

      <DialogEditQuestion
        defaultValue={selectedEditQuestion}
        onClose={() => {
          setSelectedEditQuestion(undefined)
        }}
        onSuccess={data => {
          setSelectedEditQuestion(data)
          setLocalQuestions(prev => updateQuestionInArray(prev, data))
        }}
      />
    </div>
  )
}

export default Page
