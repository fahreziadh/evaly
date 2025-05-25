'use client'

import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import {
  BookOpen,
  Calendar,
  FileText,
  Loader2,
  MinusIcon,
  Plus,
  Search,
  Smile,
  WandSparkles
} from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { useMemo, useTransition } from 'react'
import { toast } from 'sonner'

import LoadingScreen from '@/components/shared/loading/loading-screen'
import { Link, useProgressRouter } from '@/components/shared/progress-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { trpc } from '@/trpc/trpc.client'

const Page = () => {
  return (
    <div className="dashboard-margin container">
      <div className="flex flex-row justify-between">
        <div className="mb-8 flex flex-col">
          <h1 className="dashboard-title">Question Bank</h1>
          <p className="dashboard-description">
            Create and manage your question templates.
          </p>
        </div>
        <div className="flex flex-col items-end justify-start gap-2 md:flex-row md:items-start">
          <CreateQuestionTemplateButton />
          <Link href="/dashboard/question/generate">
            <Button>
              <WandSparkles /> Generate
            </Button>
          </Link>
        </div>
      </div>
      <QuestionTemplateSection />
    </div>
  )
}

const CreateQuestionTemplateButton = () => {
  const router = useProgressRouter()
  const [transitionReady, startTransition] = useTransition()

  const { mutate: createQuestionTemplate, isPending: isLoading } =
    trpc.organization.questionTemplate.create.useMutation({
      onError(error) {
        toast.error(error.message || 'Failed to create question template')
      },
      onSuccess(data) {
        toast.success('Question template created successfully')
        startTransition(() => {
          router.push(`/dashboard/question/${data.id}`)
        })
      }
    })

  return (
    <Button
      variant={'outline'}
      onClick={() => createQuestionTemplate({ title: '' })}
      disabled={transitionReady || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Creating...</span>
        </>
      ) : transitionReady ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Redirecting...</span>
        </>
      ) : (
        <>
          <Plus /> Question template
        </>
      )}
    </Button>
  )
}

const QuestionTemplateSection = ({
  className,
  gridClassName
}: {
  className?: string
  gridClassName?: string
}) => {
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  )
  const [tab, setTab] = useQueryState('tab', parseAsString.withDefault('all'))

  const { data: dataQuestionTemplate, isPending: isPendingQuestionTemplate } =
    trpc.organization.questionTemplate.getAll.useQuery()

  const filteredDataQuestionTemplate = useMemo(() => {
    if (!dataQuestionTemplate) return []
    let list = dataQuestionTemplate
    if (tab === 'all') list = dataQuestionTemplate
    if (tab === 'owned')
      list = dataQuestionTemplate.filter(e => {
        return !e.isAiGenerated
      })

    if (tab === 'generated')
      list = dataQuestionTemplate.filter(e => {
        return e.isAiGenerated
      })

    if (!searchQuery) return list

    return list.filter(template => {
      if (!template.title) return false
      return (
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })
  }, [dataQuestionTemplate, searchQuery, tab])

  if (isPendingQuestionTemplate) return <LoadingScreen />

  return (
    <div className={cn('space-y-6', className)}>
      <Tabs className="w-full" value={tab} onValueChange={setTab}>
        <div className="mb-4 flex flex-col-reverse justify-between gap-4 md:flex-row">
          <TabsList>
            <TabsTrigger value="all">
              <FileText className="size-3.5" />
              All
            </TabsTrigger>
            <TabsTrigger value="owned">
              <Smile className="size-3.5" />
              My Templates
            </TabsTrigger>
            <TabsTrigger value="generated">
              <WandSparkles className="size-3.5" />
              AI Generated
            </TabsTrigger>
          </TabsList>
          <div className="relative w-full md:w-80">
            <Search className="text-muted-foreground absolute top-2 left-2.5 h-3.5 w-3.5" />
            <Input
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery ?? ''}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Owned Templates Tab */}
        {filteredDataQuestionTemplate && filteredDataQuestionTemplate?.length > 0 ? (
          <div
            className={cn(
              'grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3',
              gridClassName
            )}
          >
            {filteredDataQuestionTemplate?.map(template => (
              <CardQuestionTemplate key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <EmptyState message="No templates match your search" />
        )}
      </Tabs>
    </div>
  )
}

const CardQuestionTemplate = ({
  template
}: {
  template: {
    id: string
    createdAt: string
    updatedAt: string
    organizationId: string
    deletedAt: string | null
    title: string | null
    organizerId: string
    tags: string[]
    isAiGenerated: boolean
    questions: {
      id: string
      question: string | null
    }[]
  }
}) => {
  return (
    <Link href={`/dashboard/question/${template.id}`}>
      <Card
        className={cn(
          'group border-border h-full overflow-hidden hover:shadow-2xl hover:shadow-black/5',
          'bg-card hover:bg-muted/20'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="line-clamp-1">
                {template.title || 'Untitled'}
              </CardTitle>
              {/* <CardDescription className="text-xs mt-1">
                {template.title}
              </CardDescription> */}
            </div>
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
              <Star className="h-4 w-4" />
            </Button> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pb-3">
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <div className="flex items-center">
              <FileText className="mr-1 h-4 w-4" />
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (template as any).totalQuestions
              }{' '}
              questions
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {dayjs(template.createdAt).format('DD MMM YYYY')}
            </div>
          </div>

          {/* Question Highlights */}
          <div className="space-y-1.5">
            {template.questions?.map(question => {
              return (
                <div key={question.id} className="flex items-center gap-1.5 text-xs">
                  <div className="bg-muted/50 flex size-3 flex-shrink-0 items-center justify-center rounded-full">
                    <MinusIcon className="size-3" />
                  </div>
                  <div
                    className="text-muted-foreground line-clamp-1 flex-1"
                    dangerouslySetInnerHTML={{
                      __html: question.question || 'No preview available'
                    }}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="flex flex-wrap gap-1">
            {template.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

const EmptyState = ({ message, icon }: { message: string; icon?: React.ReactNode }) => {
  return (
    <div className="bg-muted/20 flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
      <div className="bg-background rounded-full p-4">
        {icon || <BookOpen className="text-muted-foreground size-20" />}
      </div>
      <p className="text-muted-foreground mt-2 mb-1">{message}</p>
      <p className="text-muted-foreground/70 mb-4 text-xs">
        Try adjusting your search or browse all templates
      </p>
      <CreateQuestionTemplateButton />
    </div>
  )
}

export default Page
