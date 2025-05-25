'use client'

import { useParams } from 'next/navigation'

import { env } from '@/lib/env.client'
import supabase from '@/lib/supabase'
import { cn } from '@/lib/utils'
import NumberFlow from '@number-flow/react'
import { PopoverClose } from '@radix-ui/react-popover'
import {
  Check,
  LinkIcon,
  Loader2,
  PencilLine,
  RotateCcw,
  Save,
  TimerOff
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import BackButton from '@/components/shared/back-button'
import DialogPublishTest from '@/components/shared/dialog/dialog-publish-test'
import { useProgressRouter } from '@/components/shared/progress-bar'
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
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TextShimmer } from '@/components/ui/text-shimmer'

import { trpc } from '@/trpc/trpc.client'

import { UpdateTest } from '@/types/test'

import { useTabsState } from '../_hooks/use-tabs-state'
import TestSections from './questions/test-sections'

const Header = ({ className }: { className?: string }) => {
  const [tabs, setTabs] = useTabsState('questions')
  const { id } = useParams()
  const router = useProgressRouter()
  const [isRedirect, setIsRedirect] = useTransition()
  const tCommon = useTranslations('Common')
  const tOrganizer = useTranslations('Organizer')
  const [participantOnline, setParticipantOnline] = useState<string[]>([])

  const {
    register,
    reset,
    formState: { isDirty },
    getValues,
    watch
  } = useForm<UpdateTest>()

  const { isPublished, finishedAt } = watch()

  const status = useMemo(() => {
    if (isPublished && finishedAt) return 'finished'
    if (isPublished && !finishedAt) return 'published'
    return 'draft'
  }, [isPublished, finishedAt])

  const {
    data: dataTest,
    isPending: isPendingTest,
    isRefetching: isRefetchingTest,
    refetch: refetchTest
  } = trpc.organization.test.getById.useQuery({ id: id?.toString() || '' })

  useEffect(() => {
    if (dataTest) {
      reset(dataTest)
      document.title = dataTest.title || 'Untitled'
    }
  }, [dataTest, reset])

  useEffect(() => {
    if (!id) return
    if (status !== 'published') return
    const channel = supabase.channel(id?.toString() || '')

    channel
      .on('presence', { event: 'sync' }, () => {
        const users = Object.keys(channel.presenceState())
        setParticipantOnline([...new Set(users)])
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Join', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Leave', key, leftPresences)
      })
    channel.subscribe(() => {})

    return () => {
      channel.unsubscribe()
    }
  }, [id, status])

  const { mutate: mutateUpdateTest, isPending: isUpdatingTest } =
    trpc.organization.test.update.useMutation({
      onSuccess() {
        toast.success('Test updated successfully')
        refetchTest()
      }
    })

  const { mutate: mutateReopenTest, isPending: isReopeningTest } =
    trpc.organization.test.duplicateTest.useMutation({
      onSuccess(data) {
        setIsRedirect(() => {
          router.push(`/dashboard/tests/${data.id}`)
          router.push(`/dashboard/tests/${data.id}`)
        })
      },
      onError(error) {
        toast.error(error.message || tCommon('genericUpdateError'))
      }
    })

  const reopenTest = () => {
    mutateReopenTest({ id: id?.toString() || '' })
  }

  const copyLinkToShare = () => {
    navigator.clipboard.writeText(`${env.NEXT_PUBLIC_URL}/s/${dataTest?.id}`)
    toast.success('Link copied to clipboard', { position: 'top-right' })
  }

  if (!isPendingTest && !dataTest) {
    return null
  }

  return (
    <div className={cn(className)}>
      <div className="flex flex-col-reverse items-start justify-between gap-2 md:flex-row">
        <div className="flex flex-row items-center gap-2">
          <BackButton href={`/dashboard/tests`} />

          {/* Title and save button */}
          {isPendingTest ? (
            <TextShimmer className="animate-pulse font-medium">Loading...</TextShimmer>
          ) : (
            <Popover>
              <PopoverTrigger className="group flex cursor-pointer flex-row items-center gap-2">
                <span className="w-max max-w-xl truncate text-start font-medium">
                  {watch('title') || 'Untitled'}
                </span>
                {isPendingTest || isUpdatingTest ? (
                  <Loader2 className="text-muted-foreground/50 animate-spin" />
                ) : (
                  <PencilLine className="text-muted-foreground/50 group-hover:text-muted-foreground size-4" />
                )}
              </PopoverTrigger>
              <PopoverAnchor>
                <PopoverContent
                  side="bottom"
                  align="start"
                  sideOffset={10}
                  alignOffset={-10}
                >
                  <Input
                    type="text"
                    {...register('title')}
                    className="font-medium outline-none"
                    placeholder={isPendingTest ? 'Loading...' : 'Test title'}
                    disabled={isPendingTest || isUpdatingTest}
                  />
                  <PopoverClose asChild>
                    <Button
                      variant={'default'}
                      disabled={isUpdatingTest || isPendingTest || !isDirty}
                      className="mt-2 w-max"
                      onClick={() =>
                        mutateUpdateTest({
                          id: id?.toString() || '',
                          title: getValues('title')
                        })
                      }
                    >
                      {isUpdatingTest ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Save className="size-3.5" />
                      )}
                      {tCommon('saveButton')}
                    </Button>
                  </PopoverClose>
                </PopoverContent>
              </PopoverAnchor>
            </Popover>
          )}
        </div>

        {/* Right side: Status and actions */}
        <div className="flex w-full flex-row justify-end">
          {/* Mobile Only Status */}
          {status === 'published' ? (
            <Button variant={'ghost'} className="ml-4 flex md:hidden">
              <div
                className={cn(
                  'size-2.5 rounded-full bg-emerald-500 transition-all',
                  participantOnline.length === 0 ? 'bg-foreground/15' : ''
                )}
              />
              <NumberFlow value={participantOnline.length} suffix=" Online" />
            </Button>
          ) : null}
          {/* Loading state */}
          {isPendingTest || isRefetchingTest ? (
            <Button variant={'default'} disabled>
              <Loader2 className="animate-spin" />
              Loading...
            </Button>
          ) : // Published state
          status === 'published' ? (
            <div className="flex flex-row items-center gap-2">
              <Button variant={'ghost'} size={'icon'} onClick={copyLinkToShare}>
                <LinkIcon />
              </Button>
              <EndTestButton refetchTest={refetchTest} id={id?.toString() || ''} />
            </div>
          ) : // Finished state
          status === 'finished' ? (
            <div className="flex flex-row items-center gap-2">
              <Button variant={'success'}>
                <Check />
                Finished
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={'outline'}>
                    <RotateCcw />
                    Re-open test
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>You are about to re-open the test.</DialogTitle>
                    <DialogDescription>
                      This action will re-create a completely new test with the same
                      questions and settings, just like duplicating the test.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    <Button
                      variant={'default'}
                      onClick={reopenTest}
                      disabled={isReopeningTest || isRedirect}
                    >
                      {isReopeningTest || isRedirect ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <RotateCcw />
                      )}
                      Re-open test
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : // Draft state
          status === 'draft' ? (
            <DialogPublishTest
              testId={id?.toString() || ''}
              onPublished={newTest => {
                reset(newTest)
                setTabs('submissions')
              }}
            />
          ) : null}
        </div>
      </div>

      {/* Tabs and Test Sections */}
      <div className="mt-4 mb-4 flex flex-col items-start justify-between gap-2 md:flex-row">
        {isPendingTest ? (
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-9 w-56 rounded-md" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center">
            <TabsList>
              {/* <TabsTrigger value="summary">Summary</TabsTrigger> */}
              {status === 'published' || status === 'finished' ? (
                <TabsTrigger value="submissions">
                  {tOrganizer('submissionsTab')}
                </TabsTrigger>
              ) : null}
              {status === 'published' ? (
                <TabsTrigger value="share">{tOrganizer('shareTab')}</TabsTrigger>
              ) : null}
              <TabsTrigger value="questions">{tOrganizer('questionsTab')}</TabsTrigger>
              <TabsTrigger value="settings">{tOrganizer('settingsTab')}</TabsTrigger>
            </TabsList>

            {/* Desktop Only Status */}
            {status === 'published' ? (
              <Button variant={'ghost'} className="ml-4 hidden md:flex">
                <div
                  className={cn(
                    'size-2.5 rounded-full bg-emerald-500 transition-all',
                    participantOnline.length === 0 ? 'bg-foreground/15' : ''
                  )}
                />
                <NumberFlow value={participantOnline.length} suffix=" Online" />
              </Button>
            ) : null}
          </div>
        )}
        {tabs === 'questions' && <TestSections />}
      </div>
    </div>
  )
}

const EndTestButton = ({
  refetchTest,
  id
}: {
  refetchTest: () => void
  id: string
}) => {
  const { mutate: mutateUpdateTest, isPending: isUpdatingTest } =
    trpc.organization.test.update.useMutation({
      onSuccess() {
        toast.success('Test finished successfully')
        refetchTest()
      }
    })

  const finishTest = () => {
    mutateUpdateTest({
      id,
      finishedAt: new Date().toISOString()
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'default'} disabled={isUpdatingTest}>
          {isUpdatingTest ? (
            <Loader2 className="animate-spin" />
          ) : (
            <TimerOff className="mr-1" />
          )}
          End Test
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to end the test?</DialogTitle>
          <DialogDescription>
            The test will be closed and no more submissions will be allowed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full flex-row justify-between gap-2">
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <div className="flex flex-row gap-2">
              <Button
                variant={'default'}
                onClick={finishTest}
                disabled={isUpdatingTest}
              >
                {isUpdatingTest ? <Loader2 className="animate-spin" /> : <>End now</>}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Header
