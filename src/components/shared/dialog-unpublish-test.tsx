'use client'

import { api } from '@convex/_generated/api'
import type { DataModel } from '@convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { CircleStop } from 'lucide-react'
import { useState } from 'react'

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

const DialogUnpublishTest = ({
  onUnpublished,
  test
}: {
  onUnpublished?: () => void
  test: DataModel['test']['document']
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const updateTest = useMutation(api.organizer.test.updateTest).withOptimisticUpdate(
    (localStore, args) => {
      const currentValue = localStore.getQuery(api.organizer.test.getTestById, {
        testId: args.testId
      })
      if (!currentValue) return
      localStore.setQuery(
        api.organizer.test.getTestById,
        { testId: args.testId },
        {
          ...currentValue,
          ...args.data
        }
      )
    }
  )

  const handleUnpublish = () => {
    updateTest({
      testId: test._id,
      data: {
        access: test.access,
        isPublished: true,
        finishedAt: Date.now(),
        type: test.type,
        title: test.title,
        description: test.description,
        showResultImmediately: test.showResultImmediately
      }
    })
    onUnpublished?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'}>
          <CircleStop /> Stop test
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stop test</DialogTitle>
          <DialogDescription>
            Are you sure you want to stop this test?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUnpublish}>Yes, Stop test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogUnpublishTest
