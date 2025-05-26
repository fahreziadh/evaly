'use client'

import { api } from '@convex/_generated/api'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { ArrowRight, CheckCircle, Loader2, LockIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

const DialogCreateTest = () => {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()

  const createTest = useMutation(api.organizer.test.createTest)

  const onCreateNewTest = async () => {
    try {
      setIsPending(true)
      const test = await createTest({ type: 'self-paced' })
      if (!test) {
        toast.error('Failed to create test')
        return
      }
      setIsPending(false)
      navigate({
        to: '/app/tests/details',
        search: { testId: test, tabs: 'questions' }
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create test')
    }
  }

  const onBack = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'default'}>Create Test</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Test</DialogTitle>
          <DialogDescription>
            Choose the type of test you want to create
          </DialogDescription>
        </DialogHeader>
        <Card className="p-4 ring-2 ring-offset-2">
          <div className="flex flex-row items-start justify-between">
            <h1>Self-Paced Test</h1>
            <CheckCircle size={20} />
          </div>
          <Label className="text-sm">
            A self-paced test is a test that you can take at your own pace.
          </Label>
        </Card>
        <Card className="p-4 opacity-80">
          <div className="flex flex-row items-start justify-between">
            <h1>Live Test</h1>
            <Badge variant={'secondary'}>
              <LockIcon /> Coming Soon
            </Badge>
          </div>
          <Label className="text-sm">
            A live test is a test that is taken at a specific time.
          </Label>
        </Card>
        <DialogFooter>
          <Button variant={'secondary'} onClick={onBack}>
            Back
          </Button>
          <Button variant={'default'} onClick={onCreateNewTest} disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            Continue
            {!isPending ? <ArrowRight size={16} /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogCreateTest
