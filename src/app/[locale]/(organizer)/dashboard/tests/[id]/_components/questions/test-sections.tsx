import { useParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDownIcon,
  Loader2,
  PlusIcon,
  PointerIcon
} from 'lucide-react'
import { Reorder } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import CardSection from '@/components/shared/card/card-section'
import DialogDeleteSection from '@/components/shared/dialog/dialog-delete-section'
import DialogEditSection from '@/components/shared/dialog/dialog-edit-section'
import { Badge } from '@/components/ui/badge'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { TooltipMessage } from '@/components/ui/tooltip'

import { trpc } from '@/trpc/trpc.client'

import { useSelectedSection } from '../../_hooks/use-selected-section'
import { QuestionTemplateSection } from './question-template-section'

const TestSections = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { id } = useParams()
  const [selectedSection, setSelectedSection] = useSelectedSection()

  const { data, isPending, isRefetching, refetch } =
    trpc.organization.testSection.getAll.useQuery({
      testId: id as string
    })

  const selectedSectionData = useMemo(() => {
    if (!selectedSection || !data) return null
    return data.find(e => e.id === selectedSection)
  }, [selectedSection, data])

  if (isPending) {
    return (
      <div className="flex flex-row items-center gap-2">
        <Skeleton className="h-8 w-40 rounded-md" />
      </div>
    )
  }

  if (data?.length === 1) {
    return (
      <div className="flex flex-row items-center gap-2">
        <AddSession>
          <Button variant={'outline'}>
            <PlusIcon /> New section
          </Button>
        </AddSession>
      </div>
    )
  }

  return (
    <div className="flex flex-row-reverse items-center gap-2 md:flex-row">
      <DialogDeleteSection
        disabled={isRefetching || isPending}
        isLastSection={data?.length === 1}
        sectionId={selectedSection as string}
        onSuccess={() => {
          refetch()
          if (selectedSectionData?.id === selectedSection) {
            const nearestSection = data?.find(
              section => section.id !== selectedSectionData?.id
            )
            if (nearestSection) {
              setSelectedSection(nearestSection.id)
            }
          }
        }}
      />
      <DialogEditSection sectionId={selectedSection as string} />
      <AddSession />

      <div className={cn('flex flex-row', className)}>
        <Button
          onClick={() => {
            const order = selectedSectionData?.order
            if (!order) return
            if (order === 1) return

            const previousSection = data?.find(e => e.order === order - 1)
            if (previousSection) {
              setSelectedSection(previousSection.id)
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
                  <span>
                    {selectedSectionData?.order || 1}.{' '}
                    {selectedSectionData?.title || 'Untitled'}
                  </span>
                  {selectedSectionData?.duration &&
                  selectedSectionData?.duration > 0 ? (
                    <Badge variant={'secondary'}>{selectedSectionData.duration}m</Badge>
                  ) : null}
                  <ChevronDownIcon className={cn(isOpen ? 'rotate-180' : '')} />
                </Button>
              </TooltipMessage>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <ListSession />
          </PopoverContent>
        </Popover>

        <Button
          onClick={() => {
            const order = selectedSectionData?.order
            if (!order) return
            if (order === data?.length) return

            const nextSection = data?.find(e => e.order === order + 1)
            if (nextSection) {
              setSelectedSection(nextSection.id)
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

const ListSession = () => {
  const { id } = useParams()
  const [selectedSection, setSelectedSection] = useSelectedSection()

  const { data, isPending, isRefetching, refetch } =
    trpc.organization.testSection.getAll.useQuery({
      testId: id as string
    })

  const { refetch: refetchSectionById } =
    trpc.organization.testSection.getById.useQuery({
      id: selectedSection as string
    })

  const [orderedData, setOrderedData] = useState<typeof data>([])

  useEffect(() => {
    if (data) {
      setOrderedData(data)
    }
  }, [data])

  useEffect(() => {
    if (data?.length && !selectedSection) {
      setSelectedSection(data[0].id)
    }
  }, [data, selectedSection, setSelectedSection])

  const { mutateAsync: updateOrder, isPending: isPendingUpdateOrder } =
    trpc.organization.testSection.updateOrder.useMutation()

  const onChangeOrder = async () => {
    const sectionIds = orderedData?.map(e => e.id) || []
    await updateOrder({ testId: id as string, order: sectionIds })
    await refetch()
    await refetchSectionById()
  }

  if (isPending) {
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
    <ScrollArea>
      <Reorder.Group
        className={cn(
          'flex max-h-[60vh] flex-col gap-2',
          isRefetching || isPendingUpdateOrder ? 'animate-pulse opacity-80' : ''
        )}
        axis="y"
        values={orderedData}
        onReorder={setOrderedData}
      >
        {orderedData?.map(e => (
          <Reorder.Item
            key={e.id}
            value={e}
            onDragEnd={onChangeOrder}
            dragListener={isPendingUpdateOrder ? false : true}
          >
            <CardSection
              data={e}
              key={e.id}
              isSelected={e.id === selectedSection}
              onClick={() => setSelectedSection(e.id)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <ScrollBar />
    </ScrollArea>
  )
}

const AddSession = ({ children }: { children?: React.ReactNode }) => {
  const { id } = useParams()
  const [, setSelectedSection] = useSelectedSection()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const tCommon = useTranslations('Common')
  const {
    refetch,
    isPending: isPendingSession,
    isRefetching: isRefetchingSection
  } = trpc.organization.testSection.getAll.useQuery({ testId: id as string })

  const { mutateAsync, isPending: isPendingCreateSection } =
    trpc.organization.testSection.create.useMutation()

  const { mutateAsync: tranferQuestion, isPending: isPendingTransferQuestion } =
    trpc.organization.question.transferBetweenReference.useMutation({
      onError(error) {
        toast.error(error.message || tCommon('genericUpdateError'))
      }
    })

  async function onUseTemplate() {
    if (!selectedId) return
    const createdSection = await mutateAsync({ testId: id as string })
    if (!createdSection?.sections?.length) {
      toast.error('Something went wrong!')
      return
    }
    const order = 1
    const toReferenceId = createdSection?.sections[0]?.id
    const fromReferenceId = selectedId

    const transferredQuestion = await tranferQuestion({
      order: Number(order),
      toReferenceId: toReferenceId as string,
      fromReferenceId
    })

    if (transferredQuestion && transferredQuestion.length > 0) {
      const sectionId = createdSection?.sections[0]?.id
      setIsOpen(false)
      if (sectionId) {
        setSelectedSection(sectionId)
        refetch()
      }
    }
  }

  return (
    <div className="flex flex-col items-end">
      <Dialog
        open={isOpen}
        onOpenChange={e => {
          if (!e) setSelectedId('')
          setIsOpen(e)
        }}
      >
        <DialogTrigger asChild>
          <div>
            <TooltipMessage message="Add new section">
              {children || (
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  disabled={
                    isPendingCreateSection || isRefetchingSection || isPendingSession
                  }
                >
                  {isPendingCreateSection || isRefetchingSection ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PlusIcon className="size-4" />
                  )}
                </Button>
              )}
            </TooltipMessage>
          </div>
        </DialogTrigger>
        <DialogContent className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
          <DialogHeader>
            <DialogTitle>Add new section</DialogTitle>
            <DialogDescription className="flex flex-wrap">
              Add an empty section or use a question template. Click to selecting the
              template <PointerIcon className="ml-2 size-4" />
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[40vh]">
            <QuestionTemplateSection
              onSelectedIdChange={setSelectedId}
              selectedId={selectedId}
            />
          </ScrollArea>
          <DialogFooter>
            <div className="flex w-full flex-row justify-between">
              <DialogClose asChild>
                <Button variant={'secondary'}>Back</Button>
              </DialogClose>

              <div className="flex gap-2">
                <Button
                  variant={'outline'}
                  className="w-max"
                  disabled={isPendingCreateSection || isRefetchingSection}
                  onClick={async () => {
                    const data = await mutateAsync({ testId: id as string })
                    const sectionId = data?.sections[0]?.id
                    setIsOpen(false)
                    if (sectionId) {
                      setSelectedSection(sectionId)
                      refetch()
                    }
                  }}
                >
                  {isPendingCreateSection || isRefetchingSection ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PlusIcon />
                  )}
                  Create Empty Section
                </Button>
                <Button
                  onClick={onUseTemplate}
                  variant={'default'}
                  disabled={
                    !selectedId || isPendingTransferQuestion || isPendingCreateSection
                  }
                >
                  {selectedId ? (
                    <>
                      Use template <ArrowRight />
                    </>
                  ) : (
                    'Choose template'
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TestSections
