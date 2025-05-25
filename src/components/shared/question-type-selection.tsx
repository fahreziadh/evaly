import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

import { QuestionType } from '@/types/question'

import { questionTypes } from '@/constants/question-type'

import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const QuestionTypeSelection = ({
  value,
  onValueChange,
  size = 'xs',
  variant = 'outline',
  className,
  readonly = false
}: {
  value?: QuestionType | null
  onValueChange?: (value: QuestionType) => void
  size?: React.ComponentProps<typeof Button>['size']
  variant?: React.ComponentProps<typeof Button>['variant']
  className?: string
  readonly?: boolean
}) => {
  const tTestDetail = useTranslations('TestDetail')
  const t = useTranslations('Questions')

  // Get the current selected question type or default to "multiple-choice"
  const selectedType =
    value && questionTypes[value]
      ? questionTypes[value]
      : questionTypes['multiple-choice']

  // Ensure we have a valid icon component before trying to use it
  const SelectedIcon = selectedType?.icon || (() => null)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={size}
          disabled={readonly}
          variant={variant}
          className={cn('cursor-default disabled:opacity-100', className)}
        >
          {SelectedIcon && <SelectedIcon size={16} className="mr-1" />}
          {tTestDetail(selectedType?.value) || tTestDetail('multiple-choice')}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-2">
        <Label className="mb-2 block px-2">{t('questionType')}</Label>
        <div className="flex flex-col gap-1">
          {Object.values(questionTypes).map(type => {
            // Ensure each type has an icon or use a fallback
            const TypeIcon = type.icon || (() => null)
            if (type.isHidden) return null

            return (
              <Button
                onClick={e => {
                  e.stopPropagation()
                  onValueChange?.(type.value as QuestionType)
                }}
                size={'sm'}
                key={type.value}
                className="w-full justify-start gap-2"
                variant={value === type.value ? 'default' : 'ghost'}
              >
                {TypeIcon && <TypeIcon size={16} />}
                {tTestDetail(type.value)}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default QuestionTypeSelection
