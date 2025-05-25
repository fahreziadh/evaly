import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Brain,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Lightbulb,
  Loader2,
  Paperclip,
  RefreshCw,
  Rocket,
  Search,
  SearchIcon,
  VideoIcon,
  Wand2Icon,
  WandSparkles
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { KeyboardEvent, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { trpc } from '@/trpc/trpc.client'

import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { TextLoop } from '../ui/text-loop'
import { Textarea } from '../ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useProgressRouter } from './progress-bar'

interface Props {
  className?: string
  order?: number
  referenceId?: string
  testId?: string
}

const GenerateQuestionInputPrompt = ({
  className,
  order,
  referenceId,
  testId
}: Props) => {
  const autoComplete: string[] = []
  const router = useProgressRouter()
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState('')
  const t = useTranslations('Questions')
  // const searchParams = useSearchParams()

  // const referenceId = searchParams.get("templateId");
  // const showImportSection = searchParams.get("showImportSection");

  const { mutate: startGeneration, isPending: isGenerating } =
    trpc.organization.question.llmValidate.useMutation({
      onSuccess: data => {
        if (!data) {
          toast.error(t('failedToGenerateQuestions'), {
            position: 'top-center'
          })
          return
        }

        if (!data.isValid) {
          toast.error(data.suggestion, {
            position: 'top-center'
          })
          return
        }

        if (!data.templateCreated) {
          toast.error(t('failedToCreateTemplate'), {
            position: 'top-center'
          })
          return
        }

        startTransition(() => {
          if (testId) {
            router.push(
              `/dashboard/question/generate/${data.templateCreated?.id}?order=${order}&referenceid=${referenceId}&testid=${testId}`,
              { scroll: true }
            )
          } else {
            router.push(`/dashboard/question/generate/${data.templateCreated?.id}`, {
              scroll: true
            })
          }
        })
      },
      onError: error => {
        console.error(error)
      }
    })

  const { mutate: improvePrompt, isPending: isPendingImprovePrompt } =
    trpc.organization.question.improvePrompt.useMutation({
      onSuccess: data => {
        setInputValue(data)
      },
      onError: error => {
        toast.error(error.message)
      }
    })

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    startGeneration({ prompt: inputValue })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevent default behavior (new line)
      handleSubmit()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col items-center', className)}
    >
      <TextLoop
        interval={3}
        transition={{
          type: 'spring',
          stiffness: 900,
          damping: 80,
          mass: 10
        }}
        variants={{
          initial: {
            y: 20,
            rotateX: 90,
            opacity: 0,
            filter: 'blur(4px)'
          },
          animate: {
            y: 0,
            rotateX: 0,
            opacity: 1,
            filter: 'blur(0px)'
          },
          exit: {
            y: -20,
            rotateX: -90,
            opacity: 0,
            filter: 'blur(4px)'
          }
        }}
        className="text-primary relative mb-4 w-full max-w-2xl font-mono text-sm"
      >
        <span>
          <WandSparkles className="inline size-3" /> {t('letsCraftYourQuestion')}
        </span>
        <span>
          <Lightbulb className="inline size-3" /> {t('turnIdeasIntoInquiries')}
        </span>
        <span>
          <Brain className="inline size-3" /> {t('designThoughtProvokingQuestions')}
        </span>
        <span>
          <Rocket className="inline size-3" /> {t('createEngagingChallenges')}
        </span>
        <span>
          <Search className="inline size-3" /> {t('sparkCuriosityWithQuestions')}
        </span>
        <span>
          <RefreshCw className="inline size-3" /> {t('transformConceptsIntoQueries')}
        </span>
      </TextLoop>
      <div className="w-full max-w-2xl">
        <div className="relative">
          <Textarea
            autoFocus
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('promptPlaceholder')}
            className={cn(
              'border-border focus-visible:border-border [&::placeholder]:whitespace-pre-rap min-h-[120px] w-full resize-none overflow-clip p-4 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-0 md:text-base',
              autoComplete.length > 0
                ? 'rounded-b-none focus-visible:border-b-transparent'
                : ''
            )}
          />
          <div className="absolute bottom-0 left-0 flex w-full flex-row items-center justify-between gap-2 p-2">
            <div className="flex flex-row items-center justify-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={'icon-sm'}
                    variant={'ghost'}
                    onClick={() => {
                      improvePrompt(inputValue)
                    }}
                    disabled={inputValue.length < 5 || isPendingImprovePrompt}
                  >
                    <Wand2Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('improvePrompt')}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size={'icon-sm'} variant={'ghost'}>
                    <Paperclip />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('attachFiles')}</TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-row items-center justify-center gap-1">
              <Button
                size={'icon-sm'}
                variant={inputValue.trim() ? 'default' : 'secondary-outline'}
                onClick={handleSubmit}
                disabled={isPending || !inputValue.trim() || isGenerating}
              >
                {isPending || isGenerating ? (
                  <Loader2 className="text-muted-foreground size-4 animate-spin stroke-3" />
                ) : (
                  <ArrowRight className="size-4 stroke-3" />
                )}
              </Button>
            </div>
          </div>
          <AnimatePresence>
            {autoComplete.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-background border-foreground/20 border-t-border absolute top-[120px] z-10 w-full rounded-b-2xl border p-2"
              >
                <ScrollArea className="flex h-[200px] flex-col gap-2">
                  {autoComplete.map((item, index) => (
                    <Button
                      key={index}
                      variant={'ghost'}
                      className="w-full justify-start gap-3"
                    >
                      <SearchIcon className="text-muted-foreground size-4" />
                      <span>{item}</span>
                    </Button>
                  ))}
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-4 hidden flex-row flex-wrap justify-start gap-x-2 gap-y-4">
          <Button variant={'outline'} size={'sm'} rounded className="px-4">
            <FileSpreadsheet />
            <span>{t('spreadsheet')}</span>
          </Button>
          <Button variant={'outline'} size={'sm'} rounded className="px-4">
            <FileText />
            <span>{t('importDocument')}</span>
          </Button>
          <Button variant={'outline'} size={'sm'} rounded className="px-4">
            <ImageIcon />
            <span>{t('importImage')}</span>
          </Button>
          <Button variant={'outline'} size={'sm'} rounded className="px-4">
            <VideoIcon />
            <span>{t('youtube')}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default GenerateQuestionInputPrompt
