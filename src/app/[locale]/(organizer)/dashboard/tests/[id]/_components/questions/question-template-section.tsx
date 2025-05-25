import { Link, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import {
  BookOpen,
  Calendar,
  EyeIcon,
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

export const QuestionTemplateSection = ({
  onSelectedIdChange,
  selectedId
}: {
  selectedId?: string
  onSelectedIdChange?: (id: string) => void
}) => {
  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  )
  const [tab, setTab] = useQueryState('tab', parseAsString.withDefault('all'))

  const { data: dataQuestionTemplate } =
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

  return (
    <div className={cn('space-y-6')}>
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
          <div className={cn('grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3')}>
            {filteredDataQuestionTemplate?.map(template => (
              <CardQuestionTemplate
                key={template.id}
                template={template}
                onClick={() =>
                  template.id === selectedId
                    ? onSelectedIdChange?.('')
                    : onSelectedIdChange?.(template.id)
                }
                isSelected={template.id === selectedId}
              />
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
  template,
  onClick,
  isSelected
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
  onClick?: () => void
  isSelected?: boolean
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'group border-border h-full cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-black/5',
        'bg-card hover:bg-muted/20',
        isSelected ? 'border-primary' : ''
      )}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1">
              {template.title || 'Untitled'}
            </CardTitle>
            {/* <CardDescription className="text-xs mt-1">
                  {template.title}
                </CardDescription> */}
          </div>
          <Link
            href={`/dashboard/question/${template.id}`}
            target="_blank"
            className="invisible group-hover:visible"
          >
            <Button variant="ghost" size="icon">
              <EyeIcon className="size-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-3 pb-3">
        <div className="text-muted-foreground flex items-center gap-4 text-xs">
          <div className="flex items-center">
            <FileText className="mr-1 size-3" />
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (template as any).totalQuestions
            }{' '}
            questions
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 size-3" />
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

const CreateQuestionTemplateButton = () => {
  const router = useRouter()
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
