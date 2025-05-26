import { api } from '@convex/_generated/api'
import type { DataModel, Id } from '@convex/_generated/dataModel'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { ArrowLeftIcon, CircleIcon, LinkIcon } from 'lucide-react'
import { Loader2, PencilLine, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import DialogDeleteTest from '@/components/shared/dialog-delete-test'
import DialogPublishTest from '@/components/shared/dialog-publish-test'
import { DialogReopenTest } from '@/components/shared/dialog-reopen-test'
import DialogUnpublishTest from '@/components/shared/dialog-unpublish-test'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TextShimmer } from '@/components/ui/text-shimmer'

import { testTypeFormatter } from '@/lib/test-type-formatter'
import { cn } from '@/lib/utils'

import TestSections from './headers.test-sections'

const Headers = () => {
  return (
    <div className="flex flex-col space-y-10">
      <FirstSection />
      <SecondSection />
    </div>
  )
}

const FirstSection = () => {
  const navigate = useNavigate()
  const { testId, resultsTab } = useSearch({
    from: '/(organizer)/app/tests/details'
  })
  const dataTest = useQuery(api.organizer.test.getTestById, {
    testId: testId as Id<'test'>
  })

  const copyLinkToShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${dataTest?._id}`)
    toast.success('Link copied to clipboard')
  }

  const status = useMemo(() => {
    if (dataTest?.isPublished && dataTest?.finishedAt) return 'finished'
    if (dataTest?.isPublished && !dataTest?.finishedAt) return 'active'
    return 'draft'
  }, [dataTest])

  return (
    <div className="bg-card flex flex-col-reverse items-center justify-between gap-2 md:flex-row">
      {/* Left */}
      <div className="flex flex-row items-center gap-3">
        <Button
          variant={'secondary'}
          size={'icon-sm'}
          onClick={() => {
            navigate({
              to: '/app'
            })
          }}
          rounded={false}
        >
          <ArrowLeftIcon />
        </Button>
        <DialogEditTest />
      </div>
      {/* Right */}
      {!dataTest ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <div className="flex flex-row items-center gap-3">
          <Badge size="lg" variant={'outline'}>
            {testTypeFormatter(dataTest?.type)}
          </Badge>
          {/* Status */}
          <Badge
            size={'lg'}
            className="gap-2 capitalize"
            variant={
              status === 'draft'
                ? 'secondary'
                : status === 'active'
                  ? 'ghost'
                  : 'success'
            }
          >
            {status === 'active' ? (
              <CircleIcon className="max-w-2.5 fill-emerald-500 stroke-emerald-500" />
            ) : null}
            {status}
          </Badge>

          {/* Copy link to share */}
          {status === 'active' ? (
            <Button variant={'ghost'} size={'icon'} onClick={copyLinkToShare}>
              <LinkIcon />
            </Button>
          ) : null}

          {/* Reopen test */}
          {status === 'finished' ? (
            <DialogReopenTest
              dataTest={dataTest}
              onReopened={newTestId => {
                navigate({
                  from: '/app/tests/details',
                  search: { testId: newTestId, tabs: 'questions', resultsTab }
                })
              }}
            />
          ) : null}

          {/* Publish button */}
          {status === 'draft' ? (
            <DialogPublishTest
              test={dataTest}
              onPublished={() => {
                navigate({
                  from: '/app/tests/details',
                  search: { testId: testId, tabs: 'results', resultsTab }
                })
              }}
            />
          ) : null}

          {/* Unpublish button */}
          {status === 'active' ? (
            <DialogUnpublishTest
              test={dataTest}
              onUnpublished={() => {
                navigate({
                  to: '/app/tests/details',
                  search: { testId, tabs: 'results', resultsTab }
                })
              }}
            />
          ) : null}

          {/* Delete button */}
          <DialogDeleteTest
            variant={'destructive'}
            size={'icon'}
            testId={testId as Id<'test'>}
            onDelete={() => {
              navigate({ to: '/app' })
            }}
          />
        </div>
      )}
    </div>
  )
}

const SecondSection = () => {
  const { testId, tabs } = useSearch({
    from: '/(organizer)/app/tests/details'
  })
  const dataTest = useQuery(api.organizer.test.getTestById, {
    testId: testId as Id<'test'>
  })

  const status = useMemo(() => {
    if (dataTest?.isPublished && dataTest?.finishedAt) return 'finished'
    if (dataTest?.isPublished && !dataTest?.finishedAt) return 'active'
    return 'draft'
  }, [dataTest])

  if (dataTest === undefined)
    return (
      <div>
        <TextShimmer className="h-9">Loading...</TextShimmer>
      </div>
    )

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <TabsList>
        <TabsTrigger value="results" className={status === 'draft' ? 'hidden' : ''}>
          Results
        </TabsTrigger>
        <TabsTrigger value="questions">Questions</TabsTrigger>
        <TabsTrigger value="share" className={status === 'draft' ? 'hidden' : ''}>
          Share
        </TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      {tabs === 'questions' ? <TestSections /> : null}
    </div>
  )
}

const DialogEditTest = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { testId } = useSearch({ from: '/(organizer)/app/tests/details' })
  const dataTest = useQuery(api.organizer.test.getTestById, {
    testId: testId as Id<'test'>
  })
  const { register, reset, getValues } = useForm<DataModel['test']['document']>()
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

  const handleSubmit = (data: DataModel['test']['document']) => {
    if (!dataTest?._id) return
    updateTest({
      testId: dataTest?._id,
      data: {
        title: data.title,
        access: data.access,
        showResultImmediately: data.showResultImmediately,
        isPublished: data.isPublished,
        type: data.type,
        description: data.description || ''
      }
    })
  }

  useEffect(() => {
    if (dataTest) {
      reset(dataTest)
    }
  }, [dataTest, reset])

  if (dataTest === undefined)
    return <TextShimmer className="animate-pulse">Loading...</TextShimmer>

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="group flex flex-row items-center gap-2 hover:opacity-80">
        <span
          className={cn(
            'w-max max-w-xl truncate',
            !dataTest?.title ? 'text-muted-foreground' : ''
          )}
        >
          {dataTest?.title || 'Name your test'}
        </span>
        {dataTest === undefined ? (
          <Loader2 className="text-muted-foreground/50 animate-spin" />
        ) : (
          <PencilLine className="text-muted-foreground/50 group-hover:text-muted-foreground size-4" />
        )}
      </PopoverTrigger>
      <PopoverAnchor>
        <PopoverContent side="bottom" align="start" sideOffset={10} alignOffset={-10}>
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit(getValues())
              setIsOpen(false)
            }}
          >
            <Input
              type="text"
              {...register('title')}
              className="font-medium outline-none"
              placeholder={dataTest === undefined ? 'Loading...' : 'Test title'}
              disabled={dataTest === undefined}
            />
            <Button
              variant={'secondary'}
              size={'sm'}
              className="mt-2 w-max"
              type="submit"
            >
              {dataTest === undefined ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save
            </Button>
          </form>
        </PopoverContent>
      </PopoverAnchor>
    </Popover>
  )
}

export default Headers
