import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useNavigate } from '@tanstack/react-router'
import { useSearch } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { ArrowLeft, ArrowRight, ChevronDownIcon, Loader2, PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import CardSection from '@/components/shared/card-section'
import DialogDeleteSection from '@/components/shared/dialog-delete-section'
import DialogEditSection from '@/components/shared/dialog-edit-section'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { TooltipMessage } from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'

const TestSections = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedSection, tabs, testId, resultsTab } = useSearch({
    from: '/(organizer)/app/tests/details'
  })
  const navigate = useNavigate({ from: '/app/tests/details' })

  const data = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<'test'>
  })

  const selectedSectionData = useMemo(() => {
    if (!selectedSection || !data) return null
    return data.find(e => e._id === selectedSection)
  }, [selectedSection, data])

  if (data === undefined) {
    return (
      <div className="flex flex-row items-center gap-2">
        <Skeleton className="h-8 w-40 rounded-md" />
      </div>
    )
  }

  if (data?.length === 1) {
    return <AddSession testId={testId as Id<'test'>} />
  }

  return (
    <div className="flex flex-row-reverse items-center gap-2 md:flex-row">
      <DialogDeleteSection
        onDelete={() => {
          navigate({
            search: {
              tabs,
              testId,
              selectedSection: undefined,
              resultsTab
            },
            replace: true
          })
        }}
        testId={testId as Id<'test'>}
        isLastSection={data?.length === 1}
        sectionId={selectedSection as string}
      />
      {selectedSectionData && <DialogEditSection testSection={selectedSectionData} />}
      <AddSession testId={testId as Id<'test'>} />

      <div className={cn('flex flex-row', className)}>
        <Button
          onClick={() => {
            const order = selectedSectionData?.order
            if (!order) return
            if (order === 1) return

            const previousSection = data?.find(e => e.order === order - 1)
            if (previousSection) {
              navigate({
                search: {
                  tabs,
                  testId,
                  selectedSection: previousSection._id,
                  resultsTab
                },
                replace: true
              })
            }
          }}
          disabled={selectedSectionData?.order === 1}
          variant={'outline'}
          size={'icon'}
          className="rounded-r-none border-r-0"
        >
          <ArrowLeft />
        </Button>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div>
              <TooltipMessage message="Click to check all sections">
                <Button
                  variant={'outline'}
                  className="group rounded-l-none rounded-r-none"
                >
                  {selectedSectionData?.title ? (
                    <>
                      {selectedSectionData.order}. {selectedSectionData.title}
                    </>
                  ) : (
                    `Section ${selectedSectionData?.order}`
                  )}

                  {selectedSectionData?.duration &&
                  selectedSectionData?.duration > 0 ? (
                    <Badge variant={'secondary'}>{selectedSectionData.duration}m</Badge>
                  ) : null}
                  <ChevronDownIcon className={cn(isOpen ? 'rotate-180' : '')} />
                </Button>
              </TooltipMessage>
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-background p-2">
            <ListSession testId={testId as Id<'test'>} />
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => {
            const order = selectedSectionData?.order
            if (!order) return
            if (order === data?.length) return

            const nextSection = data?.find(e => e.order === order + 1)
            if (nextSection) {
              navigate({
                search: {
                  tabs,
                  testId,
                  selectedSection: nextSection._id,
                  resultsTab
                },
                replace: true
              })
            }
          }}
          disabled={selectedSectionData?.order === data?.length}
          variant={'outline'}
          size={'icon'}
          className="rounded-l-none border-l-0"
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

const ListSession = ({ testId }: { testId: Id<'test'> }) => {
  const { selectedSection, tabs, resultsTab } = useSearch({
    from: '/(organizer)/app/tests/details'
  })
  const navigate = useNavigate({ from: '/app/tests/details' })

  const data = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<'test'>
  })

  const [orderedData, setOrderedData] = useState<typeof data>([])

  useEffect(() => {
    if (data) {
      setOrderedData(data)
    }
  }, [data])

  if (data === undefined) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (!data || !data.length || !orderedData) {
    return <div>No session found</div>
  }

  return (
    <div className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto">
      {orderedData?.map(e => (
        <CardSection
          data={e}
          key={e._id}
          isSelected={e._id === selectedSection}
          onClick={() => {
            navigate({
              search: {
                tabs,
                testId,
                selectedSection: e._id,
                resultsTab
              },
              replace: true
            })
          }}
        />
      ))}
    </div>
  )
}

const AddSession = ({ testId }: { testId: Id<'test'> }) => {
  const { tabs, resultsTab } = useSearch({ from: '/(organizer)/app/tests/details' })
  const navigate = useNavigate({ from: '/app/tests/details' })
  const testSections = useQuery(api.organizer.testSection.getByTestId, {
    testId: testId as Id<'test'>
  })

  const [isPending, setIsPending] = useState(false)

  const createTestSection = useMutation(api.organizer.testSection.create)

  const handleCreateSection = async () => {
    setIsPending(true)
    const section = await createTestSection({ testId })
    navigate({
      search: {
        tabs,
        testId,
        selectedSection: section,
        resultsTab
      },
      replace: true
    })
    setIsPending(false)
  }

  return (
    <TooltipMessage message="Add another section">
      <Button
        variant={testSections?.length && testSections.length > 1 ? 'ghost' : 'outline'}
        size={testSections?.length && testSections.length > 1 ? 'icon' : 'default'}
        disabled={isPending}
        onClick={handleCreateSection}
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <PlusIcon className="size-4" />
            {testSections?.length && testSections.length > 1
              ? null
              : 'Add Multi-section'}
          </>
        )}
      </Button>
    </TooltipMessage>
  )
}

export default TestSections
