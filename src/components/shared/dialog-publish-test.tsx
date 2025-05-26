'use client'

import { api } from '@convex/_generated/api'
import type { DataModel } from '@convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { LockIcon, TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'

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

const DialogPublishTest = ({
  onPublished,
  test
}: {
  onPublished?: () => void
  test: DataModel['test']['document']
}) => {
  const testSection = useQuery(api.organizer.testSection.getByTestId, {
    testId: test._id
  })
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

  const testSectionWithNoQuestions = useMemo(() => {
    return testSection?.filter(section => !section.numOfQuestions)
  }, [testSection])

  const handlePublish = () => {
    updateTest({
      testId: test._id,
      data: {
        access: test.access,
        isPublished: true,
        type: test.type,
        title: test.title,
        description: test.description,
        showResultImmediately: test.showResultImmediately
      }
    })
    onPublished?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Publish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish test</DialogTitle>
          <DialogDescription>
            {testSectionWithNoQuestions?.length &&
            testSectionWithNoQuestions?.length > 0
              ? 'This test can be published after all sections have questions'
              : 'Are you sure you want to publish this test?'}
          </DialogDescription>
        </DialogHeader>
        {testSectionWithNoQuestions && testSectionWithNoQuestions?.length > 0 && (
          <div className="bg-secondary rounded-md p-3">
            <h1 className="flex flex-row items-center gap-2">
              <TriangleAlert className="size-4" /> There are some sections that have no
              questions:{' '}
            </h1>
            <ul className="mt-2 flex flex-col gap-2">
              {testSectionWithNoQuestions.map(section => (
                <li key={section._id} className="font-medium">
                  - {section.title || `Section ${section.order}`}
                </li>
              ))}
            </ul>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              testSectionWithNoQuestions && testSectionWithNoQuestions?.length > 0
            }
            onClick={handlePublish}
          >
            {testSectionWithNoQuestions && testSectionWithNoQuestions?.length > 0 ? (
              <LockIcon />
            ) : null}
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogPublishTest
