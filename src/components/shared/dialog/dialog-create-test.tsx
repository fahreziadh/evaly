'use client'

import { ArrowRight, CheckCircle, Loader2, LockIcon, PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
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

import { trpc } from '@/trpc/trpc.client'

import { useProgressRouter } from '../progress-bar'

const DialogCreateTest = () => {
  const [open, setOpen] = useState(false)
  const router = useProgressRouter()
  const [isPendingRoute, startTransition] = useTransition()
  const t = useTranslations('TestDialogs')
  const tCommon = useTranslations('Common')

  const { mutate, isPending: isPendingCreate } =
    trpc.organization.test.create.useMutation({
      onSuccess(data) {
        if (!data) {
          toast.error(tCommon('genericError'))
          return
        }

        startTransition(() => {
          router.push(`/dashboard/tests/${data?.id}?tabs=questions`)
        })
      }
    })

  const onCreateNewTest = () => {
    mutate({ type: 'self-paced' })
  }

  const onBack = () => setOpen(false)
  const isPending = isPendingRoute || isPendingCreate

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'default'}>
          <PlusIcon />
          {t('createTestButton')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createTestTitle')}</DialogTitle>
          <DialogDescription>{t('createTestDescription')}</DialogDescription>
        </DialogHeader>
        <Card className="cursor-pointer p-4 ring-2 ring-offset-2">
          <div className="flex flex-row items-start justify-between">
            <h1>{t('selfPacedTestLabel')}</h1>
            <CheckCircle size={20} />
          </div>
          <Label className="text-sm">{t('selfPacedTestDescription')}</Label>
        </Card>
        <Card className="p-4 opacity-80">
          <div className="flex flex-row items-start justify-between">
            <h1>{t('liveTestLabel')}</h1>
            <Badge variant={'secondary'}>
              <LockIcon /> {tCommon('comingSoon')}
            </Badge>
          </div>
          <Label className="text-sm">{t('liveTestDescription')}</Label>
        </Card>
        <DialogFooter>
          <Button variant={'secondary'} onClick={onBack}>
            {tCommon('backButton')}
          </Button>
          <Button variant={'default'} onClick={onCreateNewTest} disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
            {tCommon('continueButton')}
            {!isPending ? <ArrowRight size={16} /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogCreateTest
