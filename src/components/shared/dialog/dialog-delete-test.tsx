'use client'

import { cn } from '@/lib/utils'
import { Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

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

import { trpc } from '@/trpc/trpc.client'

const DialogDeleteTest = ({
  className,
  testId,
  onSuccess
}: {
  className?: string
  testId: string
  onSuccess?: () => void
}) => {
  const [open, setOpen] = useState(false)
  const t = useTranslations('TestDialogs')
  const tCommon = useTranslations('Common')
  const { mutate, isPending } = trpc.organization.test.delete.useMutation({
    onSuccess() {
      onSuccess?.()
      setOpen(false)
    },
    onError(error) {
      toast.error(tCommon(error.message))
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={'icon-xs'}
          variant={'ghost'}
          className={cn(className)}
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
          <DialogTitle>{t('deleteTestTitle')}</DialogTitle>
          <DialogDescription>{t('deleteTestDescription')}</DialogDescription>
        </DialogHeader>
        {/* <CardSession data={} /> */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'secondary'}>{tCommon('backButton')}</Button>
          </DialogClose>
          <Button
            variant={'destructive'}
            onClick={() => mutate({ id: testId })}
            disabled={isPending}
          >
            {isPending ? tCommon('deletingStatus') : tCommon('deleteButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDeleteTest
