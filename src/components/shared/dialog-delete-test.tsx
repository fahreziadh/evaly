'use client'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import type { VariantProps } from 'class-variance-authority'
import { useMutation } from 'convex/react'
import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
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

import { cn } from '@/lib/utils'

const DialogDeleteTest = ({
  className,
  testId,
  onDelete,
  size = 'icon-xs',
  variant = 'ghost'
}: {
  className?: string
  testId: Id<'test'>
  onDelete?: () => void
  size?: VariantProps<typeof buttonVariants>['size']
  variant?: VariantProps<typeof buttonVariants>['variant']
}) => {
  const [open, setOpen] = useState(false)
  const deleteTest = useMutation(api.organizer.test.deleteTest)

  const onDeleteTest = async () => {
    try {
      deleteTest({ testId })
      toast.success('Test deleted successfully')
      onDelete?.()
      setOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete test')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn(className)}
          rounded={false}
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
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Test</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this test?
          </DialogDescription>
        </DialogHeader>
        {/* <CardSession data={} /> */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'secondary'}>Back</Button>
          </DialogClose>
          <Button variant={'destructive'} onClick={onDeleteTest}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDeleteTest
