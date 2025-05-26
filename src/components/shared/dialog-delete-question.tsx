import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { cn } from '@/lib/utils'

const DialogDeleteQuestion = ({
  className,
  disabled = false,
  questionId,
  onSuccess
}: {
  className?: string
  disabled?: boolean
  questionId: string
  onSuccess: () => void
}) => {
  const [open, setOpen] = useState(false)
  const deleteQuestion = useMutation(api.organizer.question.deleteById)

  const onDeleteQuestion = async () => {
    toast.promise(deleteQuestion({ id: questionId as Id<'question'> }), {
      loading: 'Deleting question...',
      success: 'Question deleted successfully',
      error: 'Failed to delete question'
    })
    onSuccess()
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          size={'icon-xs'}
          variant={'secondary'}
          className={cn('text-muted-foreground', className)}
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
            setOpen(true)
          }}
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this question?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={'secondary'}
            onClick={e => {
              e.stopPropagation()
              setOpen(false)
            }}
          >
            Back
          </Button>
          <Button
            variant={'destructive'}
            onClick={e => {
              e.stopPropagation()
              onDeleteQuestion()
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDeleteQuestion
