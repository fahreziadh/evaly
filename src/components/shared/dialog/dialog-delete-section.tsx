import { cn } from '@/lib/utils'
import { Trash2Icon } from 'lucide-react'
import { useTranslations } from 'next-intl'
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
import { TooltipMessage } from '@/components/ui/tooltip'

import { trpc } from '@/trpc/trpc.client'

const DialogDeleteSection = ({
  className,
  disabled = false,
  sectionId,
  onSuccess,
  isLastSection = false
}: {
  className?: string
  disabled?: boolean
  dialogTrigger?: React.ReactNode
  sectionId: string
  onSuccess: () => void
  isLastSection?: boolean
}) => {
  const t = useTranslations('TestDetail')
  const tCommon = useTranslations('Common')

  const [open, setOpen] = useState(false)
  const { mutate: deleteSection, isPending } =
    trpc.organization.testSection.delete.useMutation({
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
        <div>
          <TooltipMessage message="Delete section">
            <Button
              disabled={disabled}
              size={'icon'}
              variant={'ghost'}
              className={cn(className)}
              onClick={e => {
                e.stopPropagation()
                setOpen(true)
              }}
            >
              <Trash2Icon />
            </Button>
          </TooltipMessage>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deleteSectionTitle')}</DialogTitle>
          <DialogDescription>{t('deleteSectionDescription')}</DialogDescription>
        </DialogHeader>
        {isLastSection && (
          <span className="text-muted-foreground bg-secondary rounded-md p-2 text-sm">
            {t('deleteSectionLastSection')}
          </span>
        )}
        <DialogFooter>
          <Button variant={'secondary'} onClick={() => setOpen(false)}>
            {tCommon('backButton')}
          </Button>
          <Button
            variant={'destructive'}
            disabled={isPending || isLastSection}
            onClick={() => deleteSection({ id: sectionId })}
          >
            {isPending ? tCommon('deletingStatus') : tCommon('deleteButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDeleteSection
