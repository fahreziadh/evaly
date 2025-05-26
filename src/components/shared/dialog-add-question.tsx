import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { Loader2, LockIcon, PencilIcon, Plus, SparklesIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { type QuestionType, questionTypes } from '@/lib/question-type'

const DialogAddQuestion = ({
  order = 1,
  referenceId,
  triggerButton,
  showTabsOption = true,
  onSuccessCreateQuestion
}: {
  testId?: string
  order?: number
  referenceId: string
  triggerButton?: React.ReactNode
  showTabsOption?: boolean
  onSuccessCreateQuestion?: (questionId: Id<'question'>) => void
}) => {
  const [selectedType, setSelectedType] = useState<QuestionType>()
  const [isOpen, setIsOpen] = useState(false)
  const createTest = useMutation(api.organizer.question.createInitialQuestions)

  const handleCreateQuestion = async (type: QuestionType) => {
    if (!order) return
    setSelectedType(type)
    createTest({
      referenceId,
      type,
      order
    })
      .then(questionId => {
        if (questionId) {
          onSuccessCreateQuestion?.(questionId)
        }
      })
      .finally(() => {
        setSelectedType(undefined)
        setIsOpen(false)
      })
  }

  const groupedQuestionTypes = useMemo(() => {
    return Object.values(questionTypes).reduce(
      (acc, type) => {
        const group = type.group || 'Other' // Default group if missing
        if (!acc[group]) {
          acc[group] = []
        }
        acc[group].push(type)
        return acc
      },
      {} as Record<string, (typeof questionTypes)[keyof typeof questionTypes][]>
    )
  }, [])

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button variant={'outline'} type="button" className="w-max">
            <Plus /> Add question
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="flex h-dvh flex-col p-0 sm:max-w-none">
        <div className="container max-w-2xl overflow-y-auto pt-[10vh] pb-20">
          <DrawerHeader className="p-0">
            <DrawerTitle>Add Question</DrawerTitle>
            <DrawerDescription>Select a type of question to add</DrawerDescription>
          </DrawerHeader>
          <Tabs defaultValue="manual" className="mt-4 space-y-6">
            {showTabsOption ? (
              <TabsList className="divide-foreground/5 gap-0 divide-x divide-dashed">
                <TabsTrigger value="manual">
                  <PencilIcon className="size-4" /> Manual
                </TabsTrigger>
                {/* <TabsTrigger value="import">
                  <UploadIcon className="size-4" /> {t("import")}
                </TabsTrigger>
                <TabsTrigger value="template">
                  <FileTextIcon className="size-4" /> {t("template")}
                </TabsTrigger> */}
                <TabsTrigger value="ai">
                  <SparklesIcon className="size-4" /> Generate with AI
                </TabsTrigger>
              </TabsList>
            ) : null}

            <TabsContent value="manual">
              <div className="space-y-6">
                {Object.entries(groupedQuestionTypes).map(([group, types]) => (
                  <div key={group} className="">
                    <Label className="capitalize">{group}</Label>
                    <div className="mt-2 flex w-full flex-wrap gap-3">
                      {types.map(type => (
                        <Button
                          key={type.value}
                          variant={'outline'}
                          className="group justify-start"
                          disabled={type.isHidden || selectedType === type.value}
                          onClick={() =>
                            handleCreateQuestion(type.value as QuestionType)
                          }
                        >
                          {type.isHidden ? (
                            <LockIcon className="size-3.5" />
                          ) : type.value === selectedType ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <type.icon className="size-4" />
                          )}
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="import">{/* <ImportQuestions /> */}</TabsContent>

            <TabsContent value="template">{/* <UseTemplate /> */}</TabsContent>

            <TabsContent value="ai">
              {/* <GenerateQuestionInputPrompt
                order={order}
                referenceId={referenceId}
                testId={testId}
              /> */}
            </TabsContent>
          </Tabs>
        </div>
        <div className="bg-background fixed right-0 bottom-0 left-0 border-t border-dashed">
          <DrawerFooter className="container mt-0 max-w-2xl py-4 sm:justify-start">
            <DrawerClose asChild>
              <Button variant={'outline'} className="w-max">
                Back
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default DialogAddQuestion
