import { testTypeColor, testTypeFormatter } from '@/lib/test-type-formatter'
import dayjs from 'dayjs'
import { CheckIcon, CircleIcon, CircleUserIcon, Clock, PencilLine } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { Test } from '@/types/test'

import DialogDeleteTest from '../dialog/dialog-delete-test'
import { Link } from '../progress-bar'

const CardTest = ({ data, onDelete }: { data: Test; onDelete?: () => void }) => {
  const t = useTranslations('DashboardTest')
  const redirectLink = data.isPublished
    ? `/dashboard/tests/${data.id}?tabs=submissions`
    : `/dashboard/tests/${data.id}?tabs=questions`
  return (
    <Link href={redirectLink}>
      <div
        key={data.id}
        className="bg-card w-full rounded-lg border shadow-black/5 transition-all duration-100 hover:shadow-md active:opacity-80"
      >
        <div className="flex items-start justify-between p-3">
          <div>
            <h3 className="font-medium">{data.title || t('untitledTestLabel')}</h3>
          </div>

          <div>
            {data.isPublished && !data.finishedAt ? (
              <Badge variant={'ghost'} className="text-muted-foreground">
                <CircleIcon className="fill-success-foreground stroke-success-foreground size-3" />
                {t('activeStatus')}
              </Badge>
            ) : null}

            {!data.isPublished && !data.finishedAt ? (
              <Badge variant={'secondary'}>{t('draftStatus')}</Badge>
            ) : null}

            {data.isPublished && data.finishedAt ? (
              <Badge variant={'success'}>
                <CheckIcon />
                {t('finishedStatus')}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-6 px-4 pb-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={'secondary'} className={testTypeColor(data.type)}>
              {testTypeFormatter(data.type, t)}
            </Badge>
            {Number(data.duration || '0') > 0 ? (
              <Badge variant={'secondary'}>
                <Clock size={14} />
                <span>{`${data.duration}m`}</span>
              </Badge>
            ) : null}
          </div>
          <div className="flex items-center gap-1">
            <CircleUserIcon size={14} />
            <span>
              {data.access === 'public'
                ? t('publicAccess')
                : `${data.invitations} ${t('participantsLabel')}`}
            </span>
          </div>
          {data.heldAt && (
            <div className="flex items-center gap-1">
              Held on {dayjs(data.heldAt).format('DD MMM YYYY')}
            </div>
          )}

          <div className="ml-auto flex gap-1">
            <Button variant={'ghost'} size={'icon-xs'}>
              <PencilLine />
            </Button>
            <Separator orientation="vertical" />
            <DialogDeleteTest
              testId={data.id}
              onSuccess={() => {
                toast.success(t('testDeletedMessage'))
                onDelete?.()
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CardTest
