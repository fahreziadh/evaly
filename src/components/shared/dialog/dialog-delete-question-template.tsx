import { cn } from '@/lib/utils'
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

import { trpc } from '@/trpc/trpc.client'

const DialogDeleteQuestionTemplate = ({
  className,
  templateId,
  onSuccess
}: {
  className?: string
  disabled?: boolean
  templateId: string
  onSuccess: () => void
}) => {
  const [open, setOpen] = useState(false)

  const { mutate: deleteQuestion, isPending } =
    trpc.organization.questionTemplate.delete.useMutation({
      onSuccess: () => {
        onSuccess()
        setOpen(false)
      },
      onError: error => {
        toast.error(error.message)
      }
    })
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'} size={'icon-sm'} className={cn('', className)}>
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure want to delete this question template?</DialogTitle>
          <DialogDescription>
            All information related to this question template will be removed
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
            disabled={isPending}
            onClick={e => {
              e.stopPropagation()
              deleteQuestion({ id: templateId })
            }}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDeleteQuestionTemplate
