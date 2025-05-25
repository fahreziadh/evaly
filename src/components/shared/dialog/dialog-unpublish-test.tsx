import { Loader2 } from 'lucide-react'
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

import { Test } from '@/types/test'

const DialogUnpublishTest = ({
  testId,
  isUnpublished
}: {
  testId: string
  isUnpublished?: (newTest: Test) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: unpublishTest, isPending: isUnpublishing } =
    trpc.organization.test.publish.useMutation({
      onError: error => {
        toast.error(error.message)
      },
      onSuccess: data => {
        if (data) {
          isUnpublished?.(data)
        }
        toast.success('Test unpublished successfully')
        setIsOpen(false)
      }
    })
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'} disabled={isUnpublishing}>
          {isUnpublishing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Unpublish Test'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unpublish Test</DialogTitle>
          <DialogDescription>
            Are you sure you want to unpublish this test? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={'destructive'}
            onClick={() => {
              unpublishTest({ id: testId, isPublished: false })
            }}
            disabled={isUnpublishing}
          >
            {isUnpublishing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Unpublish Test'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogUnpublishTest
