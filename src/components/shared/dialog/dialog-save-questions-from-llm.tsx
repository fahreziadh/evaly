import { VariantProps } from 'class-variance-authority'
import { SaveIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button, buttonVariants } from '@/components/ui/button'
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

import { trpc } from '@/trpc/trpc.client'

import { Question } from '@/types/question'

import { useProgressRouter } from '../progress-bar'

const DialogSaveQuestionsFromLLM = ({
  size,
  variant,
  questions,
  title
}: VariantProps<typeof buttonVariants> & {
  questions: Question[]
  title: string
}) => {
  const {
    mutateAsync: createQuestionTemplate,
    isPending: isPendingCreateQuestionTemplate
  } = trpc.organization.questionTemplate.create.useMutation({
    onError: error => {
      toast.error(error.message)
    }
  })

  const router = useProgressRouter()

  const { mutateAsync: createQuestions, isPending: isPendingCreateQuestions } =
    trpc.organization.question.create.useMutation({
      onError: error => {
        toast.error(error.message)
      },
      onSuccess: data => {
        if (!data.length) {
          toast.error('Failed to create questions')
          return
        }

        toast.success('Questions saved successfully')
      }
    })

  const handleSaveQuestions = async () => {
    const res = await createQuestionTemplate({
      title
    })
    if (!res) {
      return toast.error('Failed to create question template')
    }

    const { id } = res

    const createQuestionsRes = await createQuestions({
      questions: questions.map((question, index) => ({
        ...question,
        id: undefined,
        referenceId: id,
        order: index + 1
      })),
      referenceId: id
    })

    if (!createQuestionsRes) {
      return toast.error('Failed to create questions')
    }

    toast.success('Questions saved successfully')
    router.push(`/dashboard/question/${id}`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <SaveIcon /> Save Questions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Questions</DialogTitle>
          <DialogDescription>
            Save the questions from the LLM to your question bank, existing test series
            or create a new test from it.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => handleSaveQuestions()}
            disabled={isPendingCreateQuestionTemplate || isPendingCreateQuestions}
          >
            {isPendingCreateQuestionTemplate
              ? 'Creating template...'
              : isPendingCreateQuestions
                ? 'Saving questions...'
                : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogSaveQuestionsFromLLM
