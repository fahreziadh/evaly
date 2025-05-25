'use client'

import { cn } from '@/lib/utils'
import {
  CheckIcon,
  CircleAlert,
  Loader2,
  LockIcon,
  TriangleAlert,
  XIcon
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerNavbar,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'

import { trpc } from '@/trpc/trpc.client'

import { Test } from '@/types/test'

const DialogPublishTest = ({
  testId,
  onPublished
}: {
  testId: string
  onPublished?: (newTest: Test) => void
}) => {
  const tCommon = useTranslations('Common')
  const t = useTranslations('TestDetail')

  const [isOpen, setIsOpen] = useState(false)
  const { data, isPending } = trpc.organization.test.isPublishable.useQuery(
    {
      id: testId
    },
    {
      enabled: isOpen
    }
  )
  const { mutate: publishTest, isPending: isPublishing } =
    trpc.organization.test.publish.useMutation({
      onError(error) {
        toast.error(error.message || tCommon('genericUpdateError'))
      },
      onSuccess(data) {
        setIsOpen(false)
        onPublished?.(data)
        toast.success(tCommon('testPublishedSuccessfully'))
      }
    })

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button disabled={isPublishing}>{tCommon('publishButton')}</Button>
      </DrawerTrigger>
      <DrawerContent className="h-dvh">
        <DrawerNavbar
          onBack={() => {
            setIsOpen(false)
          }}
          title={t('publishTestTitle')}
        />
        <div className="overflow-y-auto">
          {isPending ? (
            <Loader2 className="mx-auto mt-10 size-10 animate-spin" />
          ) : (
            <div className="container max-w-3xl flex-1 py-10">
              <div className="flex flex-row items-center justify-between">
                <h1 className="text-xl font-medium">{t('publishTestReviewTitle')}</h1>
                <Button
                  className="mt-4 w-max"
                  disabled={!data?.isPublishable || !data.isPublishable || isPublishing}
                  onClick={() => {
                    publishTest({
                      id: testId,
                      isPublished: true
                    })
                  }}
                >
                  {!data?.isPublishable ? <LockIcon /> : null}
                  {isPublishing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    tCommon('publishButton')
                  )}
                </Button>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                {data?.checklist.map(e => (
                  <div key={e.id} className={cn('flex flex-row items-start gap-3')}>
                    {e.status === 'ok' ? (
                      <CheckIcon className="text-success-foreground size-4" />
                    ) : e.status === 'error' ? (
                      <XIcon className="text-destructive size-4" />
                    ) : (
                      <TriangleAlert className="stroke-warning-foreground size-4" />
                    )}
                    <div className="-mt-1 flex-1 leading-0">
                      <span className="text-muted-foreground text-sm">{e.title}</span>
                      <p className="text-sm">{e.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm">
                {data?.isPublishable ? (
                  <p className="text-success-foreground bg-success px-4 py-2">
                    {t('publishTestReadyToPublish')}
                  </p>
                ) : (
                  <span className="bg-destructive/10 text-destructive border-destructive/10 flex items-center gap-2 border px-4 py-2">
                    <CircleAlert size={16} />
                    {t('publishTestNotReadyToPublish')}
                  </span>
                )}
              </div>
              <h1 className="mt-12 mb-4 text-xl font-medium">
                {t('publishTestSummaryTitle')}
              </h1>
              <div className="grid grid-cols-4 divide-x divide-y border text-sm">
                <div className="col-span-2 p-4">
                  <Label>{t('publishTestSummaryTitle')}</Label>
                  <p>{data?.summary?.title || 'No title'}</p>
                </div>
                <div className="p-4">
                  <Label>{t('publishTestSummaryType')}</Label>
                  <p>
                    {data?.summary?.type === 'self-paced'
                      ? t('publishTestSummaryTypeSelfPaced')
                      : t('publishTestSummaryTypeLiveTest')}
                  </p>
                </div>
                <div className="p-4">
                  <Label>Access</Label>
                  <p>
                    {data?.summary?.access === 'public'
                      ? t('publishTestSummaryAccessPublic')
                      : t('publishTestSummaryAccessInviteOnly')}
                  </p>
                </div>
                <div className="p-4">
                  <Label>{t('publishTestSummaryTotalSections')}</Label>
                  <p>
                    {data?.summary?.totalSections ||
                      t('publishTestSummaryTotalSectionsDefault')}
                  </p>
                </div>
                <div className="p-4">
                  <Label>{t('publishTestSummaryTotalQuestions')}</Label>
                  <p>
                    {data?.summary?.totalQuestions ||
                      t('publishTestSummaryTotalQuestionsDefault')}
                  </p>
                </div>
                <div className="p-4">
                  <Label>{t('publishTestSummaryTotalDuration')}</Label>
                  <p>
                    {data?.summary?.totalDuration ||
                      t('publishTestSummaryTotalDurationDefault')}
                  </p>
                </div>
                <div className="p-4">
                  <Label>{t('publishTestSummaryTotalParticipants')}</Label>
                  <p>
                    {data?.summary?.totalParticipants ||
                      t('publishTestSummaryTotalParticipantsDefault')}
                  </p>
                </div>
                <div className="col-span-4 max-h-[300px] overflow-y-auto p-4">
                  <Label>{t('publishTestSummaryDescription')}</Label>
                  <div
                    className="custom-prose"
                    dangerouslySetInnerHTML={{
                      __html:
                        data?.summary?.description ||
                        t('publishTestSummaryDescriptionDefault')
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default DialogPublishTest
